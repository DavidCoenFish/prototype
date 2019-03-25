import ShaderUniformData from "./shaderuniformdata.js";

export const factory = function(
	in_webGLState, 
	in_vertexShaderSource, 
	in_fragmentShaderSource, 
	in_vertexAttributeNameArrayOrUndefined, 
	in_uniformNameNameTypeMapOrUndefined,
	){
	var m_shaderProgramObject = undefined;
	var m_vertexWebGLShader = undefined;
	var m_fragmentWebGLShader = undefined;
	var m_mapVertexAttribute = undefined;
	var m_mapUniform = undefined;

	//public methods ==========================
	const that = Object.create({
		"getMapVertexAttribute" : function(){
			return m_mapVertexAttribute;
		},
		"getMapUniform" : function(){
			return m_mapUniform;
		},
		"getShaderProgramObject" : function(){
			return m_shaderProgramObject;
		},
		"destroy" : function(){
			in_webGLState.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(in_webGLContextWrapper){
		const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		m_vertexWebGLShader = loadShader(in_webGLContextWrapper, in_vertexShaderSource, vertexShaderEnum);

		const fragmentShaderEnum = in_webGLContextWrapper.getEnum("FRAGMENT_SHADER");
		m_fragmentWebGLShader = loadShader(in_webGLContextWrapper, in_fragmentShaderSource, fragmentShaderEnum);

		m_shaderProgramObject = linkProgram(in_webGLContextWrapper, m_vertexWebGLShader, m_fragmentWebGLShader);

		if (undefined === m_shaderProgramObject){
			alert("Error creating shader Program");
		}

		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const lostCallback = function(in_webGLContextWrapper){
		m_mapVertexAttribute = undefined;
		m_mapUniform = undefined;
		if ( undefined !== m_vertexWebGLShader){
			in_webGLContextWrapper.callMethod("deleteShader", m_vertexWebGLShader);
			m_vertexWebGLShader = undefined;
		}
		if ( undefined !== m_fragmentWebGLShader){
			in_webGLContextWrapper.callMethod("deleteShader", m_fragmentWebGLShader);
			m_fragmentWebGLShader = undefined;
		}
		if ( undefined !== m_shaderProgramObject){
			in_webGLContextWrapper.callMethod("deleteProgram", m_shaderProgramObject);
			m_shaderProgramObject = undefined;
		}

		return;
	}

	const loadShader = function(in_webGLContextWrapper, in_shaderText, in_type){
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

	const linkProgram = function(in_webGLContextWrapper, in_vertexWebGLShader, in_fragmentWebGLShader){
		var programHandle = in_webGLContextWrapper.callMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_vertexWebGLShader);
		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_fragmentWebGLShader);
		
		//for (var index = 0; index < m_vertexAttributeNameArray.length; ++index){
		if (undefined !== in_uniformNameNameTypeMapOrUndefined){
			var index = 0;
			for (var name in in_uniformNameNameTypeMapOrUndefined){
				in_webGLContextWrapper.callMethod("bindAttribLocation", programHandle, index, name);
				index += 1;
			}
		}
			
		in_webGLContextWrapper.callMethod("linkProgram", programHandle);

		const linkStatusEnum = in_webGLContextWrapper.getEnum("LINK_STATUS");
		const linked = in_webGLContextWrapper.callMethod("getProgramParameter", programHandle, linkStatusEnum);

		if (!linked) {				
			in_webGLContextWrapper.callMethod("deleteProgram", programHandle);
			return undefined
		}

		m_mapVertexAttribute = {};
		if (undefined !== in_vertexAttributeNameArrayOrUndefined){
			for (var index = 0; index < in_vertexAttributeNameArrayOrUndefined.length; ++index){
				var key = in_vertexAttributeNameArrayOrUndefined[index];
				m_mapVertexAttribute[key] = in_webGLContextWrapper.callMethod("getAttribLocation", programHandle, key);
			}
		}

		m_mapUniform = {};
		if (undefined !== in_uniformNameNameTypeMapOrUndefined){
			for (var name in in_uniformNameNameTypeMapOrUndefined){
				var typeName = in_uniformNameNameTypeMapOrUndefined[name];
				var location = in_webGLContextWrapper.callMethod("getUniformLocation", programHandle, name);
				m_mapUniform[name] = ShaderUniformData.factory(typeName, location);
			}
		}
			
		return programHandle;
	}

	in_webGLState.addResourceContextCallbacks(restoredCallback, lostCallback);

	return that;
}


module.exports = {
	"factory" : factory
};
