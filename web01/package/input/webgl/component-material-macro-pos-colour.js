/**
 * component-material-macro-pos-colour.js
 *  marco lens camera
 *  use pos vertex attribute
 *  use colour vertex attribute
 */

import ShaderWrapperFactory from "./shaderwrapper.js";
import {sFloat3 as ShaderUniformDataFloat3, sFloat4 as ShaderUniformDataFloat4 } from "./shaderuniformdata.js";
import MaterialWrapperFactory from "./materialwrapper.js";

const sVertexShader = `
attribute vec3 a_position;
attribute vec4 a_colour;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec3 u_cameraFovhFovvFar;

varying vec4 v_colour;
varying float v_keepOrDiscard;

void main() {
	vec3 cameraToAtom = a_position - u_cameraPos;

	float cameraSpaceX = -dot(cameraToAtom, u_cameraLeft);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	v_keepOrDiscard = cameraSpaceZ;
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = degrees(acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0)));

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float fovHHalf = u_cameraFovhFovvFar.x * 0.5;
	float width = u_viewportWidthHeightWidthhalfHeighthalf.x;
	float height = u_viewportWidthHeightWidthhalfHeighthalf.y;
	float widthHalf = u_viewportWidthHeightWidthhalfHeighthalf.z;
	float heightHalf = u_viewportWidthHeightWidthhalfHeighthalf.w;
	float screenR = polarR / fovHHalf; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = cameraSpaceLength / u_cameraFovhFovvFar.z;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	v_colour = a_colour;
}
`;

const sFragmentShader = `
precision mediump float;
varying vec4 v_colour;
varying float v_keepOrDiscard;
void main() {
	if (v_keepOrDiscard <= 0.0){
		discard;
	}
	gl_FragColor = v_colour;
}
`;

const sVertexAttributeNameArray = ["a_position", "a_colour"];
const sUniformNameMap = {
	"u_viewportWidthHeightWidthhalfHeighthalf" : ShaderUniformDataFloat4, 
	"u_cameraAt" : ShaderUniformDataFloat3, 
	"u_cameraUp" : ShaderUniformDataFloat3, 
	"u_cameraLeft" : ShaderUniformDataFloat3, 
	"u_cameraPos" : ShaderUniformDataFloat3, 
	"u_cameraFovhFovvFar" : ShaderUniformDataFloat3
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);

}

const materialFactory = function(){
	const material = MaterialWrapperFactory(
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
	return material;
}

const sShaderName = "componentShaderMacroPosColourLine";
const sMaterialName = "componentMaterialMacroPosColourLine";

export default function(in_resourceManager, in_webGLState){
	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}

	if (false === in_resourceManager.hasFactory(sMaterialName)){
		in_resourceManager.addFactory(sMaterialName, materialFactory);
	}

	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);
	var m_material = in_resourceManager.getCommonReference(sMaterialName);

	//public methods ==========================
	const result = Object.create({
		"getShader" : function(){
			return m_shader;
		},
		"getMaterial" : function(){
			return m_material;
		},
		"destroy" : function(){
			m_shader = undefined;
			m_material = undefined;
			in_resourceManager.releaseCommonReference(sShaderName);
			in_resourceManager.releaseCommonReference(sMaterialName);
		}
	})

	return result;

}
