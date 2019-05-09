/*
input [depth] 
output [rgb buffer]
 */

import ComponentModelScreenQuadFactory from './../webgl/component-model-screen-quad.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sMat4} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import {factoryFloat32 as Vector2Float32Factory} from "./../core/vector2.js";
import { sMat4 } from '../../webgl/shaderuniformdata.js';

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

uniform sampler2D u_samplerColour;
uniform sampler2D u_samplerDepth;
uniform mat4 u_camera;
uniform vec3 u_fogTint;

varying vec2 v_uv;

void main() {
	float depth = texture2D(u_samplerDepth, v_uv).x;
	if (1.0 <= depth){
		discard;
	}
	vec3 colour = texture2D(u_samplerColour, v_uv).xyz;

	gl_FragColor = vec4(colour, alpha);
}
`;

const sVertexAttributeNameArray = [
	"a_position",
	"a_uv",
];
const sUniformNameMap = {
	"u_samplerColour" : sInt,
	"u_samplerDepth" : sInt,
	"u_camera" : sMat4,
	"u_fogTint" : sFloat3
};

export default function(in_resourceManager, in_webGLState, in_state, in_textureColour, in_textureDepth, in_fogTint){
	var m_componentModel = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_textureColour, in_textureDepth];
	const m_material = MaterialWrapperFactory(
		m_textureArray
		);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);

	const m_state = Object.assign({
		"u_samplerColour" : 0,
		"u_samplerDepth" : 1,
		"u_fogTint" : in_fogTint
	}, in_state);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_textureColour, in_textureDepth){
			m_textureArray[0] = in_textureColour;
			m_textureArray[1] = in_textureDepth;
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_componentModel.getModel());
			return;
		},
		"destroy" : function(){
			m_componentModel.destroy();
			m_shader.destroy();
			return;
		}
	});

	return result;

}
