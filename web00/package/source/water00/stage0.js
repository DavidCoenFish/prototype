const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper, in_resourceManager){

	var m_ratio = 0.0;
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sunLatLong"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_sunLatLong.getRaw());
			} else if (in_key === "u_ratio"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_ratio);
			}
			return;
		}
	};
	const m_shaderHeight = in_resourceManager.getCommonReference("shaderHeight", in_webGLContextWrapper, m_uniformServer);
	const m_materialWater = WebGL.MaterialWrapper.factoryDefault(m_shaderHeight, []);
	//m_materialWater.setColorMask(false, false, false, true);
	const m_model = in_resourceManager.getCommonReference("modelScreenQuad", in_webGLContextWrapper);

	var m_renderTexture = WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		512, 
		512,
		undefined,
		false,
		"RGB",
		"RGB",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"		
		);
	var m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper, 512, 512,
		[ WebGL.RenderTargetData.factory(m_renderTexture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState, localFrameIndex){
			m_ratio = localFrameIndex / 25.0;

			m_renderTarget.apply(localWebGLContextWrapper, localWebGLState);
			m_materialWater.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, localWebGLState.getMapVertexAttribute());

			WebGL.WebGLContextWrapperHelper.resetRenderTarget(localWebGLContextWrapper, localWebGLState);
		},
		"getTexture" : function(){
			return m_renderTexture;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
