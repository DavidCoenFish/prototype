import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from "./shaderuniformtype.js"

//export function ShaderFactory(
export default function(
	in_webGLContextWrapper,
	in_vertexShaderSource, 
	in_fragmentShaderSource, 
	in_vertexAttributeNameArrayOrUndefined, 
	//in_nameShaderUniformDataFactoryMapOrUndefined, //{name: { "apply" : function(in_uniformLocation)},...}
	in_shaderDataArrayOrUndefined //[{"getName", "apply":function(in_uniformLocation, in_value)},...]
	){
	var m_shaderProgramObject = undefined;
	var m_vertexWebGLShader = undefined;
	var m_fragmentWebGLShader = undefined;
	var m_mapVertexAttribute = undefined;
	var m_uniformArray = undefined;

	//public methods ==========================
	const that = Object.create({
		"getMapVertexAttribute" : function(){
			return m_mapVertexAttribute;
		},
		"apply" : function(in_uniforValueArrayOrUndefined, in_textureArrayOrUndefined){
			if (undefined !== m_shaderProgramObject){
				in_webGLContextWrapper.callMethod("useProgram", m_shaderProgramObject);
			}

			var arrayLength = m_uniformArray.length;
			for (var index = 0; index < arrayLength; index++) {
				m_uniformArray[index].apply(in_uniforValueArrayOrUndefined[index]);
			}

			if (undefined !== in_textureArrayOrUndefined)
			{
				var arrayLength = in_textureArrayOrUndefined.length;
				for (var index = 0; index < arrayLength; index++) {
					in_textureArrayOrUndefined[index].apply(index);
				}
			}
		},
		/*
		is is the inputIndexArray
		in_inputIndexArray[0] = array of shader data uniforms values or undefined
		in_inputIndexArray[1] = array of shader data texture values or undefined
		
		or
		in_inputIndexArray[0 ... n] = array of shader data uniforms values or undefined
		in_inputIndexArray[n + 1 .... m] = array of shader data texture values or undefined

		prefer the second as i don't want to recreate a container array each time values change,
		but then again, we give the old result as input to the calculate, so you could hand in the old array and update values...

		... we structure things for dag calculation, but we don't actually use it's methods at this level?
		*/
		//"calculateCallback" : function( in_calculatedValue, in_inputIndexArray, in_inputArray ){
		//	that.apply( in_inputIndexArray[0], in_inputIndexArray[1] );
		//	return undefined;
		//},

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
		m_uniformArray = undefined;
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

	const applyUniform = function(in_shaderData, in_uniformLocation){
		return function(in_value){
			in_shaderData.apply(in_uniformLocation, in_value);
		};
	}

	const linkProgram = function(in_vertexWebGLShader, in_fragmentWebGLShader){
		var programHandle = in_webGLContextWrapper.callMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_vertexWebGLShader);
		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_fragmentWebGLShader);
		
		if (undefined !== in_nameShaderUniformDataFactoryMapOrUndefined){
			var index = 0;
			for (var name in in_nameShaderUniformDataFactoryMapOrUndefined){
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

		m_uniformArray = [];
		if (undefined !== in_shaderDataArrayOrUndefined){
			for (var index = 0; index < in_shaderDataArrayOrUndefined.length; ++index){
				var shaderData = in_shaderDataArrayOrUndefined[index];
				var name = shaderData.getName();
				var uniformLocation = in_webGLContextWrapper.callMethod("getUniformLocation", programHandle, name);
				if (DEVELOPMENT && (undefined === uniformLocation)){
					console.log("WARNING: shader uniform not found:", name);
				}
				m_uniformArray.push(applyUniform(shaderData, uniformLocation));
			}
		}

		return programHandle;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return that;
}
