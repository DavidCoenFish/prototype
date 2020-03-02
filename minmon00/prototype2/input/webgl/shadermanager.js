//import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from "./shaderuniformtype.js"
import ShaderResourceFactory from "./shaderresource.js"
import ShaderFactory from "./shader.js"
import {ShaderDataUniformFactory, ShaderDataUniformNormaliseFactory} from "./shaderdata.js"

//export function ShaderFactory(
export default function(
	in_webGLContextWrapper
	){
	var m_mapVertexShaders = {};
	var m_mapFragmentShaders = {};
	var m_mapShader = {};

	//public methods ==========================
	const that = Object.create({
		"getShader" : function(
			in_vertexShaderSource, 
			in_fragmentShaderSource, 
			in_vertexAttributeNameArrayOrUndefined,
			in_shaderDataArrayOrUndefined //[{"getName", "activate":function(in_uniformLocation, in_value)},...]
		){ 
			var key = makeKey(
				in_vertexShaderSource, 
				in_fragmentShaderSource
				);
			if (key in m_mapShader){
				return m_mapShader[key];
			}

			var vertexShader = undefined;
			if (in_vertexShaderSource in m_mapVertexShaders){
				vertexShader = m_mapVertexShaders[in_vertexShaderSource];
			} 
			else{
				vertexShader = ShaderResourceFactory(
					in_webGLContextWrapper,
					in_vertexShaderSource, 
					"VERTEX_SHADER"
					);
				m_mapVertexShaders[in_vertexShaderSource] = vertexShader;
			}
			var fragmentShader = undefined;
			if (in_fragmentShaderSource in m_mapFragmentShaders){
				fragmentShader = m_mapFragmentShaders[in_fragmentShaderSource];
			} 
			else{
				fragmentShader = ShaderResourceFactory(
					in_webGLContextWrapper,
					in_fragmentShaderSource, 
					"FRAGMENT_SHADER"
					);
				m_mapFragmentShaders[in_fragmentShaderSource] = fragmentShader;
			}

			var shader = ShaderFactory(
				in_webGLContextWrapper,
				vertexShader, 
				fragmentShader, 
				in_vertexAttributeNameArrayOrUndefined, 
				in_shaderDataArrayOrUndefined, //[{"getName", "activate":function(in_uniformLocation, in_value)},...]
				key
				);
			m_mapShader[key] = shader;
			return shader;
		},

		"createShaderDataUniform" : function(
			in_name,
			in_typeName
		){
			return ShaderDataUniformFactory(
				in_webGLContextWrapper,
				in_name,
				in_typeName
			);
		},

		"createShaderDataUniformNormalise" : function(
			in_name,
			in_typeName,
			in_normalise
		){
			return ShaderDataUniformNormaliseFactory(
				in_webGLContextWrapper,
				in_name,
				in_typeName,
				in_normalise
			);
		},

		"releaseShader" : function(in_shader){
			if (undefined === in_shader){
				return;
			}
			var key = in_shader.getShaderManagerKey();
			if (key in m_mapShader){
				delete m_mapShader[key];
			}
			in_shader.destroy();
			return;
		},
	});

	//private methods ==========================
	const makeKey = function(in_vertexShaderSource, in_fragmentShaderSource){
		return in_vertexShaderSource + in_fragmentShaderSource;
	}

	return that;
}
