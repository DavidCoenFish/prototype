const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper, in_resourceManager, in_textureSampler0, in_textureSampler1){
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sampler0"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_sampler1"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 1);
			}

			return;
		}
	};
	const m_shader = in_resourceManager.getCommonReference("shader1", in_webGLContextWrapper, m_uniformServer);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shader, [in_textureSampler0, in_textureSampler1]);
	const m_model = in_resourceManager.getCommonReference("modelScreenQuad", in_webGLContextWrapper);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			m_material.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, localWebGLState.getMapVertexAttribute());
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
