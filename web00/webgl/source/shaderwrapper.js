/*
wrap the shader webgl program object, 
 */
const Core = require("core");

const factory = function(in_webGLContextWrapper, in_webGLContextMethod, in_vertexShaderSource, in_fragmentShaderSource, in_uniformServerOrUndefined, in_vertexAttributeNameArrayOrUndefined, in_uniformNameArrayOrUndefined){
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
		const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		m_vertexWebGLShader = loadShader(m_vertexShaderSource, vertexShaderEnum);
		const fragmentShaderEnum = in_webGLContextWrapper.getEnum("FRAGMENT_SHADER");
		m_fragmentWebGLShader = loadShader(m_fragmentShaderSource, fragmentShaderEnum);
		m_shaderProgramObject = linkProgram(m_mapVertexAttribute, m_mapUniform, m_vertexWebGLShader, m_fragmentWebGLShader, m_mapVertexAttribute, m_mapUniform);

		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const releaseWebGLResources = function(){
		m_mapVertexAttribute = undefined;
		m_mapUniform = undefined;
		if ( undefined !== m_vertexWebGLShader){
			in_webGLContextApplyMethod("deleteShader", m_vertexWebGLShader);
			m_vertexWebGLShader = undefined;
		}
		if ( undefined !== m_fragmentWebGLShader){
			in_webGLContextApplyMethod("deleteShader", m_fragmentWebGLShader);
			m_fragmentWebGLShader = undefined;
		}
		if ( undefined !== m_shaderProgramObject){
			in_webGLContextApplyMethod("deleteProgram", m_shaderProgramObject);
			m_shaderProgramObject = undefined;
		}

		return;
	}

	const linkProgram = function(in_mapVertexAttribute, in_mapUniform, in_vertexWebGLShader, in_fragmentWebGLShader, inout_attributeMap, inout_uniformMap){
		const programHandle = in_webGLContextApplyMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextApplyMethod("attachShader", programHandle, in_vertexShaderHandle);
		in_webGLContextApplyMethod("attachShader", programHandle, in_fragmentShaderHandle);
		
		var attributeKeyArray = Object.keys(inout_attributeMap);
		for (var index = 0; index < attributeKeyArray.length; ++index)
		{
			var key = attributeKeyArray[key];
			in_webGLContextApplyMethod("bindAttribLocation", programHandle, index, key);
		}		
			
		in_webGLContextApplyMethod("linkProgram", programHandle);

		const linkStatusEnum = in_webGLContextWrapper.getEnum("LINK_STATUS");
		const linked = in_webGLContextApplyMethod("getProgramParameter", programHandle, linkStatusEnum);

		if (!linked) {				
			in_webGLContextApplyMethod("deleteProgram", programHandle);
			return undefined
		}

		inout_attributeMap = {};
		for (var index = 0; index < m_vertexAttributeNameArray.length; ++index){
			var key = m_vertexAttributeNameArray[index];
			inout_attributeMap[key] = in_webGLContextApplyMethod("getAttribLocation", programHandle, key);
		}

		inout_uniformMap = {};
		for (var index = 0; index < m_uniformNameArray.length; ++index){
			var key = m_uniformNameArray[index];
			inout_uniformMap[key] = in_webGLContextApplyMethod("getUniformLocation", programHandle, key);
		}
			
		return programHandle;

	}

	const loadShader = function(in_type, in_shaderText){
		const shaderHandle = in_webGLContextApplyMethod("createShader", in_type);
		if (0 === shaderHandle){
			return undefined;
		}

		in_webGLContextApplyMethod("shaderSource", shaderHandle, in_shaderText);
		in_webGLContextApplyMethod("compileShader", shaderHandle);

		const compileStatusEnum = in_webGLContextWrapper.getEnum("COMPILE_STATUS");
		const compiled = in_webGLContextApplyMethod("getShaderParameter", shaderHandle, compileStatusEnum);

		var errorInfo = "";
		// If the compilation failed, delete the shader.
		if (!compiled){

			errorInfo = in_webGLContextApplyMethod("getShaderInfoLog", shaderHandle);
			in_webGLContextApplyMethod("deleteShader", shaderHandle);
			shaderHandle = undefined;
		}

		if (undefined === shaderHandle){
			alert("Error creating shader: " + errorInfo);
		}
		
		return shaderHandle;
	}

	in_webGLContextWrapper.addEventListener(in_webGLContextWrapper.sTokenWebglContextLost, aquireWebGLResources);
	in_webGLContextWrapper.addEventListener(in_webGLContextWrapper.sTokenWebglContextRestored, releaseWebGLResources);

	return result;
}


module.exports = {
	"factory" : factory
};
