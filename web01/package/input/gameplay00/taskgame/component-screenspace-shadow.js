/*
input [depth] 
output [rgb buffer]
 */

import ComponentModelScreenQuadFactory from './../../webgl/component-model-screen-quad.js';
import ShaderWrapperFactory from "./../../webgl/shaderwrapper.js";
import {sInt, sFloat2} from "./../../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../../webgl/materialwrapper.js";
import {factoryFloat32 as Vector2Float32Factory} from "./../../core/vector2.js";

const sVertexShader = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision highp float;

uniform sampler2D u_samplerDepth;
uniform vec2 u_dxDy;

varying vec2 v_uv;

float makeAlpha(float in_depth, float in_threashold){
	float temp0 = abs(1.0 - (in_depth / in_threashold));
	return 1.0 - temp0;
}

float shade(float in_referenceDepth, vec2 in_offsetA, vec2 in_offsetB, vec2 in_offsetC){
	float depthA = max(0.0, in_referenceDepth - texture2D(u_samplerDepth, v_uv + (in_offsetA * u_dxDy)).x);
	float depthB = max(0.0, in_referenceDepth - texture2D(u_samplerDepth, v_uv + (in_offsetB * u_dxDy)).x);
	float depthC = max(0.0, in_referenceDepth - texture2D(u_samplerDepth, v_uv + (in_offsetC * u_dxDy)).x);

	float threashold = 0.005;

	float alphaA = makeAlpha(depthA, threashold) * 0.25;
	float alphaB = makeAlpha((depthB + depthC) * 0.5, threashold) * 0.075;
	float alpha = max(alphaA, alphaB);

	return alpha;
}

void main() {
	float referenceDepth = texture2D(u_samplerDepth, v_uv).x;

	float alpha = 0.0;
	alpha += shade(referenceDepth, vec2( 0.5,  1.5), vec2( 0.5,  3.5), vec2( 2.5,  1.5));
	alpha += shade(referenceDepth, vec2(-1.5,  0.5), vec2(-3.5,  0.5), vec2(-1.5,  2.5));
	alpha += shade(referenceDepth, vec2(-0.5, -1.5), vec2(-0.5, -3.5), vec2(-2.5, -1.5));
	alpha += shade(referenceDepth, vec2( 1.5, -0.5), vec2( 3.5, -0.5), vec2( 1.5, -2.5));

	alpha = max(0.0, alpha);

	gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
`;

const sVertexAttributeNameArray = [
	"a_position",
	"a_uv",
];
const sUniformNameMap = {
	"u_samplerDepth" : sInt,
	"u_dxDy" : sFloat2
};


export default function(in_resourceManager, in_webGLState, in_width, in_height, in_textureDepth){
	var m_componentModel = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_textureDepth];
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		true,
		"SRC_ALPHA",
		"ONE_MINUS_SRC_ALPHA",
		undefined,
		undefined,
		undefined,
		true,
		true,
		true,
		false
		);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);

	var m_dxDy = Vector2Float32Factory(1.0 / in_width, 1.0 / in_height);
	var m_state = {
		"u_samplerDepth" : 0,
		"u_dxDy" : m_dxDy.getRaw()
	};

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight, in_textureDepth){
			m_textureArray[0] = in_textureDepth;
			m_dxDy.setX(1.0 / in_newWidth);
			m_dxDy.setY(1.0 / in_newHeight);
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_componentModel.getModel());
			return;
		},
		"destroy" : function(){
			if (undefined !== m_componentModel){
				m_componentModel.destroy();
				m_componentModel = undefined;
			}
			return;
		}
	});

	return result;

}
