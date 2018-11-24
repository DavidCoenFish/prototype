/*
wrap the webgl handle, and everything required to recreate it
 */
const Core = require("core");

const factory = function(in_webGLContextWrapper, in_getWebGLContext, in_getWebGLError, in_vertexShaderSource, in_fragmentShaderSource, in_uniformServerOrUndefined){
	const m_vertexShaderSource = Core.StringUtil.deepCopyString(in_vertexShaderSource);
	const m_fragmentShaderSource = Core.StringUtil.deepCopyString(in_fragmentShaderSource);
	const m_uniformServerOrUndefined = in_uniformServerOrUndefined;
	var m_shaderProgramObject = undefined;
	var m_vertexWebGLShader = undefined;
	var m_fragmentWebGLShader = undefined;
	var m_mapVertexAttribute = undefined;
	var m_mapUniform = undefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(){
			const webGLContext = in_getWebGLContext();
			if ((undefined === shaderHandle) || (undefined === webGLContext)){
				return;
			}
			webGLContext.useProgram(shaderHandle);
			in_getWebGLError();
			return;
		},
	});

	//private methods ==========================
	const aquireWebGLResources = function(){
		var webGLContext = undefined;
		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return;
		}
		m_vertexWebGLShader = loadShader(m_vertexShaderSource, webGLContext.VERTEX_SHADER);

		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return;
		}
		m_fragmentWebGLShader = loadShader(m_fragmentShaderSource, webGLContext.FRAGMENT_SHADER);

		m_shaderProgramObject = linkProgram(m_mapVertexAttribute, m_mapUniform, m_vertexWebGLShader, m_fragmentWebGLShader);

		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const releaseWebGLResources = function(){
		var webGLContext = undefined;

		if ( undefined !== m_shaderProgramObject)
		{
			webGLContext = in_getWebGLContext();
			if (undefined !== webGLContext){
				webGLContext.deleteProgram(m_shaderProgramObject);
				in_getWebGLError();
			}
			m_shaderProgramObject = undefined;
		}
		if ( undefined !== m_vertexWebGLShader)
		{
			webGLContext = in_getWebGLContext();
			if (undefined !== webGLContext){
				webGLContext.deleteShader(m_vertexWebGLShader);
				in_getWebGLError();
			}
			m_vertexWebGLShader = undefined;
		}
		if ( undefined !== m_fragmentWebGLShader)
		{
			webGLContext = in_getWebGLContext();
			if (undefined !== webGLContext){
				webGLContext.deleteShader(m_fragmentWebGLShader);
				in_getWebGLError();
			}
			m_fragmentWebGLShader = undefined;
		}

		return;
	}

	const linkProgram = function(in_mapVertexAttribute, in_mapUniform, in_vertexWebGLShader, in_fragmentWebGLShader){
		// Create a program object and store the handle to it.
		var webGLContext = undefined;
		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		const programHandle = webGLContext.createProgram();
		in_getWebGLError();
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		webGLContext.attachShader(programHandle, in_vertexShaderHandle);
		in_getWebGLError();

		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		webGLContext.attachShader(programHandle, in_fragmentShaderHandle);
		in_getWebGLError();
		
		var attributeKeyArray = Object.keys(inout_attributeMap);
		for (var index = 0; index < attributeKeyArray.length; ++index)
		{
			var key = attributeKeyArray[key];
			if (this.m_webGL)
				this.m_webGL.bindAttribLocation(programHandle, index, key);
			in_getWebGLError();
		}		
			
		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		webGLContext.linkProgram(programHandle);
		in_getWebGLError();

		// Get the link status.
		if (this.m_webGL)
			var linked = this.m_webGL.getProgramParameter(programHandle, this.m_webGL.LINK_STATUS);
		in_getWebGLError();

		if (!linked) 
		{				
			if (this.m_webGL)
				this.m_webGL.deleteProgram(programHandle);
			in_getWebGLError();
			return undefined
		}

		//inout_attributeMap
		for (var index = 0; index < attributeKeyArray.length; ++index)
		{
			var key = attributeKeyArray[index];
			var location = undefined;
			if (this.m_webGL)
				inout_attributeMap[key] = this.m_webGL.getAttribLocation(programHandle, key);
			in_getWebGLError();
		}

		//inout_uniformMap
		if (undefined != inout_uniformMap)
		{
			var uniformKeyArray = Object.keys(inout_uniformMap);
			for (var index = 0; index < uniformKeyArray.length; ++index)
			{
				var key = uniformKeyArray[index];
				var uniform = inout_uniformMap[key];
				if (this.m_webGL)
					uniform.m_location = this.m_webGL.getUniformLocation(programHandle, key);
				in_getWebGLError();
			}
		}	
			
		return programHandle;

	}

	const loadShader = function(in_type, in_shaderText){
		var webGLContext = undefined;
		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		shaderHandle = webGLContext.createShader(in_type);
		in_getWebGLError();
		if (0 === shaderHandle){
			return undefined;
		}

		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		webGLContext.shaderSource(shaderHandle, in_shaderText);
		in_getWebGLError();

		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		webGLContext.compileShader(shaderHandle);
		in_getWebGLError();

		webGLContext = in_getWebGLContext();
		if (undefined === webGLContext){
			return undefined;
		}
		const compiled = webGLContext.getShaderParameter(shaderHandle, in_webGLContextWrapper.getEnum("COMPILE_STATUS"));
		in_getWebGLError();

		var errorInfo = "";
		// If the compilation failed, delete the shader.
		if (!compiled) 
		{				
			webGLContext = in_getWebGLContext();
			if (undefined === webGLContext){
				return undefined;
			}
			errorInfo = webGLContext.getShaderInfoLog(shaderHandle);
			in_getWebGLError();

			webGLContext = in_getWebGLContext();
			if (undefined === webGLContext){
				return undefined;
			}
			webGLContext.deleteShader(shaderHandle);
			in_getWebGLError();

			shaderHandle = undefined;
		}

		if (undefined === shaderHandle)
		{
			alert("Error creating shader: " + errorInfo);
		}
		
		return shaderHandle;
	}

	in_webGLContextWrapper.addEventListener(in_webGLContextWrapper.sTokenWebglContextLost, aquireWebGLResources);
	in_webGLContextWrapper.addEventListener(in_webGLContextWrapper.sTokenWebglContextRestored, releaseWebGLResources);

	return result;
}
