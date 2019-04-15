//const Core = require("core");
import modelScreenQuadFactory from "./component-model-screen-quad.js"
import ShaderWrapperFactory from "./shaderwrapper.js";
import {sFloat3 as ShaderUniformDataFloat3, sFloat4 as ShaderUniformDataFloat4 } from "./shaderuniformdata.js";
import MaterialWrapperFactory from "./materialwrapper.js";

const sVertexShader = `
attribute vec2 a_position;
attribute vec4 a_uv;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec4 u_cameraFovhFovvFarClip;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
vec3 makeScreenEyeRay(vec2 in_polarCoords) {
	float polar_a_radian = atan(in_polarCoords.y, in_polarCoords.x);
	float polar_r_radian = length(in_polarCoords);

	float z = cos(polar_r_radian);
	float temp = sqrt(1.0 - (z * z));
	float x = temp * cos(polar_a_radian);
	float y = temp * sin(polar_a_radian);
	//return vec3(x, y, z);
	return vec3(polar_r_radian, polar_r_radian, polar_r_radian);
}

float planeTest(float maxDistance, vec3 rayPos, vec3 rayNormal, vec4 in_plane){
	float ln = dot(rayPos, in_plane.xyz);
	if (abs(ln) < 0.00001){ //plane not on edge to eye
		return maxDistance;
	}
	float t = (in_plane0.w - dot(eyePos, in_plane0.xyz)) / ln;

	return min(t, maxDistance);
}

void main() {
	vec2 screenRadian = vec2((v_uv.x - 0.5) * u_cameraFovhFovvFarClip.x, (v_uv.y - 0.5) * u_cameraFovhFovvFarClip.x * apsect);
	vec3 screenEyeRay = makeScreenEyeRay(screenRadian);

	gl_FragColor = vec4(screenEyeRay, 1.0);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_viewportWidthHeightWidthhalfHeighthalf" : ShaderUniformDataFloat4, 
	"u_cameraAt" : ShaderUniformDataFloat3, 
	"u_cameraUp" : ShaderUniformDataFloat3, 
	"u_cameraLeft" : ShaderUniformDataFloat3, 
	"u_cameraPos" : ShaderUniformDataFloat3, 
	"u_cameraFovhFovvFarClip" : ShaderUniformDataFloat4
};

export default function(in_resourceManager, in_webGLState, in_state){
	var m_modelComponent = modelScreenQuadFactory(in_resourceManager, in_webGLState);

	var m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	var m_material = MaterialWrapperFactory(
		undefined, //in_textureArrayOrUndefined,
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

	//public methods ==========================
	const that = Object.create({
		"draw" : function(){
			in_webGLState.applyShader(m_shader, in_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());
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
