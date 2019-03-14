const Q = require("q");
const FileSystem = require("fs");
const FileSystemExtra = require("fs-extra");
const Path = require("path");
const Core = require("core");
const Sampler = require("./sampler.js");
const Accumulator = require("./accumulator.js");

const saveTexture = function(in_outputFilePath, in_width, in_height, in_base64TextureData){
	const content = `
const Core = require("core");
const WebGL = require("webgl");

const factoryTexture = function(in_webGLState){
	return WebGL.TextureWrapper.factoryByteRGB(
		in_webGLState, 
		${in_width}, 
		${in_height}, 
		Core.Base64.base64ToByteArray("${in_base64TextureData}")
	);
}

module.exports = {
	"factoryTexture" : factoryTexture,
}`
	return FileSystemExtra.writeFile(in_outputFilePath, content);
}

const floatToByte = function(in_float){
	return Math.max(0, Math.min(255, Math.round(in_float * 255)));
}

const runTextureByte = function(in_outputFilePath, in_width, in_height){
	const sampleCount = 4;
	const floatArray = Sampler.sampleKnot(
		Sampler.distanceFunction, 
		Accumulator.factory,
		in_width, 
		in_height,
		sampleCount
	);

	var dataArray = [];
	for (var index = 0; index < floatArray.length; ++index){
		dataArray.push(floatToByte(floatArray[index]));
	}
	const byteArray = new Uint8Array(dataArray);
	const base64TextureData = Core.Base64.byteArrayToBase64(byteArray);
	return saveTexture(in_outputFilePath, in_width, in_height, base64TextureData);
}

const runTextureAlphaByte = function(in_outputFilePath, in_width, in_height){
	const sampleCount = 4;
	const floatArray = Sampler.sampleKnotAlpha(
		Sampler.distanceFunction, 
		Accumulator.factory,
		in_width, 
		in_height,
		sampleCount
	);

	var dataArray = [];
	for (var index = 0; index < floatArray.length; ++index){
		dataArray.push(floatToByte(floatArray[index]));
	}
	const byteArray = new Uint8Array(dataArray);
	const base64TextureData = Core.Base64.byteArrayToBase64(byteArray);
	return saveTexture(in_outputFilePath, in_width, in_height, base64TextureData);
}

module.exports = {
	"runTextureByte" : runTextureByte,
	"runTextureAlphaByte" : runTextureAlphaByte
}