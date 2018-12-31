const WebGL = require("webgl");
const CelticSampler = require("./celticknotheightsample/sampler.js");

/* */
const generateCelticKnotTile = function(in_width, in_height, in_subSampleLevel){
	const celticSampler = CelticSampler.factory();
	const dataArray = celticSampler.generateTile(in_width, in_height, in_subSampleLevel);
	return dataArray;
}

const factory = function(in_webGLContextWrapper, in_tileWidth, in_tileHeight, in_subSample){
	const dataArray = generateCelticKnotTile(in_tileWidth, in_tileHeight, in_subSample);
	return WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		in_tileWidth, 
		in_tileHeight,
		dataArray,
		false,
		"RGB",
		"RGB",
		"UNSIGNED_BYTE",
		"NEAREST",
		"NEAREST",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

module.exports = {
	"factory" : factory,
};