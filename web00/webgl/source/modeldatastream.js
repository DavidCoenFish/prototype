
const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js")

/*
the data needed to construct a model data stream buffer object
 */
const factory = function(
	in_typeName, //string
	in_elementsPerVertex, //int
	in_arrayData,
	in_usageName, //string //STATIC_DRAW, 
	in_normalise //bool
	){
	const m_typeName = in_typeName;
	const m_elementsPerVertex = in_elementsPerVertex;
	const m_arrayData = in_arrayData.slice();
	const m_usageName = in_usageName;
	const m_normalise = in_normalise;

	var m_bufferObject = undefined;

	//public methods ==========================
	const result = Object.create({
		"aquireWebGLResources" : function(in_webGLContextWrapper){
			m_bufferObject = WebGLContextWrapperHelper.createBuffer(in_webGLContextWrapper, m_arrayData, "ARRAY_BUFFER", m_usageName);
		},
		"releaseWebGLResources" : function(in_webGLContextWrapper){
			WebGLContextWrapperHelper.deleteBuffer(m_bufferObject);
			m_bufferObject = undefined;
		},
		"setupDraw" : function(in_webGLContextWrapper, in_position){
			const bufferObjectType = in_webGLContextWrapper.getEnum("ARRAY_BUFFER");
			in_webGLContextWrapper.callMethod("bindBuffer", m_bufferObject, bufferObjectType);
			const type = in_webGLContextWrapper.getEnum(m_typeName);
			in_webGLContextWrapper.callMethod("enableVertexAttribArray", in_position, m_elementsPerVertex, type, m_normalise);
		},
		"tearDownDraw" : function(in_webGLContextWrapper, in_position){
			in_webGLContextWrapper.callMethod("disableVertexAttribArray", in_position);
		}
	});

	return result;
}


module.exports = {
	"factory" : factory
};
