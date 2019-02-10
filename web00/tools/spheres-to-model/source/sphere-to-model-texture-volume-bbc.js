const FsExtra = require("fs-extra");
const CamelCase = require("./camel-case.js");

//https://www.mathwarehouse.com/geometry/triangles/area/herons-formula-triangle-area.php
const vec3AreaTriangle = function(in_vecA, in_vec3B, in_vec3C){
	const A = vec3Distance(in_vecA, in_vec3B);
	const B = vec3Distance(in_vecB, in_vec3C);
	const C = vec3Distance(in_vecC, in_vec3A);
	const S = (A + B + C) / 2;
	const area = Math.sqrt(S * (S - A) * (S - B) * (S - C));
	return area;
}

const vec3Cross = function(in_vecA, in_vecB){
	return [
		(in_vecA[1] * in_vecB[2]) - (in_vecA[2] * in_vecB[1]),
		(in_vecA[2] * in_vecB[0]) - (in_vecA[0] * in_vecB[2]),
		(in_vecA[0] * in_vecB[1]) - (in_vecA[1] * in_vecB[0])
	];
}

const vec3Dot = function(in_vecA, in_vecB){
	return (in_vecA[0] * in_vecB[0]) + (in_vecA[1] * in_vecB[1]) + (in_vecA[2] * in_vecB[2]);
}

const vec3Distance = function(in_vec3A, in_vec3B){
	var a = in_vec3A[0] - in_vec3B[0];
	var b = in_vec3A[1] - in_vec3B[1];
	var c = in_vec3A[2] - in_vec3B[2];
	var result = Math.sqrt((a * a) + (b * b) + (c * c));
	return result;
}

const vec3Normalise = function(in_vec3){
	const a = in_vec3[0];
	const b = in_vec3[1];
	const c = in_vec3[2];
	var length = Math.sqrt((a * a) + (b * b) + (c * c));
	if (0.0 === length){
		return [0.0, 0.0, 0.0];
	}
	return [a/length, b/length, c/length];
}

const vec3Subtract = function(in_vec3A, in_vec3B){
	return [ in_vec3A[0] - in_vec3B[0],
		in_vec3A[1] - in_vec3B[1],
		in_vec3A[2] - in_vec3B[2]];
}

const dotProduct = function(in_vecA, in_vecB){
	return ((in_vecA[0] * in_vecB[0]) + (in_vecA[1] * in_vecB[1]) + (in_vecA[2] * in_vecB[2]));
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

const vec3Volume = function(in_offsetA, in_offsetB, in_offsetC){
	const volume = vec3Dot(in_offsetA, vec3Cross(in_offsetB, in_offsetC)) / 6.0;
	return volume;
}

const testVolumeData = function(out_arrayVolumeData, in_arrayData, in_indexA, in_indexB, in_indexC){
	const vecA = vec3Subtract(in_arrayData[in_indexA].sphereB, in_arrayData[in_indexA].sphereA);
	const vecB = vec3Subtract(in_arrayData[in_indexB].sphereB, in_arrayData[in_indexB].sphereA);
	const vecC = vec3Subtract(in_arrayData[in_indexC].sphereB, in_arrayData[in_indexC].sphereA);
	const normalA = vec3Normalise(vecA);
	const normalB = vec3Normalise(vecB);
	const normalC = vec3Normalise(vecC);
	var maxDot = (1 - dotProduct(normalA, normalB)) + (1 - dotProduct(normalB, normalC)) + (1 - dotProduct(normalC, normalA));
	maxDot = Math.round(maxDot * 24);
	const volume = vec3Volume(vecA, vecB, vecC);

	if (Math.abs(volume) < Number.EPSILON){
		return;
	}

	if (volume < 0.0){
		out_arrayVolumeData.push({
			"maxDot" : maxDot,
			"volume" : -volume,
			"linkA" : in_arrayData[in_indexA].linkB,
			"indexA" : in_indexA,
			"linkB" : in_arrayData[in_indexB].linkB,
			"indexB" : in_indexB,
			"linkC" : in_arrayData[in_indexC].linkB,
			"indexC" : in_indexC,
		});
	} else {
		out_arrayVolumeData.push({
			"maxDot" : maxDot,
			"volume" : volume,
			"linkA" : in_arrayData[in_indexA].linkB,
			"indexA" : in_indexA,
			"linkC" : in_arrayData[in_indexB].linkB,
			"indexC" : in_indexB,
			"linkB" : in_arrayData[in_indexC].linkB,
			"indexB" : in_indexC,
		});
	}
}

const isArray4Pair = function(in_a, in_b){
	for (var index = 0; index < 3; ++index){
		var aa = in_a[index];
		var ab = in_a[(index + 1) % 3];
		var ac = in_a[(index + 2) % 3];
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			var ba = in_b[subIndex];
			var bb = in_b[(subIndex + 1) % 3];
			var bc = in_b[(subIndex + 2) % 3];
			
			if (aa === ba){
				if ((ab === bb) || (ab == bc)){
					return true;
				}
				if ((ac === bb) || (ac == bc)){
					return true;
				}
			}
		}
	}
	return false;
}

const isGoodPairVolume = function(in_a, in_b){
	for (var index = 0; index < 3; ++index){
		var aa = in_a[index];
		var ab = in_a[(index + 1) % 3];
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			var ba = in_b[subIndex];
			var bb = in_b[(subIndex + 1) % 3];
			
			if ((aa === bb) && (ab === ba)){
				return true;
			}
		}
	}
	return false;
}

const testPrintVolumeDataItem = function(in_item, in_linkData){
	var message = "";
	message += `[[${in_linkData[in_item.indexA]}],[${in_linkData[in_item.indexB]}],[${in_linkData[in_item.indexC]}]],`;
	//message += `"maxDot":${item.maxDot},"volume":${item.volume},`;
	//message += `[${item.indexA}, ${item.indexB}, ${item.indexC}]`;
	message += `\n`;
	return message;
}


const testPrintArrayVolumeData = function(in_arrayVolumeData, in_originLink, in_linkData){
	in_arrayVolumeData.sort(function(lhs, rhs){ 
		if (lhs.maxDot < rhs.maxDot){ return -1; }
		if (rhs.maxDot < lhs.maxDot){ return +1; }
		return 0;
	});

	var array4Pair = [];
	for (var index = 8; index < 32; ++index){ //in_arrayVolumeData.length; ++index){
		const item = in_arrayVolumeData[index];
		var foundSubIndex = undefined;
		for (var subIndex = 0; subIndex < array4Pair.length; ++subIndex){
			if (true === isArray4Pair(array4Pair[subIndex].key, [item.indexA, item.indexB, item.indexC])){
				foundSubIndex = subIndex;
				break;
			}
		}
		if (undefined === foundSubIndex){
			array4Pair.push({
				"key" : [item.indexA, item.indexB, item.indexC],
				"item" : item,
				"data" : [],
				"dataItem" : []
			});
		} else {
			array4Pair[foundSubIndex].data.push([item.indexA, item.indexB, item.indexC]);
			array4Pair[foundSubIndex].dataItem.push(item);
		}
	}

	var filteredPairData = [];
	for (var index = 0; index < array4Pair.length; ++index){
		const item = array4Pair[index];
		filteredPairData.push(item.item);
		for (var subIndex = 0; subIndex < item.data.length; ++subIndex){
			const subItem = item.data[subIndex];
			if (true == isGoodPairVolume(item.key, subItem)){
				filteredPairData.push(item.dataItem[subIndex]);
			}
		}
	}

	var message = "";
	for (var index = 0; index < 8; ++index){ //in_arrayVolumeData.length; ++index){
		const item = in_arrayVolumeData[index];
		message += testPrintVolumeDataItem(item, in_linkData);
	}

	for (var index = 0; index < filteredPairData.length; ++index){
		const item = filteredPairData[index];
		message += testPrintVolumeDataItem(item, in_linkData);
	}
	console.log(message);

}

const testPrintArrayData = function(in_arrayData, in_linkArray, in_outerDataIndex){
	var linkA = in_linkArray[in_outerDataIndex + 0];
	var linkB = in_linkArray[in_outerDataIndex + 1];
	var linkC = in_linkArray[in_outerDataIndex + 2];

	in_arrayData.sort(function(lhs, rhs){
		var lhsD = Math.round(lhs.distance * 2.0); 
		var rhsD = Math.round(rhs.distance * 2.0); 
		if (lhsD < rhsD){ return -1; }
		if (rhsD < lhsD){ return +1; }

		const lhsZ = lhs.linkB[2] - linkC;
		const rhsZ = rhs.linkB[2] - linkC;
		if (lhsZ < rhsZ){ return +1; }
		if (rhsZ < lhsZ){ return -1; }

		const lhsY = lhs.linkB[1] - linkB;
		const rhsY = rhs.linkB[1] - linkB;
		if (lhsY < rhsY){ return +1; }
		if (rhsY < lhsY){ return -1; }

		const lhsX = lhs.linkB[0] - linkA;
		const rhsX = rhs.linkB[0] - linkA;
		if (lhsX < rhsX){ return -1; }
		if (rhsX < lhsX){ return +1; }

		return 0;
	});
	if (
		((linkA === 4) && (linkB === 4) && (linkC == 4))
		|| ((linkA === 4) && (linkB === 5) && (linkC == 4))
		|| ((linkA === 4) && (linkB === 4) && (linkC == 5))
		|| ((linkA === 4) && (linkB === 5) && (linkC == 5))
	)
	{
		var message = `${linkA} ${linkB} ${linkC}:`;
		var item = in_arrayData[0];
		message += `{"sphereA":[${item.sphereA[0]}, ${item.sphereA[1]}, ${item.sphereA[2]}, ${item.sphereA[3]}],\n`;

		var linkData = [];
		for (var index = 0; index < 12; ++index){
			item = in_arrayData[index];
			//message += `"link${index}":[${item.linkB[0] - linkA}, ${item.linkB[1] - linkB}, ${item.linkB[2] - linkC}],\n`;
			linkData.push([item.linkB[0] - linkA, item.linkB[1] - linkB, item.linkB[2] - linkC]);
		}

		console.log(message);

		//now i want to consider the 12 points for volume information
		arrayVolumeData = [];
		for (var index = 0; index < 12; ++index){
			for (var subIndex = index + 1; subIndex < 12; ++subIndex){
				for (var subSubIndex = subIndex + 1; subSubIndex < 12; ++subSubIndex){
					testVolumeData(arrayVolumeData, in_arrayData, index, subIndex, subSubIndex);
				}
			}
		}

		testPrintArrayVolumeData(arrayVolumeData, [linkA, linkB, linkC], linkData);
	}
}

const test = function(in_sphereArray,  in_linkArray){
	console.log(vec3Volume([1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]));

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

const getAssetText = function(in_uvDataArrayName, in_volumeUvPairArrayNameArray, in_volumeDataArrayNameArray, in_textureDataArrayName, in_textureDim){
	var dataStreamText = "";
	var dataStreamMap = "";
	for (var index = 0; index < in_volumeUvPairArrayNameArray.length; ++index){
		dataStreamText += `	const m_volumeUvPair${index}DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(${in_volumeUvPairArrayNameArray[index]}), "STATIC_DRAW", false);\n`;
		dataStreamMap += `			"a_volumeUvPair${index}" : m_volumeUvPair${index}DataStream,\n`;
	}
	for (var index = 0; index < in_volumeDataArrayNameArray.length; ++index){
		dataStreamText += `	const m_volumeData${index}DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(${in_volumeDataArrayNameArray[index]}), "STATIC_DRAW", false);\n`;
		dataStreamMap += `			"a_volumeData${index}" : m_volumeData${index}DataStream,\n`;
	}

	return `const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(${in_uvDataArrayName}), "STATIC_DRAW", false);
${dataStreamText}

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(${in_uvDataArrayName}.length / 2),
		{
			"a_uv" : m_uvDataStream,
${dataStreamMap}
		}
	);
}

const factoryTexture = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
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

const getDataArrayText = function(in_sphereArray, in_uvDataArrayName, in_textureDataArrayName, in_textureDim, in_arrayArrayLinkData, in_uvLinkArrayName){
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

	return result;
}

const gYEvenZEven = [
[[-1,0,1],[0,0,1],[0,-1,1]],
[[-1,0,-1],[0,-1,-1],[0,0,-1]],
[[-1,-1,0],[0,-1,0],[0,-1,-1]],
[[0,1,0],[0,0,-1],[1,0,0]],
[[-1,1,0],[-1,0,0],[-1,0,-1]],
[[0,-1,1],[0,-1,0],[-1,-1,0]],
[[0,0,1],[0,1,0],[1,0,0]],
[[-1,0,1],[-1,0,0],[-1,1,0]],
[[0,1,0],[-1,0,-1],[0,0,-1]],
[[-1,1,0],[-1,0,-1],[0,1,0]],
[[0,0,1],[1,0,0],[0,-1,0]],
[[1,0,0],[0,-1,-1],[0,-1,0]],
[[1,0,0],[0,0,-1],[0,-1,0]],
[[0,0,1],[0,-1,0],[0,-1,1]],
[[0,-1,0],[0,0,-1],[0,-1,-1]],
[[-1,-1,0],[0,-1,-1],[-1,0,-1]],
[[-1,0,0],[-1,-1,0],[-1,0,-1]],
[[-1,0,1],[-1,1,0],[0,1,0]],
[[-1,0,1],[0,1,0],[0,0,1]],
[[-1,0,1],[-1,-1,0],[-1,0,0]],
[[-1,0,1],[0,-1,1],[-1,-1,0]],
];

const gYOddZEven = [
[[0,0,1],[1,0,1],[0,-1,1]],
[[0,0,-1],[0,-1,-1],[1,0,-1]],
[[0,-1,0],[1,-1,0],[0,-1,-1]],
[[1,1,0],[1,0,-1],[1,0,0]],
[[0,1,0],[-1,0,0],[0,0,-1]],
[[0,-1,1],[1,-1,0],[0,-1,0]],
[[1,0,1],[1,1,0],[1,0,0]],
[[0,0,1],[-1,0,0],[0,1,0]],
[[1,1,0],[0,0,-1],[1,0,-1]],
[[0,1,0],[0,0,-1],[1,1,0]],
[[1,0,1],[1,0,0],[1,-1,0]],
[[1,0,0],[0,-1,-1],[1,-1,0]],
[[1,0,0],[1,0,-1],[1,-1,0]],
[[1,0,1],[1,-1,0],[0,-1,1]],
[[1,-1,0],[1,0,-1],[0,-1,-1]],
[[0,-1,0],[0,-1,-1],[0,0,-1]],
[[-1,0,0],[0,-1,0],[0,0,-1]],
[[0,0,1],[0,1,0],[1,1,0]],
[[0,0,1],[1,1,0],[1,0,1]],
[[0,0,1],[0,-1,0],[-1,0,0]],
[[0,0,1],[0,-1,1],[0,-1,0]],
];

const gYEvenZOdd = [
[[0,1,1],[1,0,1],[0,0,1]],
[[0,1,-1],[0,0,-1],[1,0,-1]],
[[1,0,0],[1,0,-1],[1,-1,0]],
[[-1,0,0],[0,-1,0],[0,0,-1]],
[[0,1,0],[0,1,-1],[1,1,0]],
[[1,0,1],[1,0,0],[1,-1,0]],
[[0,0,1],[0,-1,0],[-1,0,0]],
[[0,1,1],[0,1,0],[1,1,0]],
[[1,1,0],[0,1,-1],[1,0,-1]],
[[1,1,0],[1,0,-1],[1,0,0]],
[[0,1,1],[1,1,0],[1,0,1]],
[[1,0,1],[1,1,0],[1,0,0]],
[[1,0,1],[1,-1,0],[0,-1,0]],
[[0,-1,0],[1,-1,0],[1,0,-1]],
[[0,-1,0],[1,-1,0],[0,0,-1]],
[[0,0,1],[1,0,1],[0,-1,0]],
[[1,-1,0],[1,0,-1],[0,0,-1]],
[[0,1,0],[-1,0,0],[0,1,-1]],
[[0,1,1],[-1,0,0],[0,1,0]],
[[0,0,1],[-1,0,0],[0,1,0]],
[[-1,0,0],[0,0,-1],[0,1,-1]],
[[0,1,1],[0,0,1],[0,1,0]],
];

const gYOddZOdd = [
[[0,1,1],[0,0,1],[-1,0,1]],
[[0,1,-1],[-1,0,-1],[0,0,-1]],
[[1,0,0],[0,0,-1],[0,-1,0]],
[[-1,0,0],[-1,-1,0],[-1,0,-1]],
[[-1,1,0],[0,1,-1],[0,1,0]],
[[0,0,1],[1,0,0],[0,-1,0]],
[[-1,0,1],[-1,-1,0],[-1,0,0]],
[[0,1,1],[-1,1,0],[0,1,0]],
[[0,1,0],[0,1,-1],[0,0,-1]],
[[0,1,0],[0,0,-1],[1,0,0]],
[[0,1,1],[0,1,0],[0,0,1]],
[[0,0,1],[0,1,0],[1,0,0]],
[[0,0,1],[0,-1,0],[-1,-1,0]],
[[-1,-1,0],[0,-1,0],[0,0,-1]],
[[-1,-1,0],[0,-1,0],[-1,0,-1]],
[[-1,0,1],[0,0,1],[-1,-1,0]],
[[0,-1,0],[0,0,-1],[-1,0,-1]],
[[-1,1,0],[-1,0,0],[0,1,-1]],
[[0,1,1],[-1,0,0],[-1,1,0]],
[[-1,0,1],[-1,0,0],[-1,1,0]],
[[-1,0,0],[-1,0,-1],[0,1,-1]],
[[0,1,1],[-1,0,1],[-1,1,0]]];

const gatherVolumeData = function(out_volumeUvPairArray, out_volumeDataArray, in_sphereArray, in_linkArray, in_textureDim, in_linkMap){
	var sphereCount = in_sphereArray.length / 4;
	for (var sphereIndex = 0; sphereIndex < sphereCount; ++sphereIndex){
		var sourceX = in_linkArray[(sphereIndex * 3) + 0];
		var sourceY = in_linkArray[(sphereIndex * 3) + 1];
		var sourceZ = in_linkArray[(sphereIndex * 3) + 2];
		var evenY = (0 === (sourceY & 1));
		var evenZ = (0 === (sourceZ & 1));

		if ((true === evenY) && (true === evenZ)){

		} else if ((true === evenY) && (false === evenZ)){
		} else if ((false === evenY) && (true === evenZ)){
		} else if ((false === evenY) && (false === evenZ)){
		}
	}
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

const run12 = function(in_sphereArray, in_linkArray, in_fileAssetPath, in_fileDataPath, in_baseName){
	const rootName = CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(in_baseName));
	var uvDataArrayName = "gUv" + rootName;
	var volumeUvPairArrayNameArray = [];
	var volumeUvPairArray = [];
	for (var index = 0; index < 10; ++index){
		volumeUvPairArrayNameArray.push("gVolumeUvPair" + index + rootName);
		volumeUvPairArray.push([]);
	}

	var volumeDataArrayNameArray = [];
	var volumeDataArray = [];
	for (var index = 0; index < 5; ++index){
		volumeDataArrayNameArray.push("gVolumeData" + index + rootName);
		volumeDataArray.push([]);
	}

	var textureDataArrayName ="gTex" + rootName;
	var textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(in_sphereArray.length / 4))));
	console.log("textureDim:" + textureDim + " sphereCount:" + in_sphereArray.length / 4);

	const linkMap = makeLinkMap(in_linkArray);
	gatherVolumeData(volumeUvPairArray, volumeDataArray, in_sphereArray, in_linkArray, textureDim, linkMap);

	var assetText = getAssetText(uvDataArrayName, volumeUvPairArrayNameArray, volumeDataArrayNameArray, textureDataArrayName, textureDim);
	var dataText = getDataArrayText(in_sphereArray, uvDataArrayName, textureDataArrayName, textureDim, volumeUvPairArray, volumeUvPairArrayNameArray, volumeDataArray, volumeDataArrayNameArray);

	return FsExtra.writeFile(in_fileAssetPath, assetText).then(function(){
		return FsExtra.writeFile(in_fileDataPath, dataText);
	});
}

module.exports = {
	"test" : test,
	"run12" : run12
}