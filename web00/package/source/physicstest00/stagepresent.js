const WebGL = require("webgl");
const VisualMaterial = require("./visual_material.js");
const VisualShader = require("./visual_shader.js");

const sVisualShaderName = "visual_shader";
const sVisualMaterialName = "visual_material";

const factory = function(in_resourceManager, in_webGLContextWrapper, in_webGLState, in_dataServer){
	if (false === in_resourceManager.hasFactory(sVisualShaderName)){
		in_resourceManager.addFactory(sVisualShaderName, VisualShader.factory);
	}
	if (false === in_resourceManager.hasFactory(sVisualMaterialName)){
		in_resourceManager.addFactory(sVisualMaterialName, VisualMaterial.factory);
	}
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_viewportWidthHeightWidthhalfHeighthalf"){
				var m_viewportWidthHeightWidthhalfHeighthalf = in_dataServer.getViewportWidthHeightWidthhalfHeighthalf();
				WebGL.WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, m_viewportWidthHeightWidthhalfHeighthalf.getRaw());
			} else if (in_key === "u_cameraAt"){
				var m_cameraAt = in_dataServer.getCameraAt();
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraAt.getRaw());
			} else if (in_key === "u_cameraUp"){
				var m_cameraUp = in_dataServer.getCameraUp();
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraUp.getRaw());
			} else if (in_key === "u_cameraLeft"){
				var m_cameraLeft = in_dataServer.getCameraLeft();
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraLeft.getRaw());
			} else if (in_key === "u_cameraPos"){
				var m_cameraPos = in_dataServer.getCameraPos();
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraPos.getRaw());
			} else if (in_key === "u_cameraFovhFovvFar"){
				var m_cameraFovhFovvFar = in_dataServer.getCameraFovhFovvFar();
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraFovhFovvFar.getRaw());
			} else if (in_key === "u_sampler0"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			}
			return;
		}
	};
	const m_shader = in_resourceManager.getCommonReference(sVisualShaderName, in_webGLContextWrapper, m_uniformServer);
	const m_material = in_resourceManager.getCommonReference(sVisualMaterialName, m_shader, [in_dataServer.getTextureNewPos()]);
	const m_model = in_resourceManager.getCommonReference("model", in_webGLContextWrapper);

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			m_material.setTextureArray([in_dataServer.getTextureNewPos()]);
			m_material.apply(in_webGLContextWrapper, in_webGLState);
			m_model.draw(in_webGLContextWrapper, in_webGLState.getMapVertexAttribute());
		},
	})

	return result;
}

module.exports = {
	"factory" : factory
}