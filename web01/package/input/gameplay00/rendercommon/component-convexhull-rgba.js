import ShaderWrapperFactory from "./../../webgl/shaderwrapper.js";
import {sInt, sMat4} from "./../../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../../webgl/materialwrapper.js";

const sVertexShader = `
precision mediump float;

attribute vec4 a_sphere;
attribute vec4 a_plane0;
attribute vec4 a_plane1;
attribute vec4 a_plane2;
attribute vec4 a_plane3;
attribute vec4 a_plane4;
attribute vec4 a_plane5;
attribute vec4 a_plane6;
attribute vec4 a_plane7;
attribute vec4 a_colour0;
attribute vec4 a_colour1;

uniform mat4 u_camera;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_plane0;
varying vec4 v_plane1;
varying vec4 v_plane2;
varying vec4 v_plane3;
varying vec4 v_plane4;
varying vec4 v_plane5;
varying vec4 v_plane6;
varying vec4 v_plane7;
varying vec4 v_colour0;
varying vec4 v_colour1;

void main() {
	vec4 u_cameraAtFovhradian = u_camera[0];
	vec3 u_cameraAt = u_cameraAtFovhradian.xyz;
	float u_fovhradian = u_cameraAtFovhradian.w;
	vec4 u_cameraLeftViewportWidth = u_camera[1];
	vec3 u_cameraLeft = u_cameraLeftViewportWidth.xyz;
	vec4 u_cameraUpViewportHeight = u_camera[2];
	vec3 u_cameraUp = u_cameraUpViewportHeight.xyz;
	vec2 u_viewportWidthHeight = vec2(u_cameraLeftViewportWidth.w, u_cameraUpViewportHeight.w);
	vec4 u_cameraPosCameraFar = u_camera[3];
	vec3 u_cameraPos = u_cameraPosCameraFar.xyz;
	float u_cameraFar = u_cameraPosCameraFar.w;

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
	//float pixelDiameterB = (screenR * width) * tan(sphereRadiusAngleRadians);
	pixelDiameter += max(0.0, ((1.0 * screenR * width) * tan(sphereRadiusAngleRadians)));

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pixelDiameter;

	v_uvScale = vec2(pixelDiameter / width, -pixelDiameter / width * apsectCorrection);
	v_uv = vec2((screenX / 2.0) + 0.5, (screenY / 2.0) + 0.5) - (v_uvScale * 0.5);

	v_sphere = a_sphere;
	v_plane0 = a_plane0;
	v_plane1 = a_plane1;
	v_plane2 = a_plane2;
	v_plane3 = a_plane3;
	v_plane4 = a_plane4;
	v_plane5 = a_plane5;
	v_plane6 = a_plane6;
	v_plane7 = a_plane7;

	v_colour0 = a_colour0;
	v_colour1 = a_colour1;
}
`;

const sFragmentShader = `
#extension GL_EXT_frag_depth : enable
precision mediump float;

uniform sampler2D u_sampler0;

uniform mat4 u_camera;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_plane0;
varying vec4 v_plane1;
varying vec4 v_plane2;
varying vec4 v_plane3;
varying vec4 v_plane4;
varying vec4 v_plane5;
varying vec4 v_plane6;
varying vec4 v_plane7;
varying vec4 v_colour0;
varying vec4 v_colour1;

vec3 makeWorldRay(vec3 in_screenEyeRay, vec3 u_cameraLeft, vec3 u_cameraUp, vec3 u_cameraAt){
	return ((-(in_screenEyeRay.x) * u_cameraLeft) +
		(in_screenEyeRay.y * u_cameraUp) +
		(in_screenEyeRay.z * u_cameraAt));
}

//intersect eye ray with plane0, check point inside all other planes
float planeTest(float distanceFromFarClip, float farClip, vec3 eyePos, vec3 eyeRay, vec4 in_plane0, vec4 in_plane1, vec4 in_plane2, vec4 in_plane3, vec4 in_plane4, vec4 in_plane5, vec4 in_plane6, vec4 in_plane7){
	float ln = dot(eyeRay, in_plane0.xyz);
	//if (abs(ln) < 0.0001){ //plane not on edge to eye
	if (0.0001 < ln){ //front face only
		return distanceFromFarClip;
	}
	float t = (in_plane0.w - dot(eyePos, in_plane0.xyz)) / ln;

	if (t < 0.0){
		return distanceFromFarClip;
	}
	if (farClip < t){
		return distanceFromFarClip;
	}
	vec3 testPos = eyePos + (eyeRay * t);

	float inside = 1.0;
	inside *= step(dot(testPos, in_plane1.xyz), in_plane1.w);
	inside *= step(dot(testPos, in_plane2.xyz), in_plane2.w);
	inside *= step(dot(testPos, in_plane3.xyz), in_plane3.w);
	inside *= step(dot(testPos, in_plane4.xyz), in_plane4.w);
	inside *= step(dot(testPos, in_plane5.xyz), in_plane5.w);
	inside *= step(dot(testPos, in_plane6.xyz), in_plane6.w);
	inside *= step(dot(testPos, in_plane7.xyz), in_plane7.w);
	float testDistanceFromFarClip = farClip - t;

	return mix(distanceFromFarClip, testDistanceFromFarClip, inside);
}

void main() {
	vec4 u_cameraAtFovhradian = u_camera[0];
	vec4 u_cameraLeftViewportWidth = u_camera[1];
	vec4 u_cameraUpViewportHeight = u_camera[2];
	vec4 u_cameraPosCameraFar = u_camera[3];
	float u_cameraFar = u_cameraPosCameraFar.w;

	if (v_keepOrDiscard <= 0.0) {
		discard;
	}

	vec2 diff = (gl_PointCoord - vec2(.5, .5)) * 2.0;
	if (1.0 < dot(diff, diff)) {
		discard;
	}

	vec3 screenEyeRay = texture2D(u_sampler0, v_uv + (v_uvScale * gl_PointCoord)).xyz;
	vec3 worldRay = makeWorldRay(screenEyeRay, u_cameraLeftViewportWidth.xyz, u_cameraUpViewportHeight.xyz, u_cameraAtFovhradian.xyz);

	float distanceFromFarClip = 0.0;

	vec3 eyePos = u_cameraPosCameraFar.xyz - v_sphere.xyz;

	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane1, v_plane0, v_plane2, v_plane3, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane2, v_plane0, v_plane1, v_plane3, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane3, v_plane0, v_plane1, v_plane2, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane4, v_plane0, v_plane1, v_plane2, v_plane3, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane5, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane6, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane5, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, u_cameraFar, eyePos, worldRay, v_plane7, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane5, v_plane6);

	if (distanceFromFarClip == 0.0){
		discard;
	}

	float distance = u_cameraFar - distanceFromFarClip;
	vec3 worldPos = u_cameraPosCameraFar.xyz + (worldRay * distance);
	float colourDistance = length(worldPos - v_sphere.xyz);

	gl_FragColor = mix(v_colour1, v_colour0, colourDistance / v_sphere.w);
#ifdef GL_EXT_frag_depth
	gl_FragDepthEXT = distance / u_cameraFar;
#endif
}
`;

const sVertexAttributeNameArray = [
	"a_sphere",
	"a_plane0",
	"a_plane1",
	"a_plane2",
	"a_plane3",
	"a_plane4",
	"a_plane5",
	"a_plane6",
	"a_plane7",
	"a_colour0",
	"a_colour1",
];
const sUniformNameMap = {
	"u_samplerCameraRay" : sInt,
	"u_camera" : sMat4,
};


export default function(in_resourceManager, in_webGLState, in_state, in_texture, in_modelFactory){
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
	const m_model = in_modelFactory(in_webGLState);

	const m_state = Object.assign({
		"u_samplerCameraRay" : 0
	}, in_state);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_texture){
			m_textureArray[0] = in_texture;
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			return;
		},
		"destroy" : function(){
			m_shader.destroy();
			m_model.destroy();
			return;
		}
	});

	return result;

}
