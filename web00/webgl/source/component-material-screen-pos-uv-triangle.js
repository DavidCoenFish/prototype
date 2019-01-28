/*
render in screen homogenius coordiantes the given triangles, using uvs (and texture)
 */

const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js");
const ShaderWrapper = require("./shaderwrapper.js");
const MaterialWrapper = require("./materialwrapper.js");

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
const sUniformNameArray = ["u_sampler0"];

const shaderFactory = function(in_webGLContextWrapper, in_uniformServer){
	return ShaderWrapper.factory(
		in_webGLContextWrapper, 
		sVertexShader, 
		sFragmentShader, 
		in_uniformServer, 
		sVertexAttributeNameArray, 
		sUniformNameArray);

}

const materialFactory = function(in_shader, in_textureArray){
	const material = MaterialWrapper.factory(
		in_shader,
		in_textureArray
	);
	material.setDepthMask(false);
	material.setColorMask(true, true, true, true);
	return material;
}

const sShaderName = "componentShaderScreenPosUvTriangle";
const sMaterialName = "componentMaterialScreenPosUvTriangle";

const factory = function(in_resourceManager, in_webGLContextWrapper, in_texture){

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}

	if (false === in_resourceManager.hasFactory(sMaterialName)){
		in_resourceManager.addFactory(sMaterialName, materialFactory);
	}

	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sampler0"){
				WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			}
		}
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLContextWrapper, m_uniformServer);
	var m_material = in_resourceManager.getUniqueReference(sMaterialName, m_shader, [in_texture]);

	//public methods ==========================
	const result = Object.create({
		"getMaterial" : function(){
			return m_material;
		},
		"destroy" : function(){
			m_shader = undefined;
			m_material = undefined;
			in_resourceManager.releaseCommonReference(sShaderName);
		}
	})

	return result;

}

module.exports = {
	"factory" : factory
}
