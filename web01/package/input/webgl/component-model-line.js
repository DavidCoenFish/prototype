const ComponentMaterialMacroPos = require("./component-material-macro-pos.js");

const factory = function(in_resourceManager, in_webGLState, in_state, in_modelResourceName, in_origin, in_colour){
	var m_dataServer = Object.create({ 
		"getModelOrigin" : function(){ return in_origin; },
		"getModelColour" : function(){ return in_colour; },
	});
	Object.assign(m_dataServer, in_dataServer);
	var m_materialComponent = ComponentMaterialMacroPos.factory(in_resourceManager, in_webGLState, in_state);
	var m_shader = m_materialComponent.getShader();
	var m_material = m_materialComponent.getMaterial();
	var m_model = in_resourceManager.getCommonReference(in_modelResourceName, in_webGLContextWrapper);

	//public methods ==========================
	const result = Object.create({
		"draw" : function(){
			in_webGLState.applyMaterial(m_material);
			in_webGLState.applyShader(m_shader);
			m_model.draw();
		},
		"destroy" : function(){
			in_resourceManager.releaseCommonReference(in_modelResourceName);
			m_materialComponent.destroy();
		}
	})

	return result;
}

module.exports = {
	"factory" : factory
}