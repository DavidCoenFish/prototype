const Q = require("q");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const CamelCase = require("./camel-case.js");

const getAssetText = function(in_uvDataArrayName, in_textureDataArrayName, in_textureDim){
	return `const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(${in_uvDataArrayName}), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(${in_uvDataArrayName}.length / 2),
		{
			"a_uv" : m_uvDataStream
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

const getDataArrayText = function(in_sphereArray, in_uvDataArrayName, in_textureDataArrayName, in_textureDim){
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

const run = function(in_sphereArray, in_fileAssetPath, in_fileDataPath, in_baseName){
	var uvDataArrayName ="gUv" + CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(in_baseName));
	var textureDataArrayName ="gTex" + CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(in_baseName));
	var textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(in_sphereArray.length / 4))));
	console.log("textureDim:" + textureDim + " sphereCount:" + in_sphereArray.length / 4);

	var assetText = getAssetText(uvDataArrayName, textureDataArrayName, textureDim);
	var dataText = getDataArrayText(in_sphereArray, uvDataArrayName, textureDataArrayName, textureDim);

	return FsExtra.writeFile(in_fileAssetPath, assetText).then(function(){
		return FsExtra.writeFile(in_fileDataPath, dataText);
	});
}

module.exports = {
	"run" : run
}