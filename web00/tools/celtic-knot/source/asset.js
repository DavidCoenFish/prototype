const Q = require("q");
const FileSystem = require("fs");
const FileSystemExtra = require("fs-extra");
const Path = require("path");
const Core = require("core");
const Sampler = require("./sampler.js");
const Accumulator = require("./accumulator.js");

const saveTexture = function(in_outputFilePath, in_width, in_height, in_base64TextureData){
	const content = 
`const factoryTexture = function(in_webGLState){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLState, 
		${in_width}, 
		${in_height}, 
		new Float32Array((new Uint8Array(Core.Base64.base64ToByteArray("${in_base64TextureData}"))).buffer)
	);
}`
	return FileSystemExtra.writeFile(in_outputFilePath, content);
}

const runTextureByte = function(in_outputFilePath, in_width, in_height){
	const floatArray = Sampler.sampleKnot(
		Sampler.distanceFunction, 
		Accumulator.factory(),
		in_width, 
		in_height,
		4
	);
	
	const typeFloatArray = new Float32Array(floatArray);
	const byteArray = new Uint8Array(typeFloatArray.buffer);
	const base64TextureData = Core.Base64.byteArrayToBase64(byteArray);
	return saveTexture(in_outputFilePath, in_width, in_height, base64TextureData);
}

module.exports = {
	"runTextureByte" : runTextureByte
}