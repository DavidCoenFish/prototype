
const Q = require("q");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const CamelCase = require("./camel-case.js");

const getAssetText = function(in_uvDataArrayName, in_uvLinkArrayName, in_textureDataArrayName, in_textureDim, in_canMoveArrayName){
	var dataStreamText = "";
	var dataStreamMap = "";
	for (var index = 0; index < in_uvLinkArrayName.length; ++index){
		dataStreamText += `	const m_link${index}DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[index]}), "STATIC_DRAW", false);\n`;
		dataStreamMap += `			"a_link${index}" : m_link${index}DataStream,\n`;
	}

	if (undefined != in_canMoveArrayName){
		dataStreamText += `	const m_canMove = WebGL.ModelDataStream.factory("FLOAT", 1, new Float32Array(${in_canMoveArrayName}), "STATIC_DRAW", false);\n`;
		dataStreamMap += `			"a_canMove" : m_canMove,\n`;
	}

	return `const WebGL = require("webgl");

const factoryModel = function(in_webGLState){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(${in_uvDataArrayName}), "STATIC_DRAW", false);
${dataStreamText}

	return WebGL.ModelWrapper.factory(
		in_webGLState, 
		"POINTS",
		Math.floor(${in_uvDataArrayName}.length / 2),
		{
			"a_uv" : m_uvDataStream,
${dataStreamMap}
		}
	);
}

const factoryTexture = function(in_webGLState){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLState, 
		${in_textureDim}, 
		${in_textureDim},
		new Float32Array(${in_textureDataArrayName})
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};`; 
}

const getDataArrayText = function(in_sphereArray, in_uvDataArrayName, in_textureDataArrayName, in_textureDim, in_arrayArrayLinkData, in_uvLinkArrayName, in_canMoveArray, in_canMoveArrayName){
	//uv
	var sphereCount = in_sphereArray.length / 4;
	var traceX = 0;
	var traceY = 0;
	var result = `const ${in_uvDataArrayName} = [\n`;
	for (var index = 0; index < sphereCount; index++){
		var u = ((traceX * 2) + 1) / (in_textureDim * 2);
		var v = ((traceY * 2) + 1) / (in_textureDim * 2);
		result += `${u}, ${v},\n`;
		traceX++;
		if (in_textureDim <= traceX){
			traceX = 0;
			traceY++;
		}
	}
	result += `]\n`;

	//link in_arrayArrayLinkData, in_uvLinkArrayName
	for (var index = 0; index < in_uvLinkArrayName.length; ++index){
		result += `const ${in_uvLinkArrayName[index]} = [\n`;
		var arrayLinkData = in_arrayArrayLinkData[index];
		for (var subIndex = 0; subIndex < arrayLinkData.length; subIndex += 3){
			result += `${arrayLinkData[subIndex + 0]}, ${arrayLinkData[subIndex + 1]}, ${arrayLinkData[subIndex + 2]},\n`;
		}
		result += `]\n`;
	}

	//texture
	result += `const ${in_textureDataArrayName} = [\n`;
	var pixelCount = in_textureDim * in_textureDim;
	for (var index = 0; index < pixelCount; index++){
		var sphereIndex = index * 4;
		if (sphereIndex < in_sphereArray.length){
			result += `${in_sphereArray[sphereIndex + 0]}, ${in_sphereArray[sphereIndex + 1]}, ${in_sphereArray[sphereIndex + 2]}, ${in_sphereArray[sphereIndex + 3]},\n`;
		} else {
			result += "0,0,0,0,\n";
		}
	}
	result += `]\n`;

	//can move array
	if (undefined !== in_canMoveArrayName){
		result += `const ${in_canMoveArrayName} = [`;
		for (var index = 0; index < in_canMoveArray.length; index++){
			if ((index % 4) === 0){
				result += `\n`;
			}
			result += String(in_canMoveArray[index]) + ",";
		}
		result += `]\n`;
	}

	return result;
}

const linkHash = function(in_indexX, in_indexY, in_indexZ){
	return `${in_indexX}_${in_indexY}_${in_indexZ}`;
}

const makeLinkMap = function(in_linkArray){
	const result = {};
	for (var index = 0; index < in_linkArray.length; index += 3){
		var key = linkHash(in_linkArray[index + 0], in_linkArray[index + 1], in_linkArray[index + 2]);
		result[key] = index / 3;
	}
	return result;
}

const getLength = function(in_x, in_y, in_z){
	return Math.sqrt((in_x * in_x) + (in_y * in_y) + (in_z * in_z));
}

const linkPoint = function(inout_arrayLinkData, in_sourceX, in_sourceY, in_sourceZ, in_sphereArray, in_sphereIndex, in_linkMap, in_textureDim){
	const key = linkHash(in_sourceX, in_sourceY, in_sourceZ);
	if (false === (key in in_linkMap)){
		inout_arrayLinkData.push(0.0);
		inout_arrayLinkData.push(0.0);
		inout_arrayLinkData.push(0.0);
		return;
	}

	var linkSphereIndex = in_linkMap[key];
	var linkSphereX = in_sphereArray[(linkSphereIndex * 4) + 0];
	var linkSphereY = in_sphereArray[(linkSphereIndex * 4) + 1];
	var linkSphereZ = in_sphereArray[(linkSphereIndex * 4) + 2];

	var sphereX = in_sphereArray[(in_sphereIndex * 4) + 0];
	var sphereY = in_sphereArray[(in_sphereIndex * 4) + 1];
	var sphereZ = in_sphereArray[(in_sphereIndex * 4) + 2];

	const length = getLength(linkSphereX - sphereX, linkSphereY - sphereY, linkSphereZ - sphereZ);
	const vIndex = Math.floor(linkSphereIndex / in_textureDim);
	const v = (vIndex + vIndex + 1) / (in_textureDim + in_textureDim);
	const uIndex = linkSphereIndex - (vIndex * in_textureDim);
	const u = (uIndex + uIndex + 1) / (in_textureDim + in_textureDim);
	inout_arrayLinkData.push(u);
	inout_arrayLinkData.push(v);
	inout_arrayLinkData.push(length);

	return;
}

const makeLinkData = function(inout_arrayArrayLinkData, in_linkArray, in_sphereArray, in_linkMap, in_textureDim, in_canMoveArray){
	var sphereCount = in_sphereArray.length / 4;
	for (var sphereIndex = 0; sphereIndex < sphereCount; ++sphereIndex){
		var sourceX = in_linkArray[(sphereIndex * 3) + 0];
		var sourceY = in_linkArray[(sphereIndex * 3) + 1];
		var sourceZ = in_linkArray[(sphereIndex * 3) + 2];
		var evenY = (0 === (sourceY & 1));
		var evenZ = (0 === (sourceZ & 1));

		if (undefined !== in_canMoveArray){
			in_canMoveArray.push(((sourceY === 0) && (sourceZ === 0)) ? 0.0 : 1.0);
		}

		if ((true === evenY) && (true === evenZ)){
			// {"linkB":[-1,1,0]}
			linkPoint(inout_arrayArrayLinkData[0], sourceX - 1, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,0]}
			linkPoint(inout_arrayArrayLinkData[1], sourceX + 0, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,0]}
			linkPoint(inout_arrayArrayLinkData[2], sourceX + 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,0]}
			linkPoint(inout_arrayArrayLinkData[3], sourceX + 0, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,-1,0]}
			linkPoint(inout_arrayArrayLinkData[4], sourceX - 1, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,0]}
			linkPoint(inout_arrayArrayLinkData[5], sourceX - 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,1]}
			linkPoint(inout_arrayArrayLinkData[6], sourceX - 1, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,1]}
			linkPoint(inout_arrayArrayLinkData[7], sourceX + 0, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,1]}
			linkPoint(inout_arrayArrayLinkData[8], sourceX + 0, sourceY - 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,-1]}
			linkPoint(inout_arrayArrayLinkData[9], sourceX - 1, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,-1]}
			linkPoint(inout_arrayArrayLinkData[10], sourceX + 0, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,-1]}
			linkPoint(inout_arrayArrayLinkData[11], sourceX + 0, sourceY - 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
		} else if ((false === evenY) && (true === evenZ)){
			// {"linkB":[0,1,0]}
			linkPoint(inout_arrayArrayLinkData[0], sourceX + 0, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,1,0]}
			linkPoint(inout_arrayArrayLinkData[1], sourceX + 1, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,0]}
			linkPoint(inout_arrayArrayLinkData[2], sourceX + 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,-1,0]}
			linkPoint(inout_arrayArrayLinkData[3], sourceX + 1, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,0]}
			linkPoint(inout_arrayArrayLinkData[4], sourceX + 0, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,0]}
			linkPoint(inout_arrayArrayLinkData[5], sourceX - 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,1]}
			linkPoint(inout_arrayArrayLinkData[6], sourceX + 0, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,1]}
			linkPoint(inout_arrayArrayLinkData[7], sourceX + 1, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,1]}
			linkPoint(inout_arrayArrayLinkData[8], sourceX + 0, sourceY - 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,-1]}
			linkPoint(inout_arrayArrayLinkData[9], sourceX + 0, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,-1]}
			linkPoint(inout_arrayArrayLinkData[10], sourceX + 1, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,-1]}
			linkPoint(inout_arrayArrayLinkData[11], sourceX + 0, sourceY - 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
		} else if ((true === evenY) && (false === evenZ)){
			// {"linkB":[1,1,0]}
			linkPoint(inout_arrayArrayLinkData[0], sourceX + 1, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,0]}
			linkPoint(inout_arrayArrayLinkData[1], sourceX + 0, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,0]}
			linkPoint(inout_arrayArrayLinkData[2], sourceX + 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,-1,0]}
			linkPoint(inout_arrayArrayLinkData[3], sourceX + 1, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,0]}
			linkPoint(inout_arrayArrayLinkData[4], sourceX + 0, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,0]}
			linkPoint(inout_arrayArrayLinkData[5], sourceX - 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,1]}
			linkPoint(inout_arrayArrayLinkData[6], sourceX + 0, sourceY + 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,1]}
			linkPoint(inout_arrayArrayLinkData[7], sourceX + 1, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,1]}
			linkPoint(inout_arrayArrayLinkData[8], sourceX + 0, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,-1]}
			linkPoint(inout_arrayArrayLinkData[9], sourceX + 0, sourceY + 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,-1]}
			linkPoint(inout_arrayArrayLinkData[10], sourceX + 1, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,-1]}
			linkPoint(inout_arrayArrayLinkData[11], sourceX + 0, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
		} else if ((false === evenY) && (false === evenZ)){
			// {"linkB":[-1,1,0]}
			linkPoint(inout_arrayArrayLinkData[0], sourceX - 1, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,0]}
			linkPoint(inout_arrayArrayLinkData[1], sourceX + 0, sourceY + 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[1,0,0]}
			linkPoint(inout_arrayArrayLinkData[2], sourceX + 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,-1,0]}
			linkPoint(inout_arrayArrayLinkData[3], sourceX + 0, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,-1,0]}
			linkPoint(inout_arrayArrayLinkData[4], sourceX - 1, sourceY - 1, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,0]}
			linkPoint(inout_arrayArrayLinkData[5], sourceX - 1, sourceY + 0, sourceZ + 0, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,1]}
			linkPoint(inout_arrayArrayLinkData[6], sourceX + 0, sourceY + 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,1]}
			linkPoint(inout_arrayArrayLinkData[7], sourceX + 0, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,1]}
			linkPoint(inout_arrayArrayLinkData[8], sourceX - 1, sourceY + 0, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,1,-1]}
			linkPoint(inout_arrayArrayLinkData[9], sourceX + 0, sourceY + 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[0,0,-1]}
			linkPoint(inout_arrayArrayLinkData[10], sourceX + 0, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			// {"linkB":[-1,0,-1]}
			linkPoint(inout_arrayArrayLinkData[11], sourceX - 1, sourceY + 0, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
		}
	}
}

const vec3Distance = function(in_vec3A, in_vec3B){
	var a = in_vec3A[0] - in_vec3B[0];
	var b = in_vec3A[1] - in_vec3B[1];
	var c = in_vec3A[2] - in_vec3B[2];
	var result = Math.sqrt((a * a) + (b * b) + (c * c));
	return result;
}

const testDistance = function(out_arrayData, in_sphereArray, in_linkArray, in_outerSphereIndex, in_outerDataIndex, in_innerSphereIndex, in_innerDataIndex){
	var sphereA = [in_sphereArray[in_outerSphereIndex + 0], in_sphereArray[in_outerSphereIndex + 1], in_sphereArray[in_outerSphereIndex + 2], in_sphereArray[in_outerSphereIndex + 3]];
	var linkA = [in_linkArray[in_outerDataIndex + 0], in_linkArray[in_outerDataIndex + 1], in_linkArray[in_outerDataIndex + 2]];
	var sphereB = [in_sphereArray[in_innerSphereIndex + 0], in_sphereArray[in_innerSphereIndex + 1], in_sphereArray[in_innerSphereIndex + 2], in_sphereArray[in_innerSphereIndex + 3]];
	var linkB = [in_linkArray[in_innerDataIndex + 0], in_linkArray[in_innerDataIndex + 1], in_linkArray[in_innerDataIndex + 2]];

	const distance = vec3Distance(sphereA, sphereB);
	out_arrayData.push({
		"distance" : distance,
		"linkA" : linkA,
		"sphereA" : sphereA,
		"linkB" : linkB,
		"sphereB" : sphereB
	});
}

const testPrintArrayData = function(in_arrayData, in_linkArray, in_outerDataIndex){
	in_arrayData.sort(function(lhs, rhs){ 
		if (lhs.distance < rhs.distance){ return -1; }
		if (rhs.distance < lhs.distance){ return +1; }
		return 0;
	});
	var linkA = in_linkArray[in_outerDataIndex + 0];
	var linkB = in_linkArray[in_outerDataIndex + 1];
	var linkC = in_linkArray[in_outerDataIndex + 2];
	if (
		((linkA === 4) && (linkB === 4) && (linkC == 4)) ||
		((linkA === 4) && (linkB === 5) && (linkC == 4)) ||
		((linkA === 4) && (linkB === 4) && (linkC == 5)) ||
		((linkA === 4) && (linkB === 5) && (linkC == 5))
	){
		var message = `${linkA} ${linkB} ${linkC}:`;
		var item = in_arrayData[0];
		message += `{"sphereA":[${item.sphereA[0]}, ${item.sphereA[1]}, ${item.sphereA[2]}, ${item.sphereA}],\n`;

		for (var index = 0; index < 12; ++index){
			item = in_arrayData[index];
			message += `"distance": ${item.distance},\n`;
			message += `"linkB":[${item.linkB[0] - linkA}, ${item.linkB[1] - linkB}, ${item.linkB[2] - linkC},`;
		}
		console.log(message);
	}
}


const test = function(in_sphereArray,  in_linkArray){
	// var textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(in_sphereArray.length / 4))));
	// console.log("textureDim:" + textureDim + " sphereCount:" + in_sphereArray.length / 4);

	// var arrayArrayLinkData = [];
	// for (var index = 0; index < 12; ++index){
	// 	arrayArrayLinkData.push([]);
	// }

	// const linkMap = makeLinkMap(in_linkArray);
	// makeLinkData(arrayArrayLinkData, in_linkArray, in_sphereArray, linkMap, textureDim);
	const sphereCount = in_sphereArray.length / 4;
	for (var index = 0; index < sphereCount; ++index){
		var arrayData = [];
		var outerSphereIndex = index * 4;
		var outerDataIndex = index * 3;
		for (var subIndex = 0; subIndex < sphereCount; ++subIndex){
			if (subIndex === index){
				continue;
			}
			var innerSphereIndex = subIndex * 4;
			var innerDataIndex = subIndex * 3;
			testDistance(arrayData, in_sphereArray, in_linkArray, outerSphereIndex, outerDataIndex, innerSphereIndex, innerDataIndex);
		}

		testPrintArrayData(arrayData, in_linkArray, outerDataIndex);
	}
}

const run12 = function(in_sphereArray, in_linkArray, in_fileAssetPath, in_fileDataPath, in_baseName){
	const rootName = CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(in_baseName));
	var uvDataArrayName = "gUv" + rootName;
	var uvLinkArrayName = [];
	var arrayArrayLinkData = [];
	for (var index = 0; index < 12; ++index){
		uvLinkArrayName.push("gLink" + index + rootName);
		arrayArrayLinkData.push([]);
	}
	var canMoveArrayName = undefined; //"gCanMove" + rootName;
	var canMoveArray = undefined; //[];

	var textureDataArrayName ="gTex" + rootName;
	var textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(in_sphereArray.length / 4))));
	console.log("textureDim:" + textureDim + " sphereCount:" + in_sphereArray.length / 4);

	const linkMap = makeLinkMap(in_linkArray);
	makeLinkData(arrayArrayLinkData, in_linkArray, in_sphereArray, linkMap, textureDim, canMoveArray);

	var assetText = getAssetText(uvDataArrayName, uvLinkArrayName, textureDataArrayName, textureDim, canMoveArrayName);
	var dataText = getDataArrayText(in_sphereArray, uvDataArrayName, textureDataArrayName, textureDim, arrayArrayLinkData, uvLinkArrayName, canMoveArray, canMoveArrayName);

	return FsExtra.writeFile(in_fileAssetPath, assetText).then(function(){
		return FsExtra.writeFile(in_fileDataPath, dataText);
	});
}

module.exports = {
	"test" : test,
	"run12" : run12
}