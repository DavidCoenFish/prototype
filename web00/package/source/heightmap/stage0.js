/* 
generate a height map
*/
const Core = require("core");
const WebGL = require("webgl");
const CelticSampler = require("./celticknotheightsample/sampler.js");

const factory = function(in_webGLContextWrapper){
	
	const celticSampler = CelticSampler.factory();
	const dataArray = celticSampler.debugGenerateTile(15, 128, 128, 1);

	const m_texture = WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		128, 
		128,
		dataArray,
		false, //in_flip,
		"RGBA",
		"RGBA",
		"FLOAT", //"HALF_FLOAT", //"FLOAT", //"UNSIGNED_BYTE", //"FLOAT",
		"NEAREST", //"LINEAR",//
		"NEAREST", //"LINEAR",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
		},
		"getTexture" : function(){
			return m_texture;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
