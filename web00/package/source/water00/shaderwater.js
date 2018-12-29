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
uniform sampler2D u_samplerEnvMap;

void main() {
	vec2 uv = (v_position * 0.5) + 0.5;

	vec2 uvStep = vec2(1.0 / 512.0, 1.0 / 512.0);
	float height0 = texture2D(u_samplerHeight, uv).x;
	float height1 = texture2D(u_samplerHeight, uv - vec2(uvStep.x, 0.0)).x - height0;
	float height2 = texture2D(u_samplerHeight, uv - vec2(0.0, uvStep.y)).x - height0;
	float height3 = texture2D(u_samplerHeight, uv + vec2(uvStep.x, 0.0)).x - height0;
	float height4 = texture2D(u_samplerHeight, uv + vec2(0.0, uvStep.y)).x - height0;
	float offset = 0.25;
	vec3 cross1 = cross(vec3(offset, 0, height1), vec3(0, offset, height2));
	vec3 cross2 = cross(vec3(offset, 0, -height3), vec3(0, offset, -height4));
	vec3 normal = normalize(cross1 + cross2);
	vec2 envMapUV = (normal.xy * 0.5) + 0.5;

	vec4 texel = texture2D(u_samplerEnvMap, envMapUV);

	gl_FragColor = texel + (height0 * 0.25);
}
`;
const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = ["u_samplerHeight", "u_samplerEnvMap"];

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