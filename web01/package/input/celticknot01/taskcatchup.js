/* */
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';
//import {roundNextPowerOfTwo} from './../core/coremath.js';
import {factoryByteRGBA as TextureWrapperFactoryByteRGBA } from './../webgl/texturewrapper.js';
import ComponentFactory from './../webgl/component-model-screen-quad.js';
import MaterialWrapperFactory from './../webgl/materialwrapper.js';
import RenderTargetWrapperFactory from './../webgl/rendertargetwrapper.js';
import RenderTargetDataFactory from './../webgl/rendertargetdata.js';
import ShaderWrapperFactory from './../webgl/shaderwrapper.js';
import {sInt, sFloat, sFloat4} from './../webgl/shaderuniformdata.js';

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
uniform sampler2D u_samplerState;
uniform sampler2D u_samplerTarget;
uniform vec4 u_maxDeltaPositive;
uniform vec4 u_maxDeltaNegative;
uniform float u_timeDelta;
void main() {
	vec4 texelState = texture2D(u_samplerState, v_uv);
	vec4 texelTarget = texture2D(u_samplerTarget, v_uv);
	vec4 delta = texelTarget - texelState;
	delta = min(delta, u_maxDeltaPositive * u_timeDelta);
	delta = max(delta, u_maxDeltaNegative * u_timeDelta);

	gl_FragColor = texelState + delta;
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv"
];
const sUniformNameMap = {
	"u_samplerState" : sInt,
	"u_samplerTarget" : sInt,
	"u_maxDeltaPositive" : sFloat4,
	"u_maxDeltaNegative" : sFloat4,
	"u_timeDelta" : sFloat
};


export default function (in_resourceManager, in_webGLState, in_width, in_height) {
	const m_modelComponent = ComponentFactory(in_resourceManager, in_webGLState);

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
	var m_renderTargetIndex = 0;
	const m_renderTargetWrapper = [
		RenderTargetWrapperFactory(
			in_webGLState, 
			in_width, 
			in_height,
			[RenderTargetDataFactory(TextureWrapperFactoryByteRGBA(in_webGLState, in_width, in_height), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D")]
			),
		RenderTargetWrapperFactory(
			in_webGLState, 
			in_width, 
			in_height,
			[RenderTargetDataFactory(TextureWrapperFactoryByteRGBA(in_webGLState, in_width, in_height), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D")]
			)
		];
	in_webGLState.applyRenderTarget(m_renderTargetWrapper[m_renderTargetIndex]);
	const m_backgroundColour = Colour4FactoryFloat32(1.0,1.0,1.0,0.0);
	in_webGLState.clear(m_backgroundColour);
	in_webGLState.applyRenderTarget();

	const m_shaderUniforms = {
		"u_samplerState" : 0,
		"u_samplerTarget" : 1,
		"u_maxDeltaPositive" : Vector4FactoryFloat32(1.0, 1.0, 1.0, 1.0).getRaw(),
		"u_maxDeltaNegative" : Vector4FactoryFloat32(-1.0, -1.0, -1.0, -1.0).getRaw(),
		"u_timeDelta" : 0.0
	};
	const that = Object.create({
		"run" : function(in_state){
			m_materialTextureArray[0] = m_renderTargetWrapper[m_renderTargetIndex].getTexture(0);
			m_materialTextureArray[1] = in_state["texture"];

			in_webGLState.applyRenderTarget(m_renderTargetWrapper[m_renderTargetIndex ^ 1]);

			m_shaderUniforms["u_timeDelta"] = in_state["timeDelta"];
			in_webGLState.applyShader(m_shader, m_shaderUniforms);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());

			in_state["texture"] = m_renderTargetWrapper[m_renderTargetIndex ^ 1].getTexture(0);
			m_renderTargetIndex ^= 1;
			return in_state;
		},
		"destroy" : function(){
			releaseModel();
			return;
		}
	});

	return that;
}