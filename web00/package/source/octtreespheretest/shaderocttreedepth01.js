const Core = require("core");
const WebGL = require("webgl");

/*
//presume each pixel is 4 floats
data = [
0:	uv step x, step y, pad0, pad1, 
1:	sphere x, y, z, radius, //root sphere
2:	[node/ child stream]
	
	[node/ child stream]
r+0:	sphere0 x, y, z, radius, 
r+1:	uv0.x, uv0.y, pad0, pad1, // uv of the start of a new [node/ child stream]
r+2:	sphere1 x, y, z, radius, 
r+3:	uv1.x, uv1.y, pad0, pad1,
		...
r+n:	null sphere x, y, z, 0.0, //null terminate child stream with zero radius

		zero uv indicates no [node/ child stream] reference, 
r+?:	uvN.x == 0.0, uvN.y == 0.0, pad0, pad1,

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
	vec3 rayCardinal = (in_rayOrigin - in_spherePosition) / in_sphereRadius;
	float b = dot(in_rayNormal, rayCardinal);
	float c = dot(rayCardinal, rayCardinal) - 1.0;
	float h = (b*b) - c;

	return step(0.0, h); //return (h < 0) ? 0 : 1
}

vec2 advanceUv(vec2 in_traceUv, vec2 in_uvStep){
	float x = in_traceUv.x + in_uvStep.x;
	float y = in_traceUv.y + (step(1.0, x) * in_uvStep.x);
	x = fract(x);
	return vec2(x, y);
}

float TraverseOctree4(vec2 in_traceUv, vec2 in_uvStep, vec3 in_rayOrigin, vec3 in_rayNormal){
	vec2 traceUv = in_traceUv;
	float radius = 0.0;
	float value = 0.0;
	for(int index = 0; index < 32; ++index) {
		vec4 sphereData = texture2D(u_samplerOctTreeData, traceUv);
		radius = sphereData.w;
		if (0.0 == radius){
			break;
		}
		traceUv = advanceUv(traceUv, in_uvStep);
		float childValue = DRAW_VALUE * raySphere(in_rayOrigin, in_rayNormal, sphereData.xyz, sphereData.w);
		value += childValue;
		traceUv = advanceUv(traceUv, in_uvStep);
	};
	return value;
}

float TraverseOctree3(vec2 in_traceUv, vec2 in_uvStep, vec3 in_rayOrigin, vec3 in_rayNormal){
	vec2 traceUv = in_traceUv;
	float radius = 0.0;
	float value = 0.0;
	for(int index = 0; index < 32; ++index) {
		vec4 sphereData = texture2D(u_samplerOctTreeData, traceUv);
		radius = sphereData.w;
		if (0.0 == radius){
			break;
		}
		traceUv = advanceUv(traceUv, in_uvStep);
		float childValue = raySphere(in_rayOrigin, in_rayNormal, sphereData.xyz, sphereData.w);
		if (0.0 < childValue){
			childValue = DRAW_VALUE;
			vec4 uvData = texture2D(u_samplerOctTreeData, traceUv);
			if (0.0 != uvData.x){
				childValue += (1.0 - DRAW_VALUE) * TraverseOctree4(uvData.xy, in_uvStep, in_rayOrigin, in_rayNormal);
			}
		}
		value += childValue;
		traceUv = advanceUv(traceUv, in_uvStep);
	};
	return value;
}

float TraverseOctree2(vec2 in_traceUv, vec2 in_uvStep, vec3 in_rayOrigin, vec3 in_rayNormal){
	vec2 traceUv = in_traceUv;
	float radius = 0.0;
	float value = 0.0;
	for(int index = 0; index < 32; ++index) {
		vec4 sphereData = texture2D(u_samplerOctTreeData, traceUv);
		radius = sphereData.w;
		if (0.0 == radius){
			break;
		}
		traceUv = advanceUv(traceUv, in_uvStep);
		float childValue = raySphere(in_rayOrigin, in_rayNormal, sphereData.xyz, sphereData.w);
		if (0.0 < childValue){
			childValue = DRAW_VALUE;
			vec4 uvData = texture2D(u_samplerOctTreeData, traceUv);
			if (0.0 != uvData.x){
				childValue += (1.0 - DRAW_VALUE) * TraverseOctree3(uvData.xy, in_uvStep, in_rayOrigin, in_rayNormal);
			}
		}
		value += childValue;
		traceUv = advanceUv(traceUv, in_uvStep);
	};
	return value;
}

float TraverseOctree1(vec2 in_traceUv, vec2 in_uvStep, vec3 in_rayOrigin, vec3 in_rayNormal){
	vec2 traceUv = in_traceUv;
	float radius = 0.0;
	float value = 0.0;
	for(int index = 0; index < 32; ++index) {
		vec4 sphereData = texture2D(u_samplerOctTreeData, traceUv);
		radius = sphereData.w;
		if (0.0 == radius){
			break;
		}
		traceUv = advanceUv(traceUv, in_uvStep);
		float childValue = raySphere(in_rayOrigin, in_rayNormal, sphereData.xyz, sphereData.w);
		if (0.0 < childValue){
			childValue = DRAW_VALUE;
			vec4 uvData = texture2D(u_samplerOctTreeData, traceUv);
			if (0.0 != uvData.x){
				childValue += (1.0 - DRAW_VALUE) * TraverseOctree2(uvData.xy, in_uvStep, in_rayOrigin, in_rayNormal);
			}
		}
		value += childValue;
		traceUv = advanceUv(traceUv, in_uvStep);
	};
	return value;
}


float TraverseOctree0(vec2 in_traceUv, vec2 in_uvStep, vec3 in_rayOrigin, vec3 in_rayNormal){
	vec2 traceUv = in_traceUv;
	float radius = 0.0;
	float value = 0.0;
	for(int index = 0; index < 32; ++index) {
		vec4 sphereData = texture2D(u_samplerOctTreeData, traceUv);
		radius = sphereData.w;
		if (0.0 == radius){
			break;
		}
		traceUv = advanceUv(traceUv, in_uvStep);
		float childValue = raySphere(in_rayOrigin, in_rayNormal, sphereData.xyz, sphereData.w);
		if (0.0 < childValue){
			childValue = DRAW_VALUE;
			vec4 uvData = texture2D(u_samplerOctTreeData, traceUv);
			if (0.0 != uvData.x){
				childValue += (1.0 - DRAW_VALUE) * TraverseOctree1(uvData.xy, in_uvStep, in_rayOrigin, in_rayNormal);
			}
		}
		value += childValue;
		traceUv = advanceUv(traceUv, in_uvStep);
	};
	return value;
}

void main() {
	vec3 viewRayNormal = getViewRayNormal();
	vec4 rootData = texture2D(u_samplerOctTreeData, vec2(0.0, 0.0));
	vec2 uvStep = rootData.xy;

	vec2 traceUv = vec2(1.5 * uvStep.x, 0.5 * uvStep.y);
	vec4 rootSphere = texture2D(u_samplerOctTreeData, traceUv);
	float value = raySphere(u_cameraPos, viewRayNormal, rootSphere.xyz, rootSphere.w);

	if (0.0 == value){
		discard;
	}

	traceUv = advanceUv(traceUv, uvStep);
	value = DRAW_VALUE + ((1.0 - DRAW_VALUE) * TraverseOctree0(traceUv, uvStep, u_cameraPos, viewRayNormal));

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