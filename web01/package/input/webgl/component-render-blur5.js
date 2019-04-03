/* 
	render over the current render target
*/

import {factoryByteRGBA as TextureWrapperFactoryByteRGBA } from './../webgl/texturewrapper.js';
import ComponentModelScreenQuadFactory from './component-model-screen-quad.js';
import MaterialWrapperFactory from "./materialwrapper.js";
import { sInt, sFloat4 } from './shaderuniformdata.js';
import ShaderWrapperFactory from "./shaderwrapper.js";
import RenderTargetWrapperFactory from './../webgl/rendertargetwrapper.js';
import RenderTargetDataFactory from './../webgl/rendertargetdata.js';
import { factoryFloat32 as Vector4FactoryFloat32 } from './../core/vector4.js';

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
uniform sampler2D u_sampler;
uniform vec4 u_viewport;
void main() {
	//1 4 6
	//4 16 24
	//6 24 36
	vec4 colour = vec4(0.0, 0.0, 0.0, 0.0);
	vec2 duv = vec2(1.0 / u_viewport.z, 1.0 / u_viewport.w);
	colour += (1.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-2.0, -2.0) * duv));
	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-1.0, -2.0) * duv));
	colour += (6.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 0.0, -2.0) * duv));
	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 1.0, -2.0) * duv));
	colour += (1.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 2.0, -2.0) * duv));

	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-2.0, -1.0) * duv));
	colour += (16.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-1.0, -1.0) * duv));
	colour += (24.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 0.0, -1.0) * duv));
	colour += (16.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 1.0, -1.0) * duv));
	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 2.0, -1.0) * duv));

	colour += (6.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-2.0,  0.0) * duv));
	colour += (24.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-1.0,  0.0) * duv));
	colour += (36.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 0.0,  0.0) * duv));
	colour += (24.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 1.0,  0.0) * duv));
	colour += (6.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 2.0,  0.0) * duv));

	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-2.0,  1.0) * duv));
	colour += (16.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-1.0,  1.0) * duv));
	colour += (24.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 0.0,  1.0) * duv));
	colour += (16.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 1.0,  1.0) * duv));
	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 2.0,  1.0) * duv));

	colour += (1.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-2.0,  2.0) * duv));
	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2(-1.0,  2.0) * duv));
	colour += (6.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 0.0,  2.0) * duv));
	colour += (4.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 1.0,  2.0) * duv));
	colour += (1.0 / 256.0) * texture2D(u_sampler, v_uv + (vec2( 2.0,  2.0) * duv));

	gl_FragColor = colour;
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_sampler" : sInt,
	"u_viewport" : sFloat4
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}
const sShaderName = "componentRenderFadeShader";

export default function(in_resourceManager, in_webGLState, in_texture, in_width, in_height){
	const m_modelComponent = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_textureArray = [in_texture];
	const m_material = MaterialWrapperFactory(m_textureArray);
	m_material.setColorMaskAlpha(true);
	const m_viewport = Vector4FactoryFloat32(0, 0, in_width, in_height);
	const m_state = {
		"u_sampler" : 0,
		"u_viewport" : m_viewport.getRaw()
	};

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);

	const m_textureOutput = TextureWrapperFactoryByteRGBA(in_webGLState, in_width, in_height);
	const m_renderTargetWrapper = RenderTargetWrapperFactory(
		in_webGLState, 
		in_width, 
		in_height,
		[RenderTargetDataFactory(m_textureOutput, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D")]
		);

	//public methods ==========================
	const that = Object.create({
		"setMask" : function(in_drawRed, in_drawBlue, in_drawGreen, in_drawAlpha){
			m_material.setColorMaskRed(in_drawRed);
			m_material.setColorMaskRed(in_drawBlue);
			m_material.setColorMaskRed(in_drawGreen);
			m_material.setColorMaskRed(in_drawAlpha);
			return;
		},
		"setInputTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
			return;
		},
		"getOutputTexture" : function(){
			return m_textureOutput;
		},
		"draw" : function(){
			in_webGLState.applyRenderTarget(m_renderTargetWrapper);

			in_webGLState.getViewport(m_viewport);
			
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);
			return;
		},
		"destroy" : function(){
			m_shader = undefined;
			in_resourceManager.releaseCommonReference(sShaderName);
			m_model = undefined;
			m_modelComponent.destroy();
			m_modelComponent = undefined;
			return;
		}
	})

	return that;
}
