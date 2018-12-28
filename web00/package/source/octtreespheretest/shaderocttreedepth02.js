const Core = require("core");
const WebGL = require("webgl");

/*
//presume each pixel is 4 floats
data = [
0:	sphere x, y, z, radius, //root sphere
1...8: 1st generation children
9...72: 2nd generation children
73...584: 3rd generation children
585...4679: 4th generation children
4680...37446: 5th generation children
];

*/
const sVertexShader = `
attribute vec2 a_position;
varying vec2 v_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_position = a_position;
}
`;
const sFragmentShader = `
precision mediump float;
varying vec2 v_position;
uniform sampler2D u_samplerOctTreeData;
uniform vec2 u_fovNormScaleXY;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraRight;
uniform vec3 u_cameraPos;
uniform vec2 u_textureDim;
#define DRAW_VALUE 0.125

vec3 getViewRayNormal() {
	vec2 scaledXY = v_position.xy * u_fovNormScaleXY.xy;
	float distSquared = clamp(dot(scaledXY, scaledXY), 0.0, 1.0);
	float viewZ = sqrt(1.0 - distSquared);
	vec3 viewNorm = vec3(scaledXY.x, scaledXY.y, viewZ);
	return viewNorm;
	// vec3 worldNorm = vec3(
	// 	dot(u_cameraRight, viewNorm),
	// 	dot(u_cameraAt, viewNorm),
	// 	dot(u_cameraUp, viewNorm)
	// 	);
	// return worldNorm;
}

//http://www.iquilezles.org/www/articles/spheredensity/spheredensity.htm
float raySphere(
	vec3 in_rayOrigin,
	vec3 in_rayNormal,
	vec3 in_spherePosition,
	float in_sphereRadius
	){
	if (in_sphereRadius == 0.0){
		return 0.0;
	}
	vec3 rayCardinal = (in_rayOrigin - in_spherePosition) / in_sphereRadius;
	float b = dot(in_rayNormal, rayCardinal);
	float c = dot(rayCardinal, rayCardinal) - 1.0;
	float h = (b*b) - c;

	return step(0.0, h);
}

vec2 uvFromTrace(float in_trace){
	float cursor = (in_trace + 0.5) / u_textureDim.x;
	float x = fract(cursor);
	float y = (floor(cursor) + 0.5) / u_textureDim.y;
	return vec2(x, y);
}
//1 + 8 + 64 + 512
float getValue3(vec3 in_rayOrigin, vec3 in_rayNormal, float in_parentTrace){
	float trace = 585.0 + (in_parentTrace * 8.0);
	float value = 0.0;
	for (int index = 0; index < 8; ++index){
		vec2 uv = uvFromTrace(trace);
		vec4 sphere = texture2D(u_samplerOctTreeData, uv);

		float ratio = raySphere(in_rayOrigin, in_rayNormal, sphere.xyz, sphere.w);

		value += mix(0.0, DRAW_VALUE, ratio);
		trace += 1.0;
	}
	return value;
}

float getValue2(vec3 in_rayOrigin, vec3 in_rayNormal, float in_parentTrace){
	float trace = 73.0 + (in_parentTrace * 8.0);
	float value = 0.0;
	for (int index = 0; index < 8; ++index){
		vec2 uv = uvFromTrace(trace);
		vec4 sphere = texture2D(u_samplerOctTreeData, uv);

		float ratio = raySphere(in_rayOrigin, in_rayNormal, sphere.xyz, sphere.w);
		if (0.0 < ratio){
			value += DRAW_VALUE;
			value += getValue3(in_rayOrigin, in_rayNormal, (in_parentTrace * 8.0) + float(index)) * (1.0 - DRAW_VALUE);
		}

		trace += 1.0;
	}
	return value;
}

float getValue1(vec3 in_rayOrigin, vec3 in_rayNormal, float in_parentTrace){
	float trace = 9.0 + (in_parentTrace * 8.0);
	float value = 0.0;
	for (int index = 0; index < 8; ++index){
		vec2 uv = uvFromTrace(trace);
		vec4 sphere = texture2D(u_samplerOctTreeData, uv);

		float ratio = raySphere(in_rayOrigin, in_rayNormal, sphere.xyz, sphere.w);
		if (0.0 < ratio){
			value += DRAW_VALUE;
			value += getValue2(in_rayOrigin, in_rayNormal, (in_parentTrace * 8.0) + float(index)) * (1.0 - DRAW_VALUE);
		}

		trace += 1.0;
	}
	return value;
}

float getValue0(vec3 in_rayOrigin, vec3 in_rayNormal){
	float trace = 1.0;
	float value = 0.0;
	for (int index = 0; index < 8; ++index){
		vec2 uv = uvFromTrace(trace);
		vec4 sphere = texture2D(u_samplerOctTreeData, uv);

		float ratio = raySphere(in_rayOrigin, in_rayNormal, sphere.xyz, sphere.w);
		if (0.0 < ratio){
			value += DRAW_VALUE;
			value += getValue1(in_rayOrigin, in_rayNormal, float(index)) * (1.0 - DRAW_VALUE);
		}

		trace += 1.0;
	}
	return value;
}

void main() {
	vec3 viewRayNormal = getViewRayNormal();
	vec4 rootSphere = texture2D(u_samplerOctTreeData, vec2(0.5 / u_textureDim.x, 0.5 / u_textureDim.y));

	float value = raySphere(u_cameraPos, viewRayNormal, rootSphere.xyz, rootSphere.w);

	if (0.0 == value){
		discard;
	}

	value = mix(getValue0(u_cameraPos, viewRayNormal), 1.0, DRAW_VALUE);

	gl_FragColor = vec4(value, value, value, 1.0);
}
`;
const sVertexAttributeNameArray = ["a_position"];
//u_fovNormScaleXY = vec2(sin(horizontal fov / 2), sin(vertical fov / 2))
// we use this to scale the current shader v_position into a view ray normal
const sUniformNameArray = ["u_samplerOctTreeData", "u_fovNormScaleXY", "u_cameraAt", "u_cameraUp", "u_cameraRight", "u_cameraPos", "u_textureDim"];

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