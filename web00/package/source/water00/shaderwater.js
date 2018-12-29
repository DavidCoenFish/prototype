const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
varying vec2 v_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_position = a_position;
}
`;

/*
	float value = 0.0;
	float length = 0.1; //u_height * cosTilt;
	float prev_height = 0.0;
	for (int index = 0; index <= DIVISIONS; ++index){
		float ratio = float(index) / float(DIVISIONS);
		vec2 sampleUv = uv + vec2(0.0, length * ratio);
		vec4 sample = texture2D(u_samplerHeight, sampleUv);
		float calcHeight = (1.0 - ratio);
		if (calcHeight < sample.x){
			value = sample.x;
			break;
		}
	}
 */

const sFragmentShader = `
precision mediump float;
varying vec2 v_position;
uniform sampler2D u_samplerHeight;

void main() {
	vec2 uv = (v_position * 0.5) + 0.5;
	vec4 sample0 = texture2D(u_samplerHeight, uv);
	//float value = sample0.x * sample0.x;
	//gl_FragColor = vec4(value, value, value, 1.0);
	gl_FragColor = sample0;
}
`;
const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = ["u_samplerHeight"];

const factory = function(in_webGLContextWrapper, in_uniformServer){
	return WebGL.ShaderWrapper.factory(
		in_webGLContextWrapper, 
		sVertexShader, 
		sFragmentShader, 
		in_uniformServer, 
		sVertexAttributeNameArray, 
		sUniformNameArray);
}

module.exports = {
	"factory" : factory,
};