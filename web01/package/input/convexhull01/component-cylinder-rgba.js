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

//https://www.gamedev.net/forums/topic/467789-raycylinder-intersection/
float rayCylinder(vec3 pos, vec3 normal, float r1, float r2, vec3 eyeRay, vec3 eyePos, float maxDistance){
	vec3 A = pos - (normal * r1);
	vec3 B = pos + (normal * r1);
	vec3 AB = (B - A);
	vec3 AO = (eyePos - A);
	vec3 AOxAB = cross(AO, AB);
	vec3 VxAB = cross(eyeRay, AB);
	float ab2 = dot(AB, AB);
	float a = dot(VxAB, VxAB);
	float b = 2.0 * dot(VxAB, AOxAB); // dot product
	float c = dot(AOxAB, AOxAB) - (r2 * r2 * ab2);

	float discr = b*b - 4.0*a*c;
	if (discr < 0.0)
	{
		return maxDistance;
	}

	float temp = sqrt(discr);
	float x1 = (-b + temp)/(2.0*a);
	float x2 = (-b - temp)/(2.0*a);
	float distance = min(x1, x2);
	if (distance < 0.0)
	{
		return maxDistance;
	}

	return distance;
}

void main() {
	if (v_keepOrDiscard <= 0.0) {
		discard;
	}

	vec2 diff = (gl_PointCoord - vec2(.5, .5)) * 2.0;
	if (1.0 < dot(diff, diff)) {
		discard;
// 	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// #ifdef GL_EXT_frag_depth
// 	gl_FragDepthEXT = 0.0;
// #endif
// return;
	}

	vec3 screenEyeRay = texture2D(u_samplerCameraRay, v_uv + (v_uvScale * gl_PointCoord)).xyz;
	vec3 worldRay = makeWorldRay(screenEyeRay);
	float distance = rayCylinder(v_sphere.xyz, v_cylinder.xyz, v_cylinder.w, v_radius2, worldRay, u_cameraPos, u_cameraFar);

	if (u_cameraFar <= distance) {
		discard;
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
