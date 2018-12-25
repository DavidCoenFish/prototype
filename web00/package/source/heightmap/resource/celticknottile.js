const WebGL = require("webgl");
const CelticSampler = require("./../celticknotheightsample/sampler.js");

/* */
const generateCelticKnotTile = function(in_width, in_height, in_subSampleLevel){
	const celticSampler = CelticSampler.factory();
	const dataArray = celticSampler.generateTile(in_width, in_height, in_subSampleLevel);
	var message = "";
	for (var index = 0; index < dataArray.length; ++index){
		message += dataArray[index] + ",";
		if (((index + 1) % 3) == 0){
			message += "\n";
		}
	}
	console.log(message);
	return;
}


const factory = function(in_webGLContextWrapper){
	const celticSampler = CelticSampler.factory();
	const dataArrayRaw = celticSampler.generateTile(48, 48, 3);

	const dataArray = new Float32Array(dataArrayRaw);
	return WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		48, 
		48,
		dataArray,
		false,
		"RGB",
		"RGB",
		"FLOAT",
		"NEAREST",
		"NEAREST",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

module.exports = {
	"factory" : factory,
};