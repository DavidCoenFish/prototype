const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_resourceManager, in_webGLState, in_state, in_modelName){
	const m_componentMaterialMacroSphereUv = WebGL.ComponentMaterialMacroSphereUv.factory(in_resourceManager, in_webGLState);
	const m_shader = m_componentMaterialMacroSphereUv.getShader();
	const m_material = m_componentMaterialMacroSphereUv.getMaterial();
	const m_textureArray = [in_state.m_texturePos];

	m_material.setTextureArray(m_textureArray);

	const m_model = in_resourceManager.getCommonReference(in_modelName, in_webGLState);

	const that = Object.create({
		"run" : function(){
			m_textureArray[0] = in_state.m_texturePos;

			in_webGLState.applyShader(m_shader, in_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			return undefined;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
