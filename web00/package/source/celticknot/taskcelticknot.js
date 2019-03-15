/*
input timeDelta
output texture
 */

const DrawCelticKnot = require("./drawcelticknot.js");
const Core = require("core");
const WebGL = require("webgl");

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
uniform float u_timeDelta;
void main() {
	vec4 texelState = texture2D(u_samplerState, v_uv);
	vec4 texelTarget = texture2D(u_samplerTarget, v_uv);
	float fadeRate = 0.5 * u_timeDelta;
	vec4 fadeStep = vec4(fadeRate, fadeRate, fadeRate, fadeRate);
	vec4 delta = max(min(texelTarget - texelState, fadeStep), -fadeStep);
	vec4 result = texelState + delta;
	gl_FragColor = result;
	//gl_FragColor = texelTarget;
	//mix(texelA, texelB, u_ratio);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv", 
];
const sUniformNameMap = {
	"u_samplerState" : WebGL.ShaderUniformData.sInt,
	"u_samplerTarget" : WebGL.ShaderUniformData.sInt,
	"u_timeDelta" : WebGL.ShaderUniformData.sFloat
};

const shaderFactory = function(in_webGLState){
	return WebGL.ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}


const makeRenderTarget = function(in_webGLState, in_screenWidth, in_screenHeight){
	var texture = WebGL.TextureWrapper.factoryByteRGBA(in_webGLState, in_screenWidth, in_screenHeight);
	var renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLState, texture.getWidth(), texture.getHeight(),
		[ WebGL.RenderTargetData.factory(texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);
	return renderTarget;
}

const factory = function(in_resourceManager, in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight){
	const m_drawCelticKnot = DrawCelticKnot.factory(in_resourceManager, in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight);

	var m_renderTarget = [
		makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight),
		makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight)
	];
	var m_renderTargetIndex = 0;
	in_webGLState.applyRenderTarget(m_renderTarget[m_renderTargetIndex]);
	in_webGLState.clear(Core.Colour4.sBlack);

	var m_renderTargetKnot = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);

	const m_textureArray = [m_renderTarget[0].getTexture(0), m_renderTargetKnot.getTexture(0)];
	const m_material = WebGL.MaterialWrapper.factory(m_textureArray);
	m_material.setColorMaskAlpha(true);
	const m_modelComponent = WebGL.ComponentModelScreenQuad.factory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_state = {
		"u_samplerState" : 0,
		"u_samplerTarget" : 1,
		"u_timeDelta" : 0.0
	};
	const m_shader = shaderFactory(in_webGLState);

	const that = Object.create({
		"run" : function(in_timeDelta){
			m_drawCelticKnot.tick(in_timeDelta);
			m_drawCelticKnot.draw(m_renderTargetKnot);

			m_textureArray[0] = m_renderTarget[m_renderTargetIndex].getTexture(0);
			m_state.u_timeDelta = in_timeDelta;

			m_renderTargetIndex ^= 1;
			in_webGLState.applyRenderTarget(m_renderTarget[m_renderTargetIndex]);

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			return m_renderTarget[m_renderTargetIndex].getTexture(0);
			//return m_renderTargetKnot.getTexture(0);
		}

	});

	return that;
}

module.exports = {
	"factory" : factory,
};
