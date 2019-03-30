/* 
	render over the current render target
*/

import { factoryFloat32 as Vector2FactoryFloat32 } from './../core/vector2.js';
import { factoryFloat32 as Vector3FactoryFloat32 } from './../core/vector3.js';
import ComponentModelScreenQuadFactory from './component-model-screen-quad.js"';
import MaterialWrapperFactory from './materialwrapper.js';
import ShaderWrapperFactory from './shaderwrapper.js';
import {sFloat3 as ShaderUniformDataFloat3, sFloat2 as ShaderUniformDataFloat2 } from "./shaderuniformdata.js";

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;

uniform vec3 u_colour;
uniform vec2 u_widthHeightPercentage;

//http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float distanceFunction(vec2 in_uv, vec2 in_widthHeightPercentage){
	float r = in_widthHeightPercentage.x * 2.0;
	vec2 p = vec2((in_uv.x - 0.5) * 2.0, (in_uv.y - 0.5) * 2.0);
	vec2 b = vec2(1.0 - r, 1.0 - r);
	vec2 d = abs(p) - b;
	return max(0.0, length(max(d,0.0)));
}

float alphaFunction(vec2 in_uv, vec2 in_widthHeightPercentage){
	float d = (distanceFunction(in_uv, in_widthHeightPercentage)) / (in_widthHeightPercentage.x * 2.0);
	float temp = d * 0.70710678118654752440084436210485;
	float alpha = (temp * temp);
	//float alpha = temp;
	return alpha;
}

void main() {
	float alpha = alphaFunction(v_uv, u_widthHeightPercentage);
	gl_FragColor = vec4(u_colour.x, u_colour.y, u_colour.z, alpha);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_colour" : ShaderUniformDataFloat3, 
	"u_widthHeightPercentage" : ShaderUniformDataFloat2,
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}
const sShaderName = "componentRenderVignetteShader";


export default function(in_resourceManager, in_webGLState, in_colourRGB, in_widthPercentage, in_heightPercentage){

	const m_modelComponent = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_material = MaterialWrapperFactory(
		undefined, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined, //"FRONT", "BACK", "FRONT_AND_BACK"
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //in_destinationBlendEnumNameOrUndefined,
		//in_depthFuncEnabledOrUndefined,
		//in_depthFuncEnumNameOrUndefined, 
		//in_frontFaceEnumNameOrUndefined, //"CW", "CCW"
		//in_colorMaskRedOrUndefined, //true
		//in_colorMaskGreenOrUndefined, //true
		//in_colorMaskBlueOrUndefined, //true
		//in_colorMaskAlphaOrUndefined, //false
		//in_depthMaskOrUndefined, //false
		//in_stencilMaskOrUndefined //false
		);
	const m_widthHeightPercentage = Vector2FactoryFloat32(in_widthPercentage, in_heightPercentage);
	const m_colour = Vector3FactoryFloat32(in_colourRGB.getRed(), in_colourRGB.getGreen(), in_colourRGB.getBlue());
	const m_state = {
		"u_colour" : m_colour.getRaw(),
		"u_widthHeightPercentage" : m_widthHeightPercentage.getRaw()
	};

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);

	//public methods ==========================
	const that = Object.create({
		"draw" : function(){
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);
		},
		"destroy" : function(){
			m_shader = undefined;
			in_resourceManager.releaseCommonReference(sShaderName);
			m_model = undefined;
			m_modelComponent.destroy();
			m_modelComponent = undefined;
		}
	})

	return that;
}
