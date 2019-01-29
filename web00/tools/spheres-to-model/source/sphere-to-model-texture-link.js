const Q = require("q");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const CamelCase = require("./camel-case.js");

const getAssetText = function(in_uvDataArrayName, in_uvLinkArrayName, in_textureDataArrayName, in_textureDim){
	return `const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(${in_uvDataArrayName}), "STATIC_DRAW", false);
	const m_link0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[0]}), "STATIC_DRAW", false);
	const m_link1DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[1]}), "STATIC_DRAW", false);
	const m_link2DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[2]}), "STATIC_DRAW", false);
	const m_link3DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[3]}), "STATIC_DRAW", false);
	const m_link4DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[4]}), "STATIC_DRAW", false);
	const m_link5DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[5]}), "STATIC_DRAW", false);
	const m_link6DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[6]}), "STATIC_DRAW", false);
	const m_link7DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_uvLinkArrayName[7]}), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(${in_uvDataArrayName}.length / 2),
		{
			"a_uv" : m_uvDataStream,
			"a_link0" : m_link0DataStream,
			"a_link1" : m_link1DataStream,
			"a_link2" : m_link2DataStream,
			"a_link3" : m_link3DataStream,
			"a_link4" : m_link4DataStream,
			"a_link5" : m_link5DataStream,
			"a_link6" : m_link6DataStream,
			"a_link7" : m_link7DataStream,
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
	for (var index = 0; index < 8; ++index){
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
		if (sphereIndex <= in_sphereArray.length){
			result += `${in_sphereArray[sphereIndex + 0]}, ${in_sphereArray[sphereIndex + 1]}, ${in_sphereArray[sphereIndex + 2]}, ${in_sphereArray[sphereIndex + 3]},\n`;
		} else {
			result += "0,0,0,0,\n";
		}
	}
	result += `]\n`;

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
	const uIndex = linkSphereIndex - (v * in_textureDim);
	const u = (uIndex + uIndex + 1) / (in_textureDim + in_textureDim);
	inout_arrayLinkData.push(u);
	inout_arrayLinkData.push(v);
	inout_arrayLinkData.push(length);

	return;
}

const makeLinkData = function(inout_arrayArrayLinkData, in_linkArray, in_sphereArray, in_linkMap, in_textureDim){
	var sphereCount = in_sphereArray.length / 4;
	for (var sphereIndex = 0; sphereIndex < sphereCount; ++sphereIndex){
		var sourceX = in_linkArray[(sphereIndex * 3) + 0];
		var sourceY = in_linkArray[(sphereIndex * 3) + 1];
		var sourceZ = in_linkArray[(sphereIndex * 3) + 2];
		var even = (0 === (sourceZ & 1));
		if (true === even){
			linkPoint(inout_arrayArrayLinkData[0], sourceX - 1, sourceY - 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[1], sourceX - 1, sourceY, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[2], sourceX, sourceY, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[3], sourceX, sourceY - 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[4], sourceX - 1, sourceY - 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[5], sourceX - 1, sourceY, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[6], sourceX, sourceY, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[7], sourceX, sourceY - 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
		} else {
			linkPoint(inout_arrayArrayLinkData[0], sourceX, sourceY, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[1], sourceX, sourceY + 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[2], sourceX + 1, sourceY + 1, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[3], sourceX + 1, sourceY, sourceZ - 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[4], sourceX, sourceY, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[5], sourceX, sourceY + 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[6], sourceX + 1, sourceY + 1, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
			linkPoint(inout_arrayArrayLinkData[7], sourceX + 1, sourceY, sourceZ + 1, in_sphereArray, sphereIndex, in_linkMap, in_textureDim);
		}
	}
}

const run8 = function(in_sphereArray, in_linkArray, in_fileAssetPath, in_fileDataPath, in_baseName){
	const rootName = CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(in_baseName));
	var uvDataArrayName = "gUv" + rootName;
	var uvLinkArrayName = [];
	var arrayArrayLinkData = [];
	for (var index = 0; index < 8; ++index){
		uvLinkArrayName.push("gLink" + index + rootName);
		arrayArrayLinkData.push([]);
	}

	var textureDataArrayName ="gTex" + rootName;
	var textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(in_sphereArray.length / 4))));
	console.log("textureDim:" + textureDim + " sphereCount:" + in_sphereArray.length / 4);

	const linkMap = makeLinkMap(in_linkArray);
	makeLinkData(arrayArrayLinkData, in_linkArray, in_sphereArray, linkMap, textureDim);

	var assetText = getAssetText(uvDataArrayName, uvLinkArrayName, textureDataArrayName, textureDim);
	var dataText = getDataArrayText(in_sphereArray, uvDataArrayName, textureDataArrayName, textureDim, arrayArrayLinkData, uvLinkArrayName);

	return FsExtra.writeFile(in_fileAssetPath, assetText).then(function(){
		return FsExtra.writeFile(in_fileDataPath, dataText);
	});
}

module.exports = {
	"run8" : run8
}