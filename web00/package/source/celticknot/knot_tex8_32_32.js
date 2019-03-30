
const Core = require("core");
const WebGL = require("webgl");

const factoryTexture = function(in_webGLState){
	return WebGL.TextureWrapper.factoryByteRGB(
		in_webGLState, 
		32, 
		32, 
		Core.Base64.base64ToByteArray("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")
	);
}

module.exports = {
	"factoryTexture" : factoryTexture,
}