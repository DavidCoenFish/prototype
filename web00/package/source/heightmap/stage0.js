/* 
generate a height map
*/
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper, in_width, in_height, in_resourceManager){
	const m_targetTexture = WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		in_width + 2, 
		in_height + 2,
		dataArray,
		false, //in_flip,
		"RGB",
		"RGB",
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
			return m_targetTexture;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
