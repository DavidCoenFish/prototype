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

// Hash without Sine
// Creative Commons Attribution-ShareAlike 4.0 International Public License
// Created by David Hoskins.
// https://www.shadertoy.com/view/4djSRW
#define HASHSCALE3 vec3(443.897, 441.423, 437.195)
vec2 hash22(vec2 in_input){
	vec3 p3 = fract(vec3(in_input.xyx) * HASHSCALE3);
	p3 += dot(p3, p3.yzx+19.19);
	return fract((p3.xx+p3.yz)*p3.zy);
}

//return the minium distance to a point of interest (grid with hash offset)
float cellNoise(vec2 in_uv){
	vec2 sample = vec2(in_uv.x, in_uv.y) * 10.0;
	vec2 sampleFloor = floor(sample);

	// based on concept from inigo quilez <http://iquilezles.org/www/articles/voronoise/voronoise.htm>
	float minDistanceSquared = 1000.0;
	for (int yOffset = -2; yOffset <= 2; ++yOffset){
		for (int xOffset = -2; xOffset <= 2; ++xOffset){
			vec2 rawGrid = vec2(sampleFloor.x + float(xOffset), sampleFloor.y + float(yOffset));
			vec2 noiseOffset = hash22(rawGrid);
			vec2 gridPoint = rawGrid + noiseOffset;
			vec2 offset = sample - gridPoint;
			float dist = dot(offset, offset);
			minDistanceSquared = min(minDistanceSquared, dist);
		}
	}
	return minDistanceSquared;
}

void main() {
	vec2 uvA = v_position + vec2(u_ratio / 20.0, -u_ratio / 20.0); //vec2(offSin, offCos); 
	vec2 uvB = v_position + vec2(10.0) + vec2(-u_ratio / 20.0, -u_ratio / 20.0); //vec2(offCos, offSin);
	float minDistance = sqrt(min(cellNoise(uvA), cellNoise(uvB)));

	gl_FragColor = vec4(minDistance, minDistance, minDistance, 1.0);
}
`;
const sVertexAttributeNameArray = ["a_position"];
//u_fovNormScaleXY = vec2(sin(horizontal fov / 2), sin(vertical fov / 2))
// we use this to scale the current shader v_position into a view ray normal
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