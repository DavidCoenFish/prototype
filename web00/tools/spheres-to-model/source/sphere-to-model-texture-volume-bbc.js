const FsExtra = require("fs-extra");
const CamelCase = require("./camel-case.js");
const Geometry = require("./geometry.js");

/*
each vertex/point

uv float2[1] //2
neigbour float4[6] //4 * 6
volume float4[5] //4 * 5  //zero for no volume~ we could assume volume?
quadrant byte1[1] //1

uv is also used to look up another texture for target length?

*/

const testDistance = function(out_arrayData, in_sphereArray, in_linkArray, in_outerSphereIndex, in_outerDataIndex, in_innerSphereIndex, in_innerDataIndex){
	var sphereA = [in_sphereArray[in_outerSphereIndex + 0], in_sphereArray[in_outerSphereIndex + 1], in_sphereArray[in_outerSphereIndex + 2], in_sphereArray[in_outerSphereIndex + 3]];
	var linkA = [in_linkArray[in_outerDataIndex + 0], in_linkArray[in_outerDataIndex + 1], in_linkArray[in_outerDataIndex + 2]];
	var sphereB = [in_sphereArray[in_innerSphereIndex + 0], in_sphereArray[in_innerSphereIndex + 1], in_sphereArray[in_innerSphereIndex + 2], in_sphereArray[in_innerSphereIndex + 3]];
	var linkB = [in_linkArray[in_innerDataIndex + 0], in_linkArray[in_innerDataIndex + 1], in_linkArray[in_innerDataIndex + 2]];

	const distance = Geometry.vec3Distance(sphereA, sphereB);
	out_arrayData.push({
		"distance" : distance,
		"linkA" : linkA,
		"sphereA" : sphereA,
		"linkB" : linkB,
		"sphereB" : sphereB
	});
}

const testVolumeData = function(out_arrayVolumeData, in_arrayData, in_indexA, in_indexB, in_indexC){
	const vecA = Geometry.vec3Subtract(in_arrayData[in_indexA].sphereB, in_arrayData[in_indexA].sphereA);
	const vecB = Geometry.vec3Subtract(in_arrayData[in_indexB].sphereB, in_arrayData[in_indexB].sphereA);
	const vecC = Geometry.vec3Subtract(in_arrayData[in_indexC].sphereB, in_arrayData[in_indexC].sphereA);
	const normalA = Geometry.vec3Normalise(vecA);
	const normalB = Geometry.vec3Normalise(vecB);
	const normalC = Geometry.vec3Normalise(vecC);
	var maxDot = (1 - Geometry.vec3Dot(normalA, normalB)) + (1 - Geometry.vec3Dot(normalB, normalC)) + (1 - Geometry.vec3Dot(normalC, normalA));
	maxDot = Math.round(maxDot * 24);
	const volume = Geometry.vec3Volume(vecA, vecB, vecC);

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
	message += `[${in_item.indexA},${in_item.indexB},${in_item.indexC}],\n`;
	return message;
}


const testPrintArrayVolumeData = function(in_arrayVolumeData, in_originLink, in_linkData, inout_volumeDictionary){
	in_arrayVolumeData.sort(function(lhs, rhs){ 
		if (lhs.maxDot < rhs.maxDot){ return -1; }
		if (rhs.maxDot < lhs.maxDot){ return +1; }
		return 0;
	});

	// do in two passes, keys must have 2 points in {0, 1, 2} or {9, 10, 11}
	const validKeySet = {0:0,1:0,2:0, 9:0,10:0,11:0};
	var array4Pair = [];
	var remainingArrayVolumeData = []; 
	for (var index = 8; index < 32; ++index){ //in_arrayVolumeData.length; ++index){
		const item = in_arrayVolumeData[index];
		var foundSubIndex = undefined;
		var keyCount = 0;
		if (item.indexA in validKeySet){ keyCount += 1; }
		if (item.indexB in validKeySet){ keyCount += 1; }
		if (item.indexC in validKeySet){ keyCount += 1; }
		for (var subIndex = 0; subIndex < array4Pair.length; ++subIndex){
			var subKey = array4Pair[subIndex].key;
			if (true === isArray4Pair(subKey, [item.indexA, item.indexB, item.indexC])){
				foundSubIndex = subIndex;
				break;
			}
		}

		if (undefined === foundSubIndex){
			if (2 <= keyCount){
				array4Pair.push({
					"key" : [item.indexA, item.indexB, item.indexC],
					"item" : item,
					"data" : [],
					"dataItem" : []
				});
			} else {
				remainingArrayVolumeData.push(item);
			}
		} else {
			array4Pair[foundSubIndex].data.push([item.indexA, item.indexB, item.indexC]);
			array4Pair[foundSubIndex].dataItem.push(item);
		}
	}

	for (var index = 0; index < remainingArrayVolumeData.length; ++index){ //in_arrayVolumeData.length; ++index){
		const item = remainingArrayVolumeData[index];
		var foundSubIndex = undefined;
		for (var subIndex = 0; subIndex < array4Pair.length; ++subIndex){
			var subKey = array4Pair[subIndex].key;
			if (true === isArray4Pair(subKey, [item.indexA, item.indexB, item.indexC])){
				foundSubIndex = subIndex;
				break;
			}
		}

		if (undefined !== foundSubIndex){
			array4Pair[foundSubIndex].data.push([item.indexA, item.indexB, item.indexC]);
			array4Pair[foundSubIndex].dataItem.push(item);
		} else {
			console.log("WTF");
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

	var message = "const gOffset = [";
	for (var index = 0; index < 12; ++index){
		message += `[${in_linkData[index][0]},${in_linkData[index][1]},${in_linkData[index][2]}],\n`;
	}
	message += "]\n";

	var masterItemList = [];
	for (var index = 0; index < 8; ++index){ //in_arrayVolumeData.length; ++index){
		const item = in_arrayVolumeData[index];
		masterItemList.push(item);
	}
	for (var index = 0; index < filteredPairData.length; ++index){
		const item = filteredPairData[index];
		masterItemList.push(item);
	}

	masterItemList.sort(function(lhs, rhs){ 
		if (lhs.indexA < rhs.indexA){ return -1; }
		if (rhs.indexA < lhs.indexA){ return +1; }
		if (lhs.indexB < rhs.indexB){ return -1; }
		if (rhs.indexB < lhs.indexB){ return +1; }
		if (lhs.indexC < rhs.indexC){ return -1; }
		if (rhs.indexC < lhs.indexC){ return +1; }
		return 0;
	});

	message += "const gVolume = [";
	for (var index = 0; index < masterItemList.length; ++index){
		const item = masterItemList[index];
		message += testPrintVolumeDataItem(item, in_linkData);

		var volumeKey = linkHash(item.indexA, item.indexB, item.indexC);
		if (volumeKey in inout_volumeDictionary){
			inout_volumeDictionary[volumeKey].push([item.indexA, item.indexB, item.indexC]);
		} else {
			inout_volumeDictionary[volumeKey] = [[item.indexA, item.indexB, item.indexC]];
		}
	}
	message += "]\n";
	console.log(message);

}

const testPrintArrayData = function(in_arrayData, in_linkArray, in_outerDataIndex, inout_volumeDictionary){
	var linkX = in_linkArray[in_outerDataIndex + 0];
	var linkY = in_linkArray[in_outerDataIndex + 1];
	var linkZ = in_linkArray[in_outerDataIndex + 2];

	var evenY = (0 === (linkY & 1));
	var evenZ = (0 === (linkZ & 1));

	in_arrayData.sort(function(lhs, rhs){
		var lhsD = Math.round(lhs.distance * 2.0); 
		var rhsD = Math.round(rhs.distance * 2.0); 
		if (lhsD < rhsD){ return -1; }
		if (rhsD < lhsD){ return +1; }

		const lhsZ = lhs.linkB[2] - linkZ;
		const rhsZ = rhs.linkB[2] - linkZ;
		if (lhsZ < rhsZ){ return +1; }
		if (rhsZ < lhsZ){ return -1; }

		var sortValue = -1;
		if (true === evenZ)
		{
			sortValue = 1;
		}

		const lhsY = lhs.linkB[1] - linkY;
		const rhsY = rhs.linkB[1] - linkY;
		if (lhsY < rhsY){ return sortValue; }
		if (rhsY < lhsY){ return -sortValue; }

		const lhsX = lhs.linkB[0] - linkX;
		const rhsX = rhs.linkB[0] - linkX;
		if (lhsX < rhsX){ return -sortValue; }
		if (rhsX < lhsX){ return sortValue; }

		return 0;
	});
	if (
		((linkX === 4) && (linkY === 4) && (linkZ == 4))
		|| ((linkX === 4) && (linkY === 5) && (linkZ == 4))
		|| ((linkX === 4) && (linkY === 4) && (linkZ == 5))
		|| ((linkX === 4) && (linkY === 5) && (linkZ == 5))
	)
	{
		var message = `${linkX} ${linkY} ${linkZ}:`;
		var item = in_arrayData[0];
		message += `{"sphereA":[${item.sphereA[0]}, ${item.sphereA[1]}, ${item.sphereA[2]}, ${item.sphereA[3]}],\n`;

		var linkData = [];
		for (var index = 0; index < 12; ++index){
			item = in_arrayData[index];
			message += `"link${index}":[${item.linkB[0] - linkX}, ${item.linkB[1] - linkY}, ${item.linkB[2] - linkZ}],\n`;
			linkData.push([item.linkB[0] - linkX, item.linkB[1] - linkY, item.linkB[2] - linkZ]);
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

		testPrintArrayVolumeData(arrayVolumeData, [linkX, linkY, linkZ], linkData, inout_volumeDictionary);
	}
}

const test = function(in_sphereArray,  in_linkArray){
	console.log(Geometry.vec3Volume([1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]));

	var volumeDictionary = {};

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

		testPrintArrayData(arrayData, in_linkArray, outerDataIndex, volumeDictionary);
	}

	var count = 0;
	for (key in volumeDictionary){
		count += 1;
	}
	console.log(count);
	console.log(JSON.stringify(volumeDictionary));
}

const getAssetText = function(in_uvDataArrayName, in_quadrantArrayName, in_volumeUvPairArrayNameArray, in_volumeDataArrayNameArray, in_textureDataArrayName, in_textureDim){
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
	const m_quadrantDataStream = WebGL.ModelDataStream.factory("UNSIGNED_BYTE", 1, new Uint8Array(${in_quadrantArrayName}), "STATIC_DRAW", false);
${dataStreamText}

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(${in_uvDataArrayName}.length / 2),
		{
			"a_uv" : m_uvDataStream,
			"a_quadrant" : m_quadrantDataStream,
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

const getDataArrayText = function(in_sphereArray, in_uvDataArrayName, in_quadrantArrayName, in_quadrantArray, in_textureDim, in_textureDataArrayName, volumeUvPairArrayNameArray, volumeUvPairArray, volumeDataArrayNameArray, volumeDataArray){
	//uv
	var result = "";

	result += `const ${in_uvDataArrayName} = [\n`;
	var sphereCount = in_sphereArray.length / 4;
	var traceX = 0;
	var traceY = 0;
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

	result += `const ${in_quadrantArrayName} = [\n`;
	for (var index = 0; index < in_quadrantArray.length; ++index){
		result += `${in_quadrantArray[index]},\n`;
	}
	result += `]\n`;


	//volumeUvPairArrayNameArray, volumeUvPairArray, 24
	for (var index = 0; index < 6; ++index){
		result += `const ${volumeUvPairArrayNameArray[index]} = [\n`;
		for (var subIndex = (index * 4); subIndex < volumeUvPairArray.length; subIndex += 24){
			result += `${volumeUvPairArray[subIndex + 0]}, ${volumeUvPairArray[subIndex + 1]}, ${volumeUvPairArray[subIndex + 2]}, ${volumeUvPairArray[subIndex + 3]},\n`;
		}
		result += `]\n`;
	}

	//volumeDataArrayNameArray, volumeDataArray //20
	for (var index = 0; index < 5; ++index){
		result += `const ${volumeDataArrayNameArray[index]} = [\n`;
		for (var subIndex = (index * 4); subIndex < volumeDataArray.length; subIndex += 20){
			result += `${volumeDataArray[subIndex + 0]}, ${volumeDataArray[subIndex + 1]}, ${volumeDataArray[subIndex + 2]}, ${volumeDataArray[subIndex + 3]},\n`;
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

const getUVValueV = function(in_sphereIndex, in_textureDim){
	const vIndex = Math.floor(in_sphereIndex / in_textureDim);
	const v = (vIndex + vIndex + 1) / (in_textureDim + in_textureDim);
	return v;
}

const getUVValueU = function(in_sphereIndex, in_textureDim){
	const vIndex = Math.floor(in_sphereIndex / in_textureDim);
	const uIndex = in_sphereIndex - (vIndex * in_textureDim);
	const u = (uIndex + uIndex + 1) / (in_textureDim + in_textureDim);
	return u;
}

const calculateSphereVolume = function(in_sphereArray, in_sphereIndex, in_sphereIndexA, in_sphereIndexB, in_sphereIndexC){
	const sphereA = [in_sphereArray[(in_sphereIndex * 4) + 0], in_sphereArray[(in_sphereIndex * 4) + 1], in_sphereArray[(in_sphereIndex * 4) + 2], in_sphereArray[(in_sphereIndex * 4) + 3]];
	const sphereB = [in_sphereArray[(in_sphereIndexA * 4) + 0], in_sphereArray[(in_sphereIndexA * 4) + 1], in_sphereArray[(in_sphereIndexA * 4) + 2], in_sphereArray[(in_sphereIndexA * 4) + 3]];
	const sphereC = [in_sphereArray[(in_sphereIndexB * 4) + 0], in_sphereArray[(in_sphereIndexB * 4) + 1], in_sphereArray[(in_sphereIndexB * 4) + 2], in_sphereArray[(in_sphereIndexB * 4) + 3]];
	const sphereD = [in_sphereArray[(in_sphereIndexC * 4) + 0], in_sphereArray[(in_sphereIndexC * 4) + 1], in_sphereArray[(in_sphereIndexC * 4) + 2], in_sphereArray[(in_sphereIndexC * 4) + 3]];
	const vecA = Geometry.vec3Subtract(sphereB, sphereA);
	const vecB = Geometry.vec3Subtract(sphereC, sphereA);
	const vecC = Geometry.vec3Subtract(sphereD, sphereA);
	const volume = Geometry.vec3Volume(vecA, vecC, vecB);
	return volume;
}

const gatherVolumeDataImple = function(out_volumeUvPairArray, out_volumeDataArray, in_offsetArray, in_volumeArray, in_sphereArray, in_linkArray, in_textureDim, in_linkMap, in_source, in_sphereIndex){
	//write out the 12 uv pairs
	var localOffsetArray = [];
	for (var index = 0; index < in_offsetArray.length; ++index){
		var item = in_offsetArray[index];
		var indexArray = [in_source[0] + item[0], in_source[1] + item[1], in_source[2] + item[2]];
		localOffsetArray.push(indexArray);
		const key = linkHash(indexArray[0], indexArray[1], indexArray[2]);
		var u = 0.0;
		var v = 0.0;
		if (key in in_linkMap){
			var linkSphereIndex = in_linkMap[key];
			u = getUVValueU(linkSphereIndex, in_textureDim);
			v = getUVValueV(linkSphereIndex, in_textureDim);
		}
		out_volumeUvPairArray.push(u);
		out_volumeUvPairArray.push(v);
	}

	//write out the volume data for the 20 tetrahedra
	for (var index = 0; index < in_volumeArray.length; ++index){
		var item = in_volumeArray[index];
		const keyA = linkHash(localOffsetArray[item[0]][0], localOffsetArray[item[0]][1], localOffsetArray[item[0]][2]);
		const keyB = linkHash(localOffsetArray[item[1]][0], localOffsetArray[item[1]][1], localOffsetArray[item[1]][2]);
		const keyC = linkHash(localOffsetArray[item[2]][0], localOffsetArray[item[2]][1], localOffsetArray[item[2]][2]);

		var volume = 0.0;
		if ((keyA in in_linkMap) &&
			(keyB in in_linkMap) &&
			(keyC in in_linkMap)){
			var sphereIndexA = in_linkMap[keyA];
			var sphereIndexB = in_linkMap[keyB];
			var sphereIndexC = in_linkMap[keyC];
			volume = calculateSphereVolume(in_sphereArray, in_sphereIndex, sphereIndexA, sphereIndexB, sphereIndexC);
		}
		out_volumeDataArray.push(volume);
	}
}

const gOffsetOddYOddZ = [[0,1,1],
[-1,0,1],
[0,0,1],
[-1,1,0],
[0,1,0],
[-1,0,0],
[1,0,0],
[-1,-1,0],
[0,-1,0],
[0,1,-1],
[-1,0,-1],
[0,0,-1],
];
const gVolumeOddYOddZ = [[0,1,3],
[0,2,1],
[0,3,4],
[0,4,2],
[1,2,8],
[1,5,3],
[1,7,5],
[1,8,7],
[2,4,6],
[2,6,8],
[3,5,10],
[3,9,4],
[3,10,9],
[4,9,11],
[4,11,6],
[5,7,10],
[6,11,8],
[7,8,10],
[8,11,10],
[9,10,11],
];


const gatherVolumeData = function(out_volumeUvPairArray, out_volumeDataArray, out_quadrantArray, in_sphereArray, in_linkArray, in_textureDim, in_linkMap){
	var sphereCount = in_sphereArray.length / 4;
	for (var sphereIndex = 0; sphereIndex < sphereCount; ++sphereIndex){
		var sourceX = in_linkArray[(sphereIndex * 3) + 0];
		var sourceY = in_linkArray[(sphereIndex * 3) + 1];
		var sourceZ = in_linkArray[(sphereIndex * 3) + 2];
		var source = [sourceX, sourceY, sourceZ];
		var evenY = (0 === (sourceY & 1));
		var evenZ = (0 === (sourceZ & 1));

		if ((true === evenY) && (true === evenZ)){
			out_quadrantArray.push(0);
			const gOffset = [[-1,0,1],
			[0,0,1],
			[0,-1,1],
			[-1,1,0],
			[0,1,0],
			[-1,0,0],
			[1,0,0],
			[-1,-1,0],
			[0,-1,0],
			[-1,0,-1],
			[0,0,-1],
			[0,-1,-1],
			];
			const gVolume = [[0,1,2],
			[0,2,5],
			[0,3,4],
			[0,4,1],
			[0,5,3],
			[1,4,6],
			[1,6,2],
			[2,6,8],
			[2,7,5],
			[2,8,7],
			[3,5,9],
			[3,9,4],
			[4,9,10],
			[4,10,6],
			[5,7,9],
			[6,10,8],
			[7,8,11],
			[7,11,9],
			[8,10,11],
			[9,11,10],
			];
			gatherVolumeDataImple(out_volumeUvPairArray, out_volumeDataArray, gOffset, gVolume, in_sphereArray, in_linkArray, in_textureDim, in_linkMap, source, sphereIndex);
		} else if ((true === evenY) && (false === evenZ)){
			out_quadrantArray.push(1);
			const gOffset = [[0,0,1],
			[1,0,1],
			[0,-1,1],
			[0,1,0],
			[1,1,0],
			[-1,0,0],
			[1,0,0],
			[0,-1,0],
			[1,-1,0],
			[0,0,-1],
			[1,0,-1],
			[0,-1,-1],
			];
			const gVolume = [[0,1,2],
			[0,2,5],
			[0,3,4],
			[0,4,1],
			[0,5,3],
			[1,4,6],
			[1,6,2],
			[2,6,8],
			[2,7,5],
			[2,8,7],
			[3,5,9],
			[3,9,4],
			[4,9,10],
			[4,10,6],
			[5,7,9],
			[6,10,8],
			[7,8,11],
			[7,11,9],
			[8,10,11],
			[9,11,10],
			];

			gatherVolumeDataImple(out_volumeUvPairArray, out_volumeDataArray, gOffset, gVolume, in_sphereArray, in_linkArray, in_textureDim, in_linkMap, source, sphereIndex);
		} else if ((false === evenY) && (true === evenZ)){
			out_quadrantArray.push(2);
			const gOffset = [[0,1,1],
			[0,0,1],
			[1,0,1],
			[0,1,0],
			[1,1,0],
			[-1,0,0],
			[1,0,0],
			[0,-1,0],
			[1,-1,0],
			[0,1,-1],
			[0,0,-1],
			[1,0,-1],
			];
			const gVolume = [[0,1,3],
			[0,2,1],
			[0,3,4],
			[0,4,2],
			[1,2,8],
			[1,5,3],
			[1,7,5],
			[1,8,7],
			[2,4,6],
			[2,6,8],
			[3,5,10],
			[3,9,4],
			[3,10,9],
			[4,9,11],
			[4,11,6],
			[5,7,10],
			[6,11,8],
			[7,8,10],
			[8,11,10],
			[9,10,11],
			];

			gatherVolumeDataImple(out_volumeUvPairArray, out_volumeDataArray, gOffset, gVolume, in_sphereArray, in_linkArray, in_textureDim, in_linkMap, source, sphereIndex);
		} else if ((false === evenY) && (false === evenZ)){
			out_quadrantArray.push(3);
			gatherVolumeDataImple(out_volumeUvPairArray, out_volumeDataArray, gOffsetOddYOddZ, gVolumeOddYOddZ, in_sphereArray, in_linkArray, in_textureDim, in_linkMap, source, sphereIndex);
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
	var quadrantArrayName = "gQuadrant" + rootName;

	var volumeUvPairArrayNameArray = [];
	var volumeUvPairArray = [];
	for (var index = 0; index < 6; ++index){
		volumeUvPairArrayNameArray.push("gVolumeUvPair" + index + rootName);
	}

	var volumeDataArrayNameArray = [];
	var volumeDataArray = [];
	for (var index = 0; index < 5; ++index){
		volumeDataArrayNameArray.push("gVolumeData" + index + rootName);
	}

	var quadrantArray = [];

	var textureDataArrayName ="gTex" + rootName;
	var textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(in_sphereArray.length / 4))));
	console.log("textureDim:" + textureDim + " sphereCount:" + in_sphereArray.length / 4);

	const linkMap = makeLinkMap(in_linkArray);
	gatherVolumeData(volumeUvPairArray, volumeDataArray, quadrantArray, in_sphereArray, in_linkArray, textureDim, linkMap);

	var assetText = getAssetText(uvDataArrayName, quadrantArrayName, volumeUvPairArrayNameArray, volumeDataArrayNameArray, textureDataArrayName, textureDim);
	var dataText = getDataArrayText(in_sphereArray, uvDataArrayName, quadrantArrayName, quadrantArray, textureDim, textureDataArrayName, volumeUvPairArrayNameArray, volumeUvPairArray, volumeDataArrayNameArray, volumeDataArray);

	return FsExtra.writeFile(in_fileAssetPath, assetText).then(function(){
		return FsExtra.writeFile(in_fileDataPath, dataText);
	});
}

const testPoint = function(in_index3, in_linkArray, in_sphereArray){
	const linkMap = makeLinkMap(in_linkArray);
	const key = linkHash(in_index3[0], in_index3[1], in_index3[2]);
	if (key in linkMap){
		var sphereIndex = linkMap[key];
	}

	/*
		0
	   1 2

	   3 4
	  5 6 7
	   8 9
	
		10
	   11 12
	*/
	const gOffset = [[0,1,1],
	[-1,0,1],
	[0,0,1],
	[-1,1,0],
	[0,1,0],
	[-1,0,0],
	[1,0,0],
	[-1,-1,0],
	[0,-1,0],
	[0,1,-1],
	[-1,0,-1],
	[0,0,-1],
	];
	const gVolume = [[0,1,3],
	[0,2,1],
	[0,3,4],
	[0,4,2],
	[1,2,8],
	[1,5,3],
	[1,7,5],
	[1,8,7],
	[2,4,6],
	[2,6,8],
	[3,5,10],
	[3,9,4],
	[3,10,9],
	[4,9,11],
	[4,11,6],
	[5,7,10],
	[6,11,8],
	[7,8,10],
	[8,11,10],
	[9,10,11],
	];

	var volumeUvPairArray = [];
	var volumeDataArray = [];
	var textureDim = 4;
	gatherVolumeDataImple(volumeUvPairArray, volumeDataArray, gOffset, gVolume, in_sphereArray, in_linkArray, textureDim, linkMap, in_index3, sphereIndex);

	console.log(JSON.stringify(volumeDataArray));
	console.log(JSON.stringify(volumeUvPairArray));

	console.log(`${in_sphereArray[(sphereIndex * 4) + 0]}, ${in_sphereArray[(sphereIndex * 4) + 1]}, ${in_sphereArray[(sphereIndex * 4) + 2]}, ${in_sphereArray[(sphereIndex * 4) + 3]}`);
	for (var index = 0; index < gOffset.length; ++index){
		var item = gOffset[index];
		var indexArray = [in_index3[0] + item[0], in_index3[1] + item[1], in_index3[2] + item[2]];
		const key = linkHash(indexArray[0], indexArray[1], indexArray[2]);
		if (key in linkMap){
			var subSphereIndex = linkMap[key];
			console.log(`${index}:${in_sphereArray[(subSphereIndex * 4) + 0]}, ${in_sphereArray[(subSphereIndex * 4) + 1]}, ${in_sphereArray[(subSphereIndex * 4) + 2]}, ${in_sphereArray[(subSphereIndex * 4) + 3]}`);
		}
	}

	for (var index = 0; index < 20; ++index){
		var item = gVolume[index];
		var message = `${index}:${volumeDataArray[index]} [${item[0]},${item[1]},${item[2]}] `;

		console.log(message);
	}

	return;
}


module.exports = {
	"test" : test,
	"testPoint" : testPoint,
	"run12" : run12
}