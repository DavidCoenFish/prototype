import ModelObjectIDFactory from "./modelcylinderobjectid.js";
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat, sFloat2, sFloat3} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";

const sVertexShader = `
precision mediump float;

attribute vec4 a_sphere;
attribute vec4 a_cylinder;
attribute vec4 a_colour;

uniform float u_fovhradian;
uniform vec2 u_viewportWidthHeight;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform float u_cameraFar;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_cylinder;
varying float v_radius2;
varying vec4 v_colour;

void main() {
	vec3 cameraToAtom = a_sphere.xyz - u_cameraPos;

	float cameraSpaceX = -dot(cameraToAtom, u_cameraLeft);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0));
	float maxRadian = 0.5 * u_fovhradian * (length(u_viewportWidthHeight) / u_viewportWidthHeight.x);
	v_keepOrDiscard = 1.0 - (polarR / maxRadian);

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float width = u_viewportWidthHeight.x;
	float height = u_viewportWidthHeight.y;
	float fovHHalfRadians = u_fovhradian * 0.5;
	float screenR = polarR / fovHHalfRadians; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = cameraSpaceLength / u_cameraFar;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float sphereRadiusAngleRadians = asin(a_sphere.w / cameraSpaceLength);
	float pixelDiameter = width * (sphereRadiusAngleRadians / fovHHalfRadians);
	pixelDiameter += max(0.0, ((1.0 * screenR * width) * tan(sphereRadiusAngleRadians)));

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pixelDiameter;

	v_uvScale = vec2(pixelDiameter / width, -pixelDiameter / width * apsectCorrection);
	v_uv = vec2((screenX / 2.0) + 0.5, (screenY / 2.0) + 0.5) - (v_uvScale * 0.5);

	v_sphere = a_sphere;
	v_cylinder = a_cylinder;
	v_radius2 = sqrt((a_sphere.w * a_sphere.w) - (a_cylinder.w * a_cylinder.w));
	v_colour = a_colour;
}
`;

const sFragmentShader = `
#extension GL_EXT_frag_depth : enable
precision mediump float;

uniform sampler2D u_samplerCameraRay;

uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec4 u_cameraFovhFovvFarClip;
uniform float u_cameraFar;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_cylinder;
varying float v_radius2;
varying vec4 v_colour;

vec3 makeWorldRay(vec3 in_screenEyeRay){
	return ((-(in_screenEyeRay.x) * u_cameraLeft) +
		(in_screenEyeRay.y * u_cameraUp) +
		(in_screenEyeRay.z * u_cameraAt));
}

//http://geomalgorithms.com/a07-_distance.html
vec2 findRayRayClosest(vec3 in_rayA, vec3 in_posA, vec3 in_rayB, vec3 in_posB, float maxDistance){
	vec3 u = in_rayA;
	vec3 v = in_rayB;
	vec3 w = in_posA - in_posB;
	float a = dot(u, u);
	float b = dot(u, v);
	float c = dot(v, v);
	float ACminBB = (a * c) - (b * b);

	if (abs(ACminBB) < 0.0001){
		//float Td = dot((in_posA + in_rayA) - in_posB, in_rayB);
		//return vec2(1.0, Td);
		return vec2(maxDistance, maxDistance);
	}

	float d = dot(u, w);
	float e = dot(v, w);
	float Sc = ((b*e)-(c*d)) / ACminBB;
	float Tc = ((a*e)-(b*d)) / ACminBB;
	return vec2(Sc, Tc);
}


//https://www.gamedev.net/forums/topic/467789-raycylinder-intersection/
//r1 = half length of cylinder
//r2 = pipe radius
//cylinderNormal blue
float rayCylinder(vec3 cylinderNormal, vec3 cylinderPos, float r1, float r2, vec3 eyeRay, vec3 eyePos, float maxDistance){
	vec3 rightNormal = normalize(cross(eyeRay, cylinderNormal));
	vec3 atNormal = cross(cylinderNormal, rightNormal);
	vec3 posRelativeToCylinder = eyePos - cylinderPos;
	vec2 rayStart = vec2(dot(rightNormal, posRelativeToCylinder), dot(atNormal, posRelativeToCylinder));
	vec2 rayNormal = vec2(dot(rightNormal, eyeRay), dot(atNormal, eyeRay));

	float a = dot(rayNormal, rayNormal);
	float b = 2.0 * dot(rayNormal, rayStart);
	float c = dot(rayStart, rayStart) - (r2 * r2);

	float temp = (b * b) - (4.0 * a * c);
	if (temp < 0.0){
		return maxDistance;
	}

	//at^2 + bt + c = 0
	//d = sqrt(b^2 - 4ac)
	//t+-= (-b+-d)/2a
	float tempSqrt = sqrt(temp);
	float t1 = (-b + tempSqrt) / (2.0 * a);
	float t2 = (-b - tempSqrt) / (2.0 * a);

	//return min(t1, t2);
	//return vec4(t1, t2, 0.0, 1.0);

	float rateZChange = dot(cylinderNormal, eyeRay);
	float rateZStart = dot(cylinderNormal, eyePos - cylinderPos);
	float h1 = rateZStart + (rateZChange * t1);
	float h2 = rateZStart + (rateZChange * t2);
	if ((abs(h1) <= r1) && (abs(h2) <= r1)){
		return min(t1, t2);
	}

	if ((abs(h1) <= r1) && (r1 <= abs(h2))){
		float ratio = (r1 - abs(h1)) / (abs(h2) - abs(h1));
		return min(t1, mix(t1, t2, ratio));
	}

	if ((abs(h2) <= r1) && (r1 <= abs(h1))){
		float ratio = (r1 - abs(h2)) / (abs(h1) - abs(h2));
		return min(t2, mix(t2, t1, ratio));
	}

	return maxDistance;
}

void main() {
	if (v_keepOrDiscard <= 0.0) {
		discard;
	}

	vec2 diff = (gl_PointCoord - vec2(.5, .5)) * 2.0;
	if (1.0 < dot(diff, diff)) {
		discard;
//  	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//  #ifdef GL_EXT_frag_depth
//  	gl_FragDepthEXT = 0.0;
//  #endif
//  return;
	}

	vec3 screenEyeRay = texture2D(u_samplerCameraRay, v_uv + (v_uvScale * gl_PointCoord)).xyz;
	vec3 worldRay = makeWorldRay(screenEyeRay);

	float distance = rayCylinder(v_cylinder.xyz, v_sphere.xyz, v_cylinder.w, v_radius2, worldRay, u_cameraPos, u_cameraFar);

	if (u_cameraFar <= distance) {
		discard;
//  	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
//  #ifdef GL_EXT_frag_depth
//  	gl_FragDepthEXT = 0.0;
//  #endif
//  return;
	}

	gl_FragColor = v_colour;
#ifdef GL_EXT_frag_depth
	gl_FragDepthEXT = distance / u_cameraFar;
#endif
}
`;

const sVertexAttributeNameArray = [
	"a_sphere",
	"a_cylinder",
	"a_colour"
];
const sUniformNameMap = {
	"u_samplerCameraRay" : sInt,
	"u_viewportWidthHeight" : sFloat2,
	"u_cameraAt" : sFloat3, 
	"u_cameraUp" : sFloat3, 
	"u_cameraLeft" : sFloat3, 
	"u_cameraPos" : sFloat3, 
	"u_cameraFar" : sFloat,
	"u_fovhradian" : sFloat
};


export default function(in_resourceManager, in_webGLState, in_state, in_texture){
	const m_textureArray = [in_texture];
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		"LESS",
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true
	);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_model = ModelObjectIDFactory(in_webGLState);

	const m_state = Object.assign({
		"u_samplerCameraRay" : 0
	}, in_state);

	//public methods ==========================
	const result = Object.create({
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
			return;
		},
		"draw" : function(){
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			return;
		},
		"destroy" : function(){
			return;
		}
	});

	return result;

}
