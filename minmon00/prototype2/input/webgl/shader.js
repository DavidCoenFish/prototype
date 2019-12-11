import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from "./shaderuniformtype.js"

//export function ShaderFactory(
export default function(
	in_webGLContextWrapper,
	in_vertexShaderSource, 
	in_fragmentShaderSource, 
	in_vertexAttributeNameArrayOrUndefined, 
	in_uniformNameTypeMapOrUndefined
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
		"apply" : function(){
			if (undefined !== m_shaderProgramObject){
				in_webGLContextWrapper.callMethod("useProgram", m_shaderProgramObject);
			}

			for (var key in m_mapUniform){
				mapUniform[key].Apply();
			}
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(){
		const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		m_vertexWebGLShader = loadShader(in_vertexShaderSource, vertexShaderEnum);

		const fragmentShaderEnum = in_webGLContextWrapper.getEnum("FRAGMENT_SHADER");
		m_fragmentWebGLShader = loadShader(in_fragmentShaderSource, fragmentShaderEnum);

		m_shaderProgramObject = linkProgram(m_vertexWebGLShader, m_fragmentWebGLShader);

		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const lostCallback = function(){
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

	const uniformApplyFactoryMat4 = function(in_typeName, in_uniformHandle){
		return function(in_value){
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformHandle, false, in_value);
		}
	}

	const uniformApplyFactory = function(in_typeName, in_uniformHandle){
		return function(in_value){
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformHandle, in_value);
		}
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

	const linkProgram = function(in_vertexWebGLShader, in_fragmentWebGLShader){
		var programHandle = in_webGLContextWrapper.callMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_vertexWebGLShader);
		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_fragmentWebGLShader);
		
		//for (var index = 0; index < m_vertexAttributeNameArray.length; ++index){
		if (undefined !== in_uniformNameTypeMapOrUndefined){
			var index = 0;
			for (var name in in_uniformNameTypeMapOrUndefined){
				in_webGLContextWrapper.callMethod("bindAttribLocation", programHandle, index, name);
				index += 1;
			}
		}
			
		in_webGLContextWrapper.callMethod("linkProgram", programHandle);

		const linkStatusEnum = in_webGLContextWrapper.getEnum("LINK_STATUS");
		const linked = in_webGLContextWrapper.callMethod("getProgramParameter", programHandle, linkStatusEnum);


		if (!linked) {			
			var errorInfo = in_webGLContextWrapper.callMethod("getProgramInfoLog", programHandle);
			alert("Error linking program: " + errorInfo);
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
		if (undefined !== in_uniformNameTypeMapOrUndefined){
			for (var name in in_uniformNameTypeMapOrUndefined){
				var typeName = in_uniformNameTypeMapOrUndefined[name];
				var uniformHandle = in_webGLContextWrapper.callMethod("getUniformLocation", programHandle, name);
				if (typeName === sMat4)
				{
					m_mapUniform[name] = uniformApplyFactoryMat4(typeName, uniformHandle);
				}
				else
				{
					m_mapUniform[name] = uniformApplyFactory(typeName, uniformHandle);
				}
			}
		}
			
		return programHandle;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return that;
}
