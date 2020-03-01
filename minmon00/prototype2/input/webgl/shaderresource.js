//export function ShaderFactory(
export default function(
	in_webGLContextWrapper,
	in_shaderSource, 
	in_shaderEnumName
	){
	var m_webGLShader = undefined;

	//public methods ==========================
	const that = Object.create({
		//start debug
		"getShader" : function(){ 
			return m_webGLShader; 
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(){
		const shaderTypeEnum = in_webGLContextWrapper.getEnum(in_shaderEnumName);
		m_webGLShader = loadShader(in_shaderSource, shaderTypeEnum);
		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const lostCallback = function(){
		if ( undefined !== m_webGLShader){
			in_webGLContextWrapper.callMethod("deleteShader", m_webGLShader);
			m_webGLShader = undefined;
		}
		return;
	}

	const loadShader = function(in_shaderText, in_type){
		var shaderHandle = in_webGLContextWrapper.callMethod("createShader", in_type);
		if (0 === shaderHandle){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("shaderSource", shaderHandle, in_shaderText);
		in_webGLContextWrapper.callMethod("compileShader", shaderHandle);

		const compileStatusEnum = in_webGLContextWrapper.getEnum("COMPILE_STATUS");
		const compiled = in_webGLContextWrapper.callMethod("getShaderParameter", shaderHandle, compileStatusEnum);

		var errorInfo = "";
		// If the compilation failed, delete the shader.
		if (!compiled){
			errorInfo = in_webGLContextWrapper.callMethod("getShaderInfoLog", shaderHandle);
			in_webGLContextWrapper.callMethod("deleteShader", shaderHandle);
			shaderHandle = undefined;
		}

		if (undefined === shaderHandle){
			alert("Error creating shader: " + errorInfo);
		}
		
		return shaderHandle;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return that;
}
