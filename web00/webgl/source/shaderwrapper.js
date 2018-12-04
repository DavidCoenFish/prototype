/*
collect the data to represent a shader. 
when we have a webGLContext 
 */
//const Core = require("core");

const factory = function(in_webGLContextWrapper, in_vertexShaderSource, in_fragmentShaderSource, in_uniformServerOrUndefined, in_vertexAttributeNameArrayOrUndefined, in_uniformNameArrayOrUndefined){
	const m_vertexShaderSource = in_vertexShaderSource; //Core.StringUtil.deepCopyString(in_vertexShaderSource);
	const m_fragmentShaderSource = in_fragmentShaderSource; //Core.StringUtil.deepCopyString(in_fragmentShaderSource);
	const m_vertexAttributeNameArray = (undefined === in_vertexAttributeNameArrayOrUndefined) ? [] : Array.prototype.slice.call(in_vertexAttributeNameArrayOrUndefined);
	const m_uniformNameArray = (undefined === in_uniformNameArrayOrUndefined) ? [] : Array.prototype.slice.call(in_uniformNameArrayOrUndefined);

	const m_uniformServerOrUndefined = in_uniformServerOrUndefined;

	var m_shaderProgramObject = undefined;
	var m_vertexWebGLShader = undefined;
	var m_fragmentWebGLShader = undefined;
	var m_mapVertexAttribute = undefined;
	var m_mapUniform = undefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(in_webGLContextWrapper){
			if (undefined !== m_shaderProgramObject){
				in_webGLContextWrapper.callMethod("useProgram", m_shaderProgramObject);
			}
			//set uniforms?
			return;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(in_webGLContextWrapper){
		const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		m_vertexWebGLShader = loadShader(in_webGLContextWrapper, m_vertexShaderSource, vertexShaderEnum);
		const fragmentShaderEnum = in_webGLContextWrapper.getEnum("FRAGMENT_SHADER");
		m_fragmentWebGLShader = loadShader(in_webGLContextWrapper, m_fragmentShaderSource, fragmentShaderEnum);
		m_shaderProgramObject = linkProgram(in_webGLContextWrapper, m_mapVertexAttribute, m_mapUniform, m_vertexWebGLShader, m_fragmentWebGLShader, m_mapVertexAttribute, m_mapUniform);

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

	const linkProgram = function(in_webGLContextWrapper, in_mapVertexAttribute, in_mapUniform, in_vertexWebGLShader, in_fragmentWebGLShader){
		var programHandle = in_webGLContextWrapper.callMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_vertexWebGLShader);
		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_fragmentWebGLShader);
		
		for (var index = 0; index < m_vertexAttributeNameArray.length; ++index){
			var key = m_vertexAttributeNameArray[key];
			in_webGLContextWrapper.callMethod("bindAttribLocation", programHandle, index, key);
		}		
			
		in_webGLContextWrapper.callMethod("linkProgram", programHandle);

		const linkStatusEnum = in_webGLContextWrapper.getEnum("LINK_STATUS");
		const linked = in_webGLContextWrapper.callMethod("getProgramParameter", programHandle, linkStatusEnum);

		if (!linked) {				
			in_webGLContextWrapper.callMethod("deleteProgram", programHandle);
			return undefined
		}

		m_mapVertexAttribute = {};
		for (var index = 0; index < m_vertexAttributeNameArray.length; ++index){
			var key = m_vertexAttributeNameArray[index];
			m_mapVertexAttribute[key] = in_webGLContextWrapper.callMethod("getAttribLocation", programHandle, key);
		}

		m_mapUniform = {};
		for (var index = 0; index < m_uniformNameArray.length; ++index){
			var key = m_uniformNameArray[index];
			m_mapUniform[key] = in_webGLContextWrapper.callMethod("getUniformLocation", programHandle, key);
		}
			
		return programHandle;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return result;
}


module.exports = {
	"factory" : factory
};
