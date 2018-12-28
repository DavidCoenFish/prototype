
const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js")

/*
the data needed to construct a model data stream buffer object

in_typeName
BYTE: signed 8-bit integer, with values in [-128, 127]
SHORT: signed 16-bit integer, with values in [-32768, 32767]
UNSIGNED_BYTE: unsigned 8-bit integer, with values in [0, 255]
UNSIGNED_SHORT: unsigned 16-bit integer, with values in [0, 65535]
FLOAT
HALF_FLOAT

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
			WebGLContextWrapperHelper.deleteBuffer(in_webGLContextWrapper, m_bufferObject);
			m_bufferObject = undefined;
		},
		"setupDraw" : function(in_webGLContextWrapper, in_position){
			const bufferObjectType = in_webGLContextWrapper.getEnum("ARRAY_BUFFER");
			in_webGLContextWrapper.callMethod("bindBuffer", bufferObjectType, m_bufferObject);
			const type = in_webGLContextWrapper.getEnum(m_typeName);
			const stride = 0;
			const offset = 0;
			in_webGLContextWrapper.callMethod("vertexAttribPointer", in_position, m_elementsPerVertex, type, m_normalise, stride, offset);
			in_webGLContextWrapper.callMethod("enableVertexAttribArray", in_position );

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
