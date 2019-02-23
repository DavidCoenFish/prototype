
const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js")

/*
the data needed to construct a model data stream buffer object

in_typeName
BYTE: Int8Array : signed 8-bit integer, with values in [-128, 127]
SHORT: Int16Array : signed 16-bit integer, with values in [-32768, 32767]
UNSIGNED_BYTE: Uint8Array : unsigned 8-bit integer, with values in [0, 255]
UNSIGNED_SHORT: Uint16Array : unsigned 16-bit integer, with values in [0, 65535]
FLOAT: Float32Array
HALF_FLOAT

 */
const factory = function(
	in_typeName, //string
	in_elementsPerVertex, //int
	in_arrayData,
	in_usageName, //string //STATIC_DRAW, 
	in_normalise //bool
	){
	var m_bufferObject = undefined;
	var m_type = undefined;

	//public methods ==========================
	const result = Object.create({
		"aquireWebGLResources" : function(in_webGLState){
			m_bufferObject = in_webGLState.createBuffer(in_arrayData, "ARRAY_BUFFER", in_usageName);
			m_type = in_webGLContextWrapper.getEnum(in_typeName);
		},
		"releaseWebGLResources" : function(in_webGLState){
			in_webGLState.deleteBuffer(m_bufferObject);
			m_bufferObject = undefined;
		},
		"setupDraw" : function(in_webGLContextWrapper, in_position){
			const bufferObjectType = in_webGLContextWrapper.getEnum("ARRAY_BUFFER");
			in_webGLContextWrapper.callMethod("bindBuffer", bufferObjectType, m_bufferObject);
			const stride = 0;
			const offset = 0;
			in_webGLContextWrapper.callMethod("vertexAttribPointer", in_position, in_elementsPerVertex, m_type, in_normalise, stride, offset);
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
