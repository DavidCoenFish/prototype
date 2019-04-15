/* */
import {factoryByteRGBA as TextureWrapperFactoryByteRGBA } from './../webgl/texturewrapper.js';
import ComponentModelFactory from './../webgl/component-model-screen-quad.js';
import ComponentBlurFactory from './../webgl/component-render-blur5.js';
import MaterialWrapperFactory from './../webgl/materialwrapper.js';
import RenderTargetWrapperFactory from './../webgl/rendertargetwrapper.js';
import RenderTargetDataFactory from './../webgl/rendertargetdata.js';
import ShaderWrapperFactory from './../webgl/shaderwrapper.js';
import {sInt } from './../webgl/shaderuniformdata.js';

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
uniform sampler2D u_samplerSource;
uniform sampler2D u_samplerBlur;

void main() {
	vec4 texelSource = texture2D(u_samplerSource, v_uv);
	vec4 texelBlur = texture2D(u_samplerBlur, v_uv);

	float value = texelSource.x - (0.5 * (texelBlur.w - texelSource.w));

	gl_FragColor = vec4(value, value, value, 1.0);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv"
];
const sUniformNameMap = {
	"u_samplerSource" : sInt,
	"u_samplerBlur" : sInt
};


export default function (in_resourceManager, in_webGLState, in_width, in_height) {
	const m_modelComponent = ComponentModelFactory(in_resourceManager, in_webGLState);
	const m_blurComponent = ComponentBlurFactory(in_resourceManager, in_webGLState, undefined, in_width, in_height);

	const m_materialTextureArray = []

	const m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	const m_material = MaterialWrapperFactory(m_materialTextureArray);
	m_material.setColorMaskAlpha(true);

	const m_renderTargetWrapper = RenderTargetWrapperFactory(
			in_webGLState, 
			in_width, 
			in_height,
			[RenderTargetDataFactory(TextureWrapperFactoryByteRGBA(in_webGLState, in_width, in_height), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D")]
			);

	const m_shaderUniforms = {
		"u_samplerSource" : 0,
		"u_samplerBlur" : 1
	};
	const that = Object.create({
		"run" : function(in_state){
			m_blurComponent.setInputTexture(in_state["texture"]);
			m_blurComponent.draw();

			m_materialTextureArray[0] = in_state["texture"];
			m_materialTextureArray[1] = m_blurComponent.getOutputTexture();

			in_webGLState.applyRenderTarget(m_renderTargetWrapper);

			in_webGLState.applyShader(m_shader, m_shaderUniforms);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());

			in_state["texture"] = m_renderTargetWrapper.getTexture(0);
			return in_state;
		},
		"destroy" : function(){
			releaseModel();
			return;
		}
	});

	return that;
}