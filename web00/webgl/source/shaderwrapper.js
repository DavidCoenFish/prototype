/*
wrap the shader webgl program object, 
 */
const Core = require("core");

const factory = function(in_vertexShaderSource, in_fragmentShaderSource, in_uniformServerOrUndefined, in_vertexAttributeNameArrayOrUndefined, in_uniformNameArrayOrUndefined){
	const m_vertexShaderSource = Core.StringUtil.deepCopyString(in_vertexShaderSource);
	const m_fragmentShaderSource = Core.StringUtil.deepCopyString(in_fragmentShaderSource);
	const m_vertexAttributeNameArray = (undefined === in_vertexAttributeNameArrayOrUndefined) ? [] : in_vertexAttributeNameArrayOrUndefined.slice();
	const m_uniformNameArray = (undefined === in_uniformNameArrayOrUndefined) ? [] : in_uniformNameArrayOrUndefined.slice();
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
		"attachContextCallback" : function(in_webGLContextWrapper){
			in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);
		},
		"detachContextCallback" : function(in_webGLContextWrapper){
			in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(in_webGLContextWrapper){
		const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		m_vertexWebGLShader = loadShader(in_webGLContextWrapper, m_vertexShaderSource, vertexShaderEnum);
		const fragmentShaderEnum = in_webGLContextWrapper.getEnum("FRAGMENT_SHADER");
		m_fragmentWebGLShader = loadShader(in_webGLContextWrapper, m_fragmentShaderSource, fragmentShaderEnum);
		m_shaderProgramObject = linkProgram(in_webGLContextWrapper, m_mapVertexAttribute, m_mapUniform, m_vertexWebGLShader, m_fragmentWebGLShader, m_mapVertexAttribute, m_mapUniform);

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

	const loadShader = function(in_webGLContextWrapper, in_type, in_shaderText){
		const shaderHandle = in_webGLContextWrapper.callMethod("createShader", in_type);
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

	const linkProgram = function(in_webGLContextWrapper, in_mapVertexAttribute, in_mapUniform, in_vertexWebGLShader, in_fragmentWebGLShader, inout_attributeMap, inout_uniformMap){
		const programHandle = in_webGLContextWrapper.callMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_vertexShaderHandle);
		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_fragmentShaderHandle);
		
		var attributeKeyArray = Object.keys(inout_attributeMap);
		for (var index = 0; index < attributeKeyArray.length; ++index)
		{
			var key = attributeKeyArray[key];
			in_webGLContextWrapper.callMethod("bindAttribLocation", programHandle, index, key);
		}		
			
		in_webGLContextWrapper.callMethod("linkProgram", programHandle);

		const linkStatusEnum = in_webGLContextWrapper.getEnum("LINK_STATUS");
		const linked = in_webGLContextWrapper.callMethod("getProgramParameter", programHandle, linkStatusEnum);

		if (!linked) {				
			in_webGLContextWrapper.callMethod("deleteProgram", programHandle);
			return undefined
		}

		inout_attributeMap = {};
		for (var index = 0; index < m_vertexAttributeNameArray.length; ++index){
			var key = m_vertexAttributeNameArray[index];
			inout_attributeMap[key] = in_webGLContextWrapper.callMethod("getAttribLocation", programHandle, key);
		}

		inout_uniformMap = {};
		for (var index = 0; index < m_uniformNameArray.length; ++index){
			var key = m_uniformNameArray[index];
			inout_uniformMap[key] = in_webGLContextWrapper.callMethod("getUniformLocation", programHandle, key);
		}
			
		return programHandle;

	}

	return result;
}


module.exports = {
	"factory" : factory
};
