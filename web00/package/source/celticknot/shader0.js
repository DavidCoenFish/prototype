const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec3 a_colorMask;
varying vec2 v_uv;
varying vec3 v_colorMask;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
	v_colorMask = a_colorMask;
}
`;
const sFragmentShader = `
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_uv;
varying vec3 v_colorMask;
void main() {
	vec4 texel = texture2D(u_sampler0, v_uv);
	float value = dot(texel.rgb, v_colorMask);
	gl_FragColor = vec4(value, value, value, 1);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv", "a_colorMask"];
const sUniformNameArray = ["u_sampler0"];

const factory = function(in_webGLContextWrapper){
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sampler0"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			}
		}
	};
	return WebGL.ShaderWrapper.factory(
		in_webGLContextWrapper, 
		sVertexShader, 
		sFragmentShader, 
		m_uniformServer, 
		sVertexAttributeNameArray, 
		sUniformNameArray);
}

module.exports = {
	"factory" : factory,
};