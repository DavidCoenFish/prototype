const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper, in_resourceManager){

	const m_sunAzimuthAltitude = Core.Vector2.factoryFloat32(-90.0, 45.0);
	const m_sunTint = Core.Vector3.factoryFloat32(255.0/255.0, 250.0/255.0, 245.0/255.0);
	const m_sunRange = Core.Vector2.factoryFloat32(1.0, 2.0); 
	const m_skyTint = Core.Vector3.factoryFloat32(10.0/255.0, 100.0/255.0, 255.0/255.0);
	const m_skySpread = -0.9;
	const m_skyTurbitity = 0.5;

	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sunAzimuthAltitude"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_sunAzimuthAltitude.getRaw());
			} else if (in_key === "u_sunTint"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_sunTint.getRaw());
			} else if (in_key === "u_sunRange"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_sunRange.getRaw());
			} else if (in_key === "u_skyTint"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_skyTint.getRaw());
			} else if (in_key === "u_skySpread"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_skySpread);
			} else if (in_key === "u_skyTurbitity"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_skyTurbitity);
			}
			return;
		}
	};
	const m_shaderEnvMap = in_resourceManager.getCommonReference("shaderEnvMap", in_webGLContextWrapper, m_uniformServer);
	const m_materialEnvMap = WebGL.MaterialWrapper.factoryDefault(m_shaderEnvMap, []);
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
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			m_renderTarget.apply(localWebGLContextWrapper, localWebGLState);
			m_materialEnvMap.apply(localWebGLContextWrapper, localWebGLState);
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
