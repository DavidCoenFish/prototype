const Core = require("core");
const WebGL = require("webgl");

const makeRenderTarget = function(in_resourceManager, in_webGLState, in_textureName){
	var texture = in_resourceManager.getUniqueReference(in_textureName, in_webGLState);
	var renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLState, texture.getWidth(), texture.getHeight(),
		[ WebGL.RenderTargetData.factory(texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);
	return renderTarget;
}

const factory = function(in_resourceManager, in_webGLState, in_state, in_textureName){
	const m_renderTargetArray = [];
	for (var index = 0; index < 5; ++index){
		m_renderTargetArray.push(makeRenderTarget(in_resourceManager, in_webGLState, in_textureName));
	}

	var m_posTextureIndex = 0;

	const that = Object.create({
		// a bit undecided if better to use input/ output or state to transmit data between tasks
		"run" : function(){

			var result = {
				"pos_new" : m_renderTargetArray[(m_posTextureIndex + 2) % 3],
				"pos" : m_renderTargetArray[(m_posTextureIndex + 1) % 3],
				"pos_prev" : m_renderTargetArray[(m_posTextureIndex + 0) % 3],
				"force_in" : m_renderTargetArray[3],
				"force_out" : m_renderTargetArray[4],
			};
			m_posTextureIndex = (m_posTextureIndex + 1) % 3;

			in_state.m_texturePos = result.pos_new.getTexture(0);
			in_state.m_textureForceA = result.force_in.getTexture(0);
			in_state.m_textureForceB = result.force_out.getTexture(0);

			return result;
		},
		"getTexturePos" : function(){
			return m_renderTargetArray[(m_posTextureIndex + 1) % 3].getTexture(0);
		},
		"getTextureForceA" : function(){
			return m_renderTargetArray[3].getTexture(0);
		},
		"getTextureForceB" : function(){
			return m_renderTargetArray[4].getTexture(0);
		},
		"getTextureArray" : function(){
			var result = [];
			for (var index = 0; index < m_renderTargetArray.length; ++index){
				result.push(m_renderTargetArray[index].getTexture(0));
			}
			return result;
		}
	});

	in_state.m_texturePos = that.getTexturePos();
	in_state.m_textureForceA = that.getTextureForceA();
	in_state.m_textureForceB = that.getTextureForceB();

	return that;
}


module.exports = {
	"factory" : factory,
};
