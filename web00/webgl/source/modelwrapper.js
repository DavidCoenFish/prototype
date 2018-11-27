/*
wrap the shader webgl program object, 
 */
const Core = require("core");

const factory = function(
		in_webGLContextWrapper, 
		in_webGLContextMethod, 
		in_mode,
		in_elementCount,
		in_mapDataStream,
		in_elementIndexOrUndefined
		){
	const m_mode = in_mode;
	const m_elementCount = in_elementCount;
	const m_mapDataStream = in_mapDataStream;

	const m_elementIndexOrUndefined = in_elementIndexOrUndefined;
	var m_elementIndexHandle = undefined;
	var m_elementByteSize = undefined;
	var m_elementType = undefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(){
			if (undefined !== m_shaderProgramObject){
				in_webGLContextApplyMethod("useProgram", m_shaderProgramObject);
			}
			//set uniforms?
			return;
		},
		"destroy" : function(){
			releaseWebGLResources();
			in_webGLContextWrapper.removeEventListener(in_webGLContextWrapper.sTokenWebglContextLost, aquireWebGLResources);
			in_webGLContextWrapper.removeEventListener(in_webGLContextWrapper.sTokenWebglContextRestored, releaseWebGLResources);
		},
	});

	//private methods ==========================
	const aquireWebGLResources = function(){

		if (m_elementIndexOrUndefined instanceof Uint8Array) {
			m_elementByteSize = 1;
			m_elementType = in_webGLContextWrapper.getEnum("UNSIGNED_BYTE");
		}
		else if (m_elementIndexOrUndefined instanceof Uint16Array) {
			m_elementByteSize = 2;
			m_elementType = in_webGLContextWrapper.getEnum("UNSIGNED_SHORT");
		}
		else if (m_elementIndexOrUndefined instanceof Uint32Array) {
			m_elementByteSize = 4;
			m_elementType = in_webGLContextWrapper.getEnum("UNSIGNED_INT");
		}

		if (undefined !== m_elementIndexOrUndefined) {
			m_elementIndexHandle = in_webGLContextMethod("createBuffer");
			const bufferObjectType = in_webGLContextWrapper.getEnum("ELEMENT_ARRAY_BUFFER");
			in_webGLContextMethod("bindBuffer", bufferObjectType, m_elementIndexHandle);
			const usage = in_webGLContextWrapper.getEnum("STATIC_DRAW");
			in_webGLContextMethod("bufferData", bufferObjectType, m_elementIndexOrUndefined, usage);
		}

		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const releaseWebGLResources = function(){
		in_webGLContextMethod("deleteBuffer", m_elementIndexHandle);
		m_elementIndexHandle = undefined;
		m_elementByteSize = undefined;
		m_elementType = undefined;

		return;
	}

	in_webGLContextWrapper.addEventListener(in_webGLContextWrapper.sTokenWebglContextLost, aquireWebGLResources);
	in_webGLContextWrapper.addEventListener(in_webGLContextWrapper.sTokenWebglContextRestored, releaseWebGLResources);

	return result;
}


module.exports = {
	"factory" : factory
};
