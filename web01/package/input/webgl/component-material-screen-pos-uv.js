/*
render in screen homogenius coordiantes the given triangles, using uvs (and texture)
 */

const ShaderUniformData = require("./shaderuniformdata.js");
import ShaderWrapperFactory from "./shaderwrapper.js";

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;

void main() {
	v_uv = a_uv;
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler0;
void main() {
	vec4 texel = texture2D(u_sampler0, v_uv);
	gl_FragColor = texel;
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_sampler0" : ShaderUniformData.sInt
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}

const materialFactory = function(in_textureArray){
	const material = MaterialWrapper.factory(
		in_textureArray
	);
	return material;
}

const sShaderName = "componentShaderScreenPosUvTriangle";
const sMaterialName = "componentMaterialScreenPosUvTriangle";

const factory = function(in_resourceManager, in_webGLState, in_textureArray){

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}

	if (false === in_resourceManager.hasFactory(sMaterialName)){
		in_resourceManager.addFactory(sMaterialName, materialFactory);
	}

	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);
	var m_material = in_resourceManager.getUniqueReference(sMaterialName, in_textureArray);

	//public methods ==========================
	const that = Object.create({
		"getMaterial" : function(){
			return m_material;
		},
		"getShader" : function(){
			return m_shader;
		},
		"destroy" : function(){
			m_shader = undefined;
			m_material = undefined;
			in_resourceManager.releaseCommonReference(sShaderName);
		}
	})

	return that;
}

module.exports = {
	"factory" : factory
}
