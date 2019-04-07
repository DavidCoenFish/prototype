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
uniform sampler2D u_samplerBlur0;
uniform sampler2D u_samplerBlur1;
uniform sampler2D u_samplerBlur2;
uniform sampler2D u_samplerBlur3;
uniform sampler2D u_samplerBlur4;

void main() {
	vec4 texelSource = texture2D(u_samplerSource, v_uv);
	vec4 texelBlur0 = texture2D(u_samplerBlur0, v_uv);
	vec4 texelBlur1 = texture2D(u_samplerBlur1, v_uv);
	vec4 texelBlur2 = texture2D(u_samplerBlur2, v_uv);
	vec4 texelBlur3 = texture2D(u_samplerBlur3, v_uv);
	vec4 texelBlur4 = texture2D(u_samplerBlur4, v_uv);

	float dropShadow = (1.0 - texelBlur0.w) * (1.0 - texelBlur1.w) * (1.0 - texelBlur2.w) * (1.0 - texelBlur3.w) * (1.0 - texelBlur4.w);

	gl_FragColor.xyz = texelSource.xyz - (vec3(dropShadow, dropShadow, dropShadow) * (1.0 - texelSource.w));
	gl_FragColor.w = texelSource.w;

	//float value = texelSource.x - (0.5 * max(0.0, (texelBlur4.w - texelSource.w)));
	float value = texelSource.x - (0.5 * (texelBlur4.w - texelSource.w));

	gl_FragColor = vec4(value, value, value, 1.0);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv"
];
const sUniformNameMap = {
	"u_samplerSource" : sInt,
	"u_samplerBlur0" : sInt,
	"u_samplerBlur1" : sInt,
	"u_samplerBlur2" : sInt,
	"u_samplerBlur3" : sInt,
	"u_samplerBlur4" : sInt,
};


export default function (in_resourceManager, in_webGLState, in_width, in_height) {
	const m_modelComponent = ComponentModelFactory(in_resourceManager, in_webGLState);
	const m_blurComponent0 = ComponentBlurFactory(in_resourceManager, in_webGLState, undefined, in_width, in_height);
	const m_blurComponent1 = ComponentBlurFactory(in_resourceManager, in_webGLState, m_blurComponent0.getOutputTexture(), in_width, in_height);
	const m_blurComponent2 = ComponentBlurFactory(in_resourceManager, in_webGLState, m_blurComponent1.getOutputTexture(), in_width, in_height);
	const m_blurComponent3 = ComponentBlurFactory(in_resourceManager, in_webGLState, m_blurComponent2.getOutputTexture(), in_width, in_height);
	const m_blurComponent4 = ComponentBlurFactory(in_resourceManager, in_webGLState, m_blurComponent3.getOutputTexture(), in_width, in_height);

	const m_materialTextureArray = []

	const m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	const m_material = MaterialWrapperFactory(m_materialTextureArray);
	m_material.setColorMaskAlpha(true);

	//m_textureWidth = roundNearestPowerOfTwo(in_width);
	//m_textureWidth = roundNearestPowerOfTwo(in_height);
	const m_renderTargetWrapper = RenderTargetWrapperFactory(
			in_webGLState, 
			in_width, 
			in_height,
			[RenderTargetDataFactory(TextureWrapperFactoryByteRGBA(in_webGLState, in_width, in_height), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D")]
			);

	const m_shaderUniforms = {
		"u_samplerSource" : 0,
		"u_samplerBlur0" : 1,
		"u_samplerBlur1" : 2,
		"u_samplerBlur2" : 3,
		"u_samplerBlur3" : 4,
		"u_samplerBlur4" : 5
	};
	const that = Object.create({
		"run" : function(in_state){
			m_blurComponent0.setInputTexture(in_state["texture"]);
			m_blurComponent0.draw();
			m_blurComponent1.draw();
			m_blurComponent2.draw();
			m_blurComponent3.draw();
			m_blurComponent4.draw();

			m_materialTextureArray[0] = in_state["texture"];
			m_materialTextureArray[1] = m_blurComponent0.getOutputTexture();
			m_materialTextureArray[2] = m_blurComponent1.getOutputTexture();
			m_materialTextureArray[3] = m_blurComponent2.getOutputTexture();
			m_materialTextureArray[4] = m_blurComponent3.getOutputTexture();
			m_materialTextureArray[5] = m_blurComponent4.getOutputTexture();

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