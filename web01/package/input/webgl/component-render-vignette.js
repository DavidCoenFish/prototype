/* 


*/

import { factoryFloat32 as Vector4FactoryFloat32 } from './../core/vector4.js';
import ComponentModelScreenQuadFactory from './component-model-screen-quad.js';
import MaterialWrapperFactory from './materialwrapper.js';
import ShaderWrapperFactory from './shaderwrapper.js';
import {sFloat4} from "./shaderuniformdata.js";

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

uniform vec4 u_colour;
uniform vec4 u_widthHeightRadius1Radius2;

float alphaFunction(vec2 in_uv, vec4 in_widthHeightRadius1Radius2){
	float radius1 = in_widthHeightRadius1Radius2.z * 2.0;
	float radius2 = in_widthHeightRadius1Radius2.w * 2.0;
	vec2 pixelPos = abs(((in_uv * 2.0) - 1.0) * in_widthHeightRadius1Radius2.xy);
	float fullRadius = radius1 + radius2;
	float orthRadius = fullRadius * 0.707107;
	pixelPos = max(vec2(0.0, 0.0), pixelPos - vec2(in_widthHeightRadius1Radius2.x - orthRadius, in_widthHeightRadius1Radius2.y - orthRadius));
	float alpha = (length(pixelPos) - radius1) / radius2;
	return alpha;
}

void main() {
	float alpha = alphaFunction(v_uv, u_widthHeightRadius1Radius2);
	gl_FragColor = vec4(u_colour.x, u_colour.y, u_colour.z, u_colour.w * alpha);
	//gl_FragColor = vec4(u_colour.w * alpha, u_colour.w * alpha, u_colour.w * alpha, 1.0);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_colour" : sFloat4, 
	"u_widthHeightRadius1Radius2" : sFloat4,
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


export default function(in_resourceManager, in_webGLState, in_colourRGBA, in_widthHeightRadius1Radius2){

	const m_modelComponent = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_material = MaterialWrapperFactory(
		undefined, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined, //"FRONT", "BACK", "FRONT_AND_BACK"
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA" //in_destinationBlendEnumNameOrUndefined
		);
	//const m_widthHeightRadius1Radius2 = Vector4FactoryFloat32(in_width, in_height, in_radius1, in_radius2);
	const m_state = {
		"u_colour" : in_colourRGBA.getRaw(),
		"u_widthHeightRadius1Radius2" : in_widthHeightRadius1Radius2.getRaw()
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
