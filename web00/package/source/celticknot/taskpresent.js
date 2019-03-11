/*
input texture
output undefined
 */

const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
	v_uv = a_uv;
}
`;
const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler;
void main() {
	gl_FragColor = texture2D(u_sampler, v_uv);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv", 
];
const sUniformNameMap = {
	"u_sampler" : WebGL.ShaderUniformData.sInt,
};

const shaderFactory = function(in_webGLState){
	return WebGL.ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}

const factory = function(in_resourceManager, in_webGLState){
	const m_textureArray = [ undefined ];
	const m_material = WebGL.MaterialWrapper.factory(m_textureArray);
	const m_model = in_resourceManager.getCommonReference("modelScreenQuad", in_webGLState);
	const m_state = {
		"u_sampler" : 0,
	};
	const m_shader = shaderFactory(in_webGLState);

	const that = Object.create({
		"run" : function(in_texture){
			m_textureArray[0] = in_texture;
			in_webGLState.applyRenderTarget();
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			//in_webGLState.clear(Core.Colour4.factoryFloat32(1.0, 0.0, 0.0, 1.0));

			return;
		}

	});

	return that;
}

module.exports = {
	"factory" : factory,
};
