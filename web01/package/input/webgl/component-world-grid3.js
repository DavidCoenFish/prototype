/*
like world grid2, expect input texture of the screen camera normal
 */
import modelScreenQuadFactory from "./component-model-screen-quad.js"
import ShaderWrapperFactory from "./shaderwrapper.js";
import {sInt, sFloat, sFloat2, sFloat3} from "./shaderuniformdata.js";
import MaterialWrapperFactory from "./materialwrapper.js";

const sVertexShader = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 1.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
#extension GL_EXT_frag_depth : enable
precision mediump float;

uniform sampler2D u_sampler;
uniform vec2 u_viewportWidthHeight;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform float u_cameraFar;
uniform float u_fovhradian;

varying vec2 v_uv;

vec3 makeWorldRay(vec3 in_screenEyeRay){
	return ((-(in_screenEyeRay.x) * u_cameraLeft) +
		(in_screenEyeRay.y * u_cameraUp) +
		(in_screenEyeRay.z * u_cameraAt));
}

//http://geomalgorithms.com/a07-_distance.html
vec2 findRayRayClosest(vec3 in_rayA, vec3 in_posA, vec3 in_rayB, vec3 in_posB){
	vec3 u = in_rayA;
	vec3 v = in_rayB;
	vec3 w = in_posA - in_posB;
	float a = dot(u, u);
	float b = dot(u, v);
	float c = dot(v, v);
	float ACminBB = (a * c) - (b * b);

	if (abs(ACminBB) < 0.0001){
		//parrallel, project forward 1unit
		float Td = dot((in_posA + in_rayA) - in_posB, in_rayB);
		return vec2(1.0, Td);
	}

	float d = dot(u, w);
	float e = dot(v, w);
	float Sc = ((b*e)-(c*d)) / ACminBB;
	float Tc = ((a*e)-(b*d)) / ACminBB;
	return vec2(Sc, Tc);
}

float planeTest(float maxDistance, vec3 rayPos, vec3 rayNormal, vec4 in_plane){
	float ln = dot(rayPos, in_plane.xyz);
	if (abs(ln) < 0.00001){ //plane not on edge to eye
		return maxDistance;
	}
	float t = (in_plane.w - dot(rayPos, in_plane.xyz)) / ln;
	return min(t, maxDistance);
}

float getPixelSizeAtCameraDistance(float in_distance){
	float angleRadians = u_fovhradian / u_viewportWidthHeight.x;
	//sin(a) = ops/hyp
	float pixelSize = in_distance * sin(angleRadians);
	return pixelSize * 0.75;
}

vec2 AlphaFromAxisLine(vec3 in_axisNormal, vec3 in_ray, vec3 in_pos, float in_maxDistance) {
	vec2 ScTc = findRayRayClosest(in_ray, in_pos, in_axisNormal, vec3(0.0, 0.0, 0.0));
	if (in_maxDistance < ScTc.x){
		return vec2(0.0, 0.0);
	}
	if (ScTc.x < 0.0){
		return vec2(0.0, 0.0);
	}
	float pixelDistance = getPixelSizeAtCameraDistance(ScTc.x);
	float temp = pixelDistance * pixelDistance;
	vec3 offset = (in_pos + (in_ray * ScTc.x)) - (in_axisNormal * ScTc.y);
	float distanceSquared = dot(offset, offset);
	if (distanceSquared < temp){
		float alpha = (1.0 - (distanceSquared / temp)) * 0.5; // (1.0 - (ScTc.x / in_maxDistance));
		float oneMinusDistance = 1.0 - (ScTc.x / in_maxDistance);
		return vec2(alpha, oneMinusDistance);
	}
	return vec2(0.0, 0.0);
}

vec2 AlphaFromPlane(vec4 in_plane, vec3 in_crossA, vec3 in_crossB, vec3 in_ray, vec3 in_pos, float in_maxDistance) {
	float ln = dot(in_ray, in_plane.xyz);
	if (abs(ln) < 0.0001){ //plane not on edge to eye
		return vec2(0.0, 0.0);
	}
	float t = (in_plane.w - dot(in_pos, in_plane.xyz)) / ln;

	if (t < 0.0){
		return vec2(0.0, 0.0);
	}
	if ((in_maxDistance / 3.0) < t){
		return vec2(0.0, 0.0);
	}

	float pixelDistance = getPixelSizeAtCameraDistance(t) * 2.0;
	float temp = pixelDistance;// * pixelDistance;

	vec3 testPos = in_pos + (in_ray * t);

	float a = abs(mod(abs(dot(in_crossA, testPos) + 1.0), 2.0) - 1.0);
	float b = abs(mod(abs(dot(in_crossB, testPos) + 1.0), 2.0) - 1.0);

	float c = min(a,b);

	float distanceSquared = c;// * c;
	if (distanceSquared < temp){
		float alpha = (1.0 - (distanceSquared / temp)) * 0.25 * (1.0 - (t * 3.0 / in_maxDistance));
		float oneMinusDistance = 1.0 - (t / in_maxDistance);
		return vec2(alpha, oneMinusDistance);
	}
	return vec2(0.0, 0.0);
}

void main() {
	vec3 screenEyeRay = texture2D(u_sampler, v_uv).xyz;
	vec3 worldRay = makeWorldRay(screenEyeRay);
	float maxDistance = u_cameraFar;

	//kind of need alpha from grid, alpha from axis
	vec2 data = vec2(0.0, 0.0);
	data = max(data, AlphaFromAxisLine(vec3(1.0, 0.0, 0.0), worldRay, u_cameraPos, maxDistance));
	data = max(data, AlphaFromAxisLine(vec3(0.0, 1.0, 0.0), worldRay, u_cameraPos, maxDistance));
	data = max(data, AlphaFromAxisLine(vec3(0.0, 0.0, 1.0), worldRay, u_cameraPos, maxDistance));
	data = max(data, AlphaFromPlane(vec4(0.0, 0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), worldRay, u_cameraPos, maxDistance));

	if (data.x <= 0.0){
		discard;
	}

	gl_FragColor = vec4(0.0, 0.0, 0.0, data.x);
#ifdef GL_EXT_frag_depth
	gl_FragDepthEXT = 1.0 - data.y;
#endif
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_sampler" : sInt,
	"u_viewportWidthHeight" : sFloat2,
	"u_cameraAt" : sFloat3, 
	"u_cameraUp" : sFloat3, 
	"u_cameraLeft" : sFloat3, 
	"u_cameraPos" : sFloat3,
	"u_cameraFar" : sFloat,
	"u_fovhradian" : sFloat
};

export default function(in_resourceManager, in_webGLState, in_state, in_texture){
	var m_modelComponent = modelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_texture];

	var m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	var m_material = MaterialWrapperFactory(
		m_textureArray, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined,
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //"ONE",  //in_destinationBlendEnumNameOrUndefined,
		true, //in_depthFuncEnabledOrUndefined,
		"LESS", //in_depthFuncEnumNameOrUndefined
		undefined, //in_frontFaceEnumNameOrUndefined, //"CW", "CCW"
		true, //in_colorMaskRedOrUndefined, //true
		true, //in_colorMaskGreenOrUndefined, //true
		true, //in_colorMaskBlueOrUndefined, //true
		true, //in_colorMaskAlphaOrUndefined, //false
		false, //in_depthMaskOrUndefined, //false
		false //in_stencilMaskOrUndefined //false
	);

	const m_state = {
		"u_sampler0" : 0
	};

	//public methods ==========================
	const that = Object.create({
		"draw" : function(){
			var state = Object.assign({}, m_state, in_state);
			in_webGLState.applyShader(m_shader, state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());
			return;
		},
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
			return;
		},
		"destroy" : function(){
			m_modelComponent.destroy();
			m_modelComponent = undefined;
			m_shader.destroy();
			m_shader = undefined;
			m_material = undefined;
			return;
		}
	})

	return that;
}
