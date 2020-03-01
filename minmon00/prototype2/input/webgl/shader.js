import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from "./shaderuniformtype.js"

//export function ShaderFactory(
export default function(
	in_webGLContextWrapper,
	in_vertexShaderResource, 
	in_fragmentShaderResource, 
	in_vertexAttributeNameArrayOrUndefined, 
	in_shaderDataArrayOrUndefined, //[{"getName", "activate":function(in_uniformLocation, in_value)},...]
	in_shaderManagerKey
	){
	var m_shaderProgramObject = undefined;
	var m_mapVertexAttribute = undefined;
	var m_uniformArray = undefined;

	//public methods ==========================
	const that = Object.create({
		"getShaderManagerKey" : function(){
			return in_shaderManagerKey;
		},
		"getMapVertexAttribute" : function(){
			return m_mapVertexAttribute;
		},
		"activate" : function(in_uniforValueArrayOrUndefined, in_textureArrayOrUndefined){
			if (undefined !== m_shaderProgramObject){
				in_webGLContextWrapper.callMethod("useProgram", m_shaderProgramObject);
			}

			if (undefined !== in_textureArrayOrUndefined)
			{
				var arrayLength = in_textureArrayOrUndefined.length;
				for (var index = 0; index < arrayLength; index++) {
					in_textureArrayOrUndefined[index].activate(index);
				}
			}

			var arrayLength = m_uniformArray.length;
			for (var index = 0; index < arrayLength; index++) {
				m_uniformArray[index](in_uniforValueArrayOrUndefined[index]);
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

		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(){
		m_shaderProgramObject = linkProgram(
			in_vertexShaderResource.getShader(),
			in_fragmentShaderResource.getShader()
			);
		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const lostCallback = function(){
		m_mapVertexAttribute = undefined;
		m_uniformArray = undefined;
		if ( undefined !== m_shaderProgramObject){
			in_webGLContextWrapper.callMethod("deleteProgram", m_shaderProgramObject);
			m_shaderProgramObject = undefined;
		}

		return;
	}

	const applyUniform = function(in_shaderData, in_uniformLocation){
		return function(in_value){
			in_shaderData.activate(in_uniformLocation, in_value);
		};
	}

	const linkProgram = function(in_vertexWebGLShader, in_fragmentWebGLShader){
		var programHandle = in_webGLContextWrapper.callMethod("createProgram");
		if ((0 === programHandle) || (undefined === programHandle)){
			return undefined;
		}

		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_vertexWebGLShader);
		in_webGLContextWrapper.callMethod("attachShader", programHandle, in_fragmentWebGLShader);
		
		if (undefined !== in_shaderDataArrayOrUndefined){
			for (var index = 0; index < in_shaderDataArrayOrUndefined.length; ++index){
				var shaderData = in_shaderDataArrayOrUndefined[index];
				var name = shaderData.getName();
				in_webGLContextWrapper.callMethod("bindAttribLocation", programHandle, index, name);
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
