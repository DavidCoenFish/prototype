const Q = require("q");
const FileSystem = require("fs");
const FileSystemExtra = require("fs-extra");
const Path = require("path");
const Base64 = require(".//base64.js");
const UnitTest = require(".//unittest.js");

console.log(new Date().toLocaleTimeString());

/*
our aim is to take the float byte dump (from gimp python) of a hdr evn map
we then want to make spherical space blur maps at various radius
	make a collection of normals (points on unit sphere) with colour?
	any normal within tollerance of query normal is our sampled pixel

    "test": "node --nolazy --inspect-brk=5858 index.js test",
    "env1": "node --nolazy --inspect-brk=5858 index.js input\\syferfontein_18d_clear_1k_.dat output\\env1.js sEnv1_"

*/

const makeDirectory = function(in_filePath){
	var deferred = Q.defer();
	//console.log("makeDirectory:" + in_filePath + " dirname:" + Path.dirname(in_filePath));
	FileSystem.mkdir(Path.dirname(in_filePath), { recursive: true }, function(error){
		if (error && (error.code !== 'EEXIST')){
			//console.log("error:" + error);
			throw error;
		}
		deferred.resolve(true);
	});
	return deferred.promise;
}

const DotProduct = function(in_lhs, in_rhs){
	return (in_lhs[0] * in_rhs[0]) + (in_lhs[1] * in_rhs[1]) + (in_lhs[2] * in_rhs[2]);
}

const floatByteFileToTextureFactory = function(in_file, in_width, in_height){
	var arrayBuffer = new ArrayBuffer(4);
	var view = new DataView(arrayBuffer);
	var pixels = new Float32Array(in_width * in_height * 3);
	var trace = 0;
	var count = in_width * in_height * 4;
	var value = 0;
	for (var index = 0; index < count; ++index){
		if (3 === (index & 3)){
			continue;
		} 

		view.setUint8(0, in_file[(index * 4) + 3]);
		view.setUint8(1, in_file[(index * 4) + 2]);
		view.setUint8(2, in_file[(index * 4) + 1]);
		view.setUint8(3, in_file[(index * 4) + 0]);
		value = view.getFloat32(0);

		pixels[trace] = value;
		trace += 1;
	}

	return pixelsToTextureFactory(pixels, in_width, in_height);
}

const pixelsToTextureFactory = function(in_pixels, in_width, in_height){
	//{"lowIndex", "highIndex", "lowWeight", "highWeight"}
	const m_pixels = in_pixels;
	const MakeSampleWrap = function(in_uv, in_dim){
		var uv = in_uv;
		while(uv < 0.0){
			uv += 1.0;
		}
		uv %= 1;
		var temp = uv * (in_dim - 1);
		var index = Math.floor(temp);
		var remainder = temp - index;
		var nextIndex = index + 1;
		while (in_dim <= nextIndex){
			nextIndex -= in_dim;
		}
		return {
			"lowIndex":index, 
			"highIndex":nextIndex, 
			"lowWeight":1.0 - remainder, 
			"highWeight":remainder
		};
	}

	const AddPixel = function(inout_pixel, in_xIndex, in_yIndex, in_weight){
		var index = ((in_yIndex * in_width) + in_xIndex) * 3;
		inout_pixel[0] += (m_pixels[index + 0] * in_weight);
		inout_pixel[1] += (m_pixels[index + 1] * in_weight);
		inout_pixel[2] += (m_pixels[index + 2] * in_weight);
	}

	const that = Object.create({
		"width" : in_width,
		"height" : in_height,
		"pixels" : m_pixels,
		"sample" : function(in_uvX, in_uvY){
			const xSample = MakeSampleWrap(in_uvX, in_width);
			const YSample = MakeSampleWrap(in_uvY, in_height);
			var pixel = [0.0, 0.0, 0.0];

			AddPixel(pixel, xSample.lowIndex, YSample.lowIndex, xSample.lowWeight * YSample.lowWeight);
			AddPixel(pixel, xSample.lowIndex, YSample.highIndex, xSample.lowWeight * YSample.highWeight);
			AddPixel(pixel, xSample.highIndex, YSample.lowIndex, xSample.highWeight * YSample.lowWeight);
			AddPixel(pixel, xSample.highIndex, YSample.highIndex, xSample.highWeight * YSample.highWeight);

			return pixel;
		}
	});

	return that;
}

const degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
};
const radianToDegrees = function(radians) {
  return radians * 180 / Math.PI;
};
const latLongToNormal = function(in_latRadian, in_longRadian){
	const cosLat = Math.cos(in_latRadian);
	const cosLong = Math.cos(in_longRadian);
	const sinLat = Math.sin(in_latRadian);
	const sinLong = Math.sin(in_longRadian);
	const x = cosLong * cosLat;
	const y = sinLong * cosLat;
	const z = sinLat;
	return [x,y,z];
}

const modBase = function(in_value, in_base){
	var temp = in_value / in_base;
	temp %= 1.0;
	if (temp < 0){
		temp = 1.0 + temp;
	}
	return temp * in_base;
}

const latLongToUV = function(in_latRadian, in_longRadian){
	const uvX = modBase(radianToDegrees(in_longRadian), 360.0) / 360.0; //0 ... 1
	const uvY = (radianToDegrees(in_latRadian) / 180.0) + 0.5; //0 ... 1
	return [uvX,uvY];
}

const latLongTextureSample = function(in_lat, in_long, in_textureData){
	const uv = latLongToUV(in_lat, in_long);
	const pixel = in_textureData.sample(uv[0], uv[1]); 
	return pixel;
}

const sGoldenRatio = (Math.sqrt(5.0) + 1.0) / 2.0;  // golden ratio = 1.6180339887498948482
const sGoldenAngle = (2.0 - sGoldenRatio) * (2.0 * Math.PI);  // golden angle = 2.39996322972865332

const sampleSphereObjectFactory = function(in_desiredNumberOfPoints, in_textureData) {

	//https://bduvenhage.me/geometry/2019/07/31/generating-equidistant-vectors.html
	var m_data = [];
	for (var index = 0; index < in_desiredNumberOfPoints; ++index){
		const lat = Math.asin(-1.0 + 2.0 * index / (in_desiredNumberOfPoints+1));
		const long = sGoldenAngle * index;
		const normal = latLongToNormal(lat, long);
		const colour = latLongTextureSample(lat, long, in_textureData);
		m_data.push({
			"normal" : normal,
			"colour" : colour
		});
	}

	//are we suffering numeric underflow adding small and large

	
	const makeAverage = function(in_array, dotResultArray){
		var result = 0;
		in_array.forEach(function(in_item){
			average += in_item;
		});

	}
	const makeAverageB = function(in_array){
		var average = 0.0;
		var count = in_array.length;
		if ( 0 === count){
			return average;
		}
		var countMul = 1.0 / count;
		in_array.forEach(function(in_item){
			average += in_item;
		});
		average *= countMul;
		var underCount = 0;
		var underSum = 0.0;
		var overAverage = 0.0;
		in_array.forEach(function(in_item){
			if (in_item < average){
				underCount += 1;
				underSum += in_item;
			} else {
				overAverage += (in_item * countMul);
			}
		});
		if (0 < underCount){
			overAverage += (underSum / underCount);
		}

		return overAverage;
	}

	const that = Object.create({
		"sample" : function(in_normal, in_dotProductTollerance){
			var cover = 0;
			var count = 0;
			var colourSum = [0.0, 0.0, 0.0];
			var colourMax = [0.0, 0.0, 0.0];
			var range = 1.0 - Math.max(0.0, in_dotProductTollerance);
			m_data.forEach(function(in_item){
				var dotResult = DotProduct(in_normal, in_item.normal);
				if (in_dotProductTollerance <= dotResult){
					var tempCover = (Math.max(0.0, dotResult) / range);
					colourSum[0] += in_item.colour[0] * tempCover;
					colourSum[1] += in_item.colour[1] * tempCover;
					colourSum[2] += in_item.colour[2] * tempCover;
					colourMax[0] = Math.max(colourMax[0], in_item.colour[0]);
					colourMax[1] = Math.max(colourMax[1], in_item.colour[1]);
					colourMax[2] = Math.max(colourMax[2], in_item.colour[2]);
					cover += tempCover;
					count += 1;
				}
			});
			if (0.0 < cover){
				colourSum[0] /= cover;
				colourSum[1] /= cover;
				colourSum[2] /= cover;
			}
			return colourSum;
		}
	});

	return that;
}

const makeColorUnitSphere = function(in_textureData){
	var minDegreesBetweenSourcePixels = 360.0 / in_textureData.width;
	var areaOfUnitSphere = 12 * Math.PI;
	var areaAngularCap = 2 * Math.PI * (1 - Math.cos(degreesToRadians(minDegreesBetweenSourcePixels)));
	var desiredNumberOfPoints = Math.ceil(areaOfUnitSphere / areaAngularCap);
	var sampleSphereObject = sampleSphereObjectFactory(desiredNumberOfPoints, in_textureData);
	return sampleSphereObject;
}

const floatArrayAsDataString = function(in_floatArray, in_name){
	var dataString = Base64.Float32ArrayToBase64(in_floatArray);
	return `var ${in_name} = "${dataString}";
`;
}

const makeDataString = function(in_name, in_colorUnitSphere, in_width, in_height, in_blurRadius){
	var pixels = new Float32Array(in_width * in_height * 3);

	var pixelTrace = 0;
	//A · B = cos(Θ)
	var dotProductTollerance = Math.cos(degreesToRadians((in_blurRadius / in_width) * 360.0));
	for (var indexY = 0; indexY < in_height; ++indexY){
		for (var indexX = 0; indexX < in_width; ++indexX){
			const long = degreesToRadians((indexX + indexX + 1) / (in_width + in_width) * 360.0);
			const lat = -degreesToRadians(((indexY + indexY + 1) / (in_height + in_height) * 180.0) - 90.0);
			const normal =  latLongToNormal(lat, long);
			const colour = in_colorUnitSphere.sample(normal, dotProductTollerance);
			pixels[pixelTrace + 0] = colour[0];
			pixels[pixelTrace + 1] = colour[1];
			pixels[pixelTrace + 2] = colour[2];
			pixelTrace += 3;
		}
	}

	return floatArrayAsDataString(pixels, in_name);
}

const run = function(in_inputFilePath, in_outputFilePath, in_name){
	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {
			return FileSystem.readFileSync(in_inputFilePath);
		}).then(function(in_file) {
			return floatByteFileToTextureFactory(in_file, 512, 256);
		}).then(function(in_textureData) {
			return makeColorUnitSphere(in_textureData);
		}).then(function(in_colorUnitSphere) {
			var outputString = "";

			outputString += makeDataString(in_name + "00", in_colorUnitSphere, 256, 128, 1);
			outputString += makeDataString(in_name + "01", in_colorUnitSphere, 256, 128, 4);
			outputString += makeDataString(in_name + "02", in_colorUnitSphere, 256, 128, 16);
			outputString += makeDataString(in_name + "03", in_colorUnitSphere, 256, 128, 64);

			return outputString;
		}).then(function(in_output) {
			FileSystem.writeFileSync(in_outputFilePath, in_output);
			return;
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
			process.exit(-1);
		});
}

const test = function(){
	promiseFactoryArray = [];

	promiseFactoryArray.push(function(){
		//sanity latLongToNormal
		var v0 = latLongToNormal(0,0);
		UnitTest.DealTestAlmost("latLongToNormal00", v0[0], 1.0);
		UnitTest.DealTestAlmost("latLongToNormal01", v0[1], 0.0);
		UnitTest.DealTestAlmost("latLongToNormal02", v0[2], 0.0);

		var v1 = latLongToNormal(0,degreesToRadians(90.0));
		UnitTest.DealTestAlmost("latLongToNormal10", v1[0], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToNormal11", v1[1], 1.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToNormal12", v1[2], 0.0, 0.0000000001);

		var v2 = latLongToNormal(0,degreesToRadians(-90.0));
		UnitTest.DealTestAlmost("latLongToNormal20", v2[0], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToNormal21", v2[1], -1.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToNormal22", v2[2], 0.0, 0.0000000001);

		var v3 = latLongToNormal(degreesToRadians(90.0), 0.0);
		UnitTest.DealTestAlmost("latLongToNormal30", v3[0], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToNormal31", v3[1], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToNormal32", v3[2], 1.0, 0.0000000001);
	});

	promiseFactoryArray.push(function(){
		//sanity modBase(in_value, in_base)
		UnitTest.DealTestAlmost("modBase0", modBase(128, 360), 128, 0.0000000001);
		UnitTest.DealTestAlmost("modBase1", modBase(361, 360), 1, 0.0000000001);
		UnitTest.DealTestAlmost("modBase2", modBase(-179, 360), 181, 0.0000000001);
		UnitTest.DealTestAlmost("modBase3", modBase(-1, 360), 359, 0.0000000001);
		UnitTest.DealTestAlmost("modBase4", modBase(-361, 360), 359, 0.0000000001);
	});

	promiseFactoryArray.push(function(){
		//sanity latLongToUV(in_latRadian, in_longRadian)
		var v0 = latLongToUV(0,0);
		UnitTest.DealTestAlmost("latLongToUV00", v0[0], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToUV01", v0[1], 0.5, 0.0000000001);

		var v1 = latLongToUV(0,degreesToRadians(90.0));
		UnitTest.DealTestAlmost("latLongToUV10", v1[0], 0.25, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToUV11", v1[1], 0.5, 0.0000000001);

		var v2 = latLongToUV(0,degreesToRadians(-90.0));
		UnitTest.DealTestAlmost("latLongToUV20", v2[0], 0.75, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToUV21", v2[1], 0.5, 0.0000000001);

		var v3 = latLongToUV(degreesToRadians(90.0),0);
		UnitTest.DealTestAlmost("latLongToUV30", v3[0], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("latLongToUV31", v3[1], 1.0, 0.0000000001);
	});


	//	var pixels = new Float32Array(in_width * in_height * 3);
	//	const pixelsToTextureFactory = function(in_pixels, in_width, in_height){
	promiseFactoryArray.push(function(){
		//sanity pixelsToTextureFactory(in_pixels, in_width, in_height)
		var pixels = new Float32Array([0,0,0, 1.0,0,0, 0,1,0, 1,1,1]);
		var tex0 = pixelsToTextureFactory(pixels, 2, 2);

		var v0 = tex0.sample(0,0);
		UnitTest.DealTestAlmost("pixelsToTextureFactory00", v0[0], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("pixelsToTextureFactory01", v0[1], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("pixelsToTextureFactory02", v0[2], 0.0, 0.0000000001);

		var v1 = tex0.sample(0.5,0.5);
		UnitTest.DealTestAlmost("pixelsToTextureFactory10", v1[0], 0.5, 0.0000000001);
		UnitTest.DealTestAlmost("pixelsToTextureFactory11", v1[1], 0.5, 0.0000000001);
		UnitTest.DealTestAlmost("pixelsToTextureFactory12", v1[2], 0.25, 0.0000000001);

		var v2 = tex0.sample(0.1,0);
		UnitTest.DealTestAlmost("pixelsToTextureFactory20", v2[0], 0.1, 0.0000000001);
		UnitTest.DealTestAlmost("pixelsToTextureFactory21", v2[1], 0.0, 0.0000000001);
		UnitTest.DealTestAlmost("pixelsToTextureFactory22", v2[2], 0.0, 0.0000000001);

	});


	UnitTest.RunUnitTests(promiseFactoryArray);
}

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	test();
}
else if (5 == process.argv.length){
	run(process.argv[2], process.argv[3], process.argv[4]);
}
else{
	console.log("usage");
	console.log("env-hdr-to-factory test");
	console.log("env-hdr-to-factory <inputFilePath> <outputFilePath> <name>");
	process.exit(0);
}
