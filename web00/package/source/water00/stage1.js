const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper, in_resourceManager, in_heightTexture, in_envMapTexture){
	var m_height = 0.1;
	var m_tilt = 30.0;
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_height"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_height);
			} else if (in_key === "u_tilt"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_tilt);
			} else if (in_key === "u_samplerHeight"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_samplerEnvMap"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 1);
			}

			return;
		}
	};
	const m_shaderWater = in_resourceManager.getCommonReference("shaderWater", in_webGLContextWrapper, m_uniformServer);
	const m_materialWater = WebGL.MaterialWrapper.factoryDefault(m_shaderWater, [in_heightTexture, in_envMapTexture]);
	const m_model = in_resourceManager.getCommonReference("modelScreenQuad", in_webGLContextWrapper);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			m_materialWater.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, localWebGLState.getMapVertexAttribute());
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
