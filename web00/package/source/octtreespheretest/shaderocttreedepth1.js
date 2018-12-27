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
const sFragmentShader = `
precision mediump float;
varying vec2 v_position;
uniform sampler2D u_samplerOctTreeData;
uniform vec2 u_fovNormScaleXY;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraRight;
uniform vec3 u_cameraPos;
#define OCTTREEDEPTH 2

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
	vec3 rayCardinal = (in_rayOrigin - in_spherePosition) / in_sphereRadius;
	float b = dot(in_rayNormal, rayCardinal);
	float c = dot(rayCardinal, rayCardinal) - 1.0;
	float h = (b*b) - c;

	// not intersecting
	if( h<0.0 ) {
		return 0.0;
	}
	return 1.0;
}

float traverseOctTree1(vec2 in_uv, vec2 in_uvStep, vec3 in_viewRayNormal, vec3 in_cameraPos){
	vec4 sphere0 = texture2D(u_samplerOctTreeData, in_uv);
	float value = raySphere(
		in_cameraPos,
		in_viewRayNormal,
		sphere0.xyz,
		sphere0.w
		);
	if (value == 0.0){
		return 0.0;
	}
	
	return 1.0;
}

//node 
// x, y, z, radius,
// w0, w1, w2, w3
// w4, w5, w6, w7
// uv0, uv0, uv1, uv1,
// uv2, uv2, uv3, uv3,
// uv4, uv4, uv5, uv5,
// uv6, uv6, uv7, uv7,
float traverseOctTree2(vec2 in_uv, vec2 in_uvStep, vec3 in_viewRayNormal, vec3 in_cameraPos){
	vec4 sphere0 = texture2D(u_samplerOctTreeData, in_uv);
	float value = raySphere(
		in_cameraPos,
		in_viewRayNormal,
		sphere0.xyz,
		sphere0.w
		);
	if (value == 0.0){
		return 0.0;
	}

	vec4 weight0123 = texture2D(u_samplerOctTreeData, in_uv + vec2(in_uvStep.x, 0.0));
	vec4 weight4567 = texture2D(u_samplerOctTreeData, in_uv + vec2(in_uvStep.x * 2.0, 0.0));

	float sum = 0.5;
	if ((weight0123.x != 0.0) || (weight0123.y != 0.0)){
		vec4 uv0uv1 = texture2D(u_samplerOctTreeData, in_uv + vec2(in_uvStep.x * 3.0, 0.0));
		sum += weight0123.x * 0.125 * traverseOctTree1(uv0uv1.xy, in_uvStep, in_viewRayNormal, in_cameraPos);
		sum += weight0123.y * 0.125 * traverseOctTree1(uv0uv1.zw, in_uvStep, in_viewRayNormal, in_cameraPos);
	}

	if ((weight0123.z != 0.0) || (weight0123.w != 0.0)){
		vec4 uv2uv3 = texture2D(u_samplerOctTreeData, in_uv + vec2(in_uvStep.x * 4.0, 0.0));
		sum += weight0123.z * 0.125 * traverseOctTree1(uv2uv3.xy, in_uvStep, in_viewRayNormal, in_cameraPos);
		sum += weight0123.w * 0.125 * traverseOctTree1(uv2uv3.zw, in_uvStep, in_viewRayNormal, in_cameraPos);
	}

	if ((weight4567.x != 0.0) || (weight4567.y != 0.0)){
		vec4 uv4uv5 = texture2D(u_samplerOctTreeData, in_uv + vec2(in_uvStep.x * 5.0, 0.0));
		sum += weight4567.x * 0.125 * traverseOctTree1(uv4uv5.xy, in_uvStep, in_viewRayNormal, in_cameraPos);
		sum += weight4567.y * 0.125 * traverseOctTree1(uv4uv5.zw, in_uvStep, in_viewRayNormal, in_cameraPos);
	}

	if ((weight4567.z != 0.0) || (weight4567.w != 0.0)){
		vec4 uv6uv7 = texture2D(u_samplerOctTreeData, in_uv + vec2(in_uvStep.x * 6.0, 0.0));
		sum += weight4567.z * 0.125 * traverseOctTree1(uv6uv7.xy, in_uvStep, in_viewRayNormal, in_cameraPos);
		sum += weight4567.w * 0.125 * traverseOctTree1(uv6uv7.zw, in_uvStep, in_viewRayNormal, in_cameraPos);
	}

	return sum;
}

void main() {
	vec3 viewRayNormal = getViewRayNormal();
	//vec3 viewRayNormal = vec3(0.0, 1.0, 0.0); // = getViewRayNormal();
	vec4 rootData = texture2D(u_samplerOctTreeData, vec2(0.0, 0.0));
	vec2 uvStep = rootData.xy;
	float value = traverseOctTree2(vec2(1.5 * uvStep.x, 0.5 * uvStep.y), uvStep, viewRayNormal, u_cameraPos);
	gl_FragColor = vec4(value, value, value, 1.0);
}
`;
const sVertexAttributeNameArray = ["a_position"];
//u_fovNormScaleXY = vec2(sin(horizontal fov / 2), sin(vertical fov / 2))
// we use this to scale the current shader v_position into a view ray normal
const sUniformNameArray = ["u_samplerOctTreeData", "u_fovNormScaleXY", "u_cameraAt", "u_cameraUp", "u_cameraRight", "u_cameraPos"];

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