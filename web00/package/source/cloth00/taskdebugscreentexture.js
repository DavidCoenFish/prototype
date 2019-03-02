const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_resourceManager, in_webGLState, in_textureArraySource){
	const m_screenQuadComponent = WebGL.ComponentScreenTextureArray.factory(
		in_resourceManager, 
		in_webGLState, 
		in_textureArraySource.getTextureArray(), 
		4);

	const that = Object.create({
		"run" : function(){
			var textureArray = in_textureArraySource.getTextureArray();
			for (var index = 0; index < textureArray.length; ++index){
				m_screenQuadComponent.setTexture(index, textureArray[index]);
			}
			m_screenQuadComponent.draw();
			return;
		}
	});

	return that;
}

module.exports = {
	"factory" : factory,
};
