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

//#define DRAW_VALUE 0.125

const sFragmentShader = `
precision mediump float;
varying vec2 v_position;
uniform float u_ratio;

float heightTransform(float in_x){
	float xSquared = in_x * in_x;
	return (3.0 - (2.0 * in_x)) * xSquared;
}

vec2 transformUv(vec2 in_direction, vec2 in_uv, float in_ratio, float in_divisions){
	vec2 pos = in_uv * vec2(1.0, 2.0);
	float ratio = (fract(in_ratio * in_divisions));
	vec2 resultUV = vec2(dot(in_direction, pos) * in_divisions + ratio, dot(vec2(in_direction.y, -in_direction.x), pos));
	return resultUV;
}

float waveGenerator(vec2 in_uv){
	vec2 sample = abs((fract(in_uv) * 2.0) - 1.0);
	float result = heightTransform(sample.x);
	return result;
}

/*
45:0.7071, 0.7071
40:0.6428, 0.7660
35:0.5735, 0.8191
30:0.5   , 0.5660
25:0.4226, 0.9063
22.5:0.386, 0.923
20:0.3420, 0.9396
15:0.2588, 0.9695
10:0.1736, 0.9848
 5:0.0871, 0.9961

*/
void main() {
	float value0 = waveGenerator(transformUv(vec2(-0.7071, 0.7071), v_position, u_ratio, 1.0));
	float value1 = waveGenerator(transformUv(vec2(0.5735, 0.8191), v_position, u_ratio, 1.5));
	float value2 = waveGenerator(transformUv(vec2(-0.6428, 0.7660), v_position, u_ratio, 2.5));
	float value3 = waveGenerator(transformUv(vec2(0.2588, 0.9695), v_position, u_ratio, 3.2));
	float value4 = waveGenerator(transformUv(vec2(-0.5, 0.866), v_position, u_ratio, 4.1));
	float value5 = waveGenerator(transformUv(vec2(0.386, -0.923), v_position, u_ratio, 5.0));
	float value6 = waveGenerator(transformUv(vec2(-0.1736, 0.9848), v_position, u_ratio, 5.5));
	float value7 = waveGenerator(transformUv(vec2(-0.0871, -0.9961), v_position, u_ratio, 7.9));
	float value8 = waveGenerator(transformUv(vec2(0.4226, -0.9063), v_position, u_ratio, 8.2));
	float value = (value0 * 0.25) + (value1 * 0.25) + (value2 * 0.125) + (value3 * 0.125) + (value4 * 0.125) 
		+ (value5 * 0.05) + (value6 * 0.05) + (value7 * 0.04) + (value8 * 0.04);
	gl_FragColor = vec4(value, value, value, 1.0);
}
`;
const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = ["u_ratio"];

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