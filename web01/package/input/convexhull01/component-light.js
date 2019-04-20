/*
input [camera ray texture, rgba<rgb, a{0...0.5 emitance, 0.5...1 reflectivity], depth] 
output [rgb buffer]

todo: take a normal texture rather than a depth texture?

 */

import ComponentModelScreenQuadFactory from './../webgl/component-model-screen-quad.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat2} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";

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
precision mediump float;

uniform sampler2D u_samplerDeferedRGBA;

varying vec2 v_uv;

float getEmittance(float in_value){
	float mul = 1.0 - step(0.5, in_value);
	return (mul * (2.0 * abs(in_value)));
}

void main() {
	vec4 deferedRGBA = texture2D(u_samplerDeferedRGBA, v_uv);

	float ambient = 255.0/255.0;
	vec3 colour = deferedRGBA.xyz * (ambient + getEmittance(deferedRGBA.w));

	gl_FragColor = vec4(colour, 1.0);
	//gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const sVertexAttributeNameArray = [
	"a_position",
	"a_uv",
];
const sUniformNameMap = {
	"u_samplerCameraRay" : sInt,
	"u_samplerDeferedRGBA" : sInt,
	"u_samplerDepth" : sInt
};


export default function(in_resourceManager, in_webGLState, in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth){
	var m_componentModel = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth];
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		true,
		"ONE",
		"ONE",
		undefined,
		undefined,
		undefined,
		true,
		true,
		true,
		false
		);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);

	var m_state = {
		"u_samplerCameraRay" : 0,
		"u_samplerDeferedRGBA" : 1,
		"u_samplerDepth" : 2,
	};

	//public methods ==========================
	const result = Object.create({
		"draw" : function(){
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_componentModel.getModel());
			return;
		},
		"setTexture" : function(in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth){
			m_textureArray[0] = in_textureCameraRay;
			m_textureArray[1] = in_textureDeferedRGBA;
			m_textureArray[2] = in_textureDepth;
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
