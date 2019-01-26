const ComponentMaterialMacroPosLine = require("./component-material-macro-pos-line.js");

const factory = function(in_resourceManager, in_webGLContextWrapper, in_dataServer, in_modelResourceName, in_origin, in_colour){
	var m_dataServer = Object.create({ 
		"getModelOrigin" : function(){ return in_origin; },
		"getModelColour" : function(){ return in_colour; },
	});
	Object.assign(m_dataServer, in_dataServer);
	var m_materialComponent = ComponentMaterialMacroPosLine.factory(in_resourceManager, in_webGLContextWrapper, m_dataServer);
	var m_material = m_materialComponent.getMaterial();
	var m_model = in_resourceManager.getCommonReference(in_modelResourceName, in_webGLContextWrapper);

	//public methods ==========================
	const result = Object.create({
		"draw" : function(in_innerWebGLContextWrapper, in_innerWebGLState){
			m_material.apply(in_innerWebGLContextWrapper, in_innerWebGLState);
			m_model.draw(in_innerWebGLContextWrapper, in_innerWebGLState.getMapVertexAttribute());
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