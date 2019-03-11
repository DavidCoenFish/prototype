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
uniform sampler2D u_samplerA;
uniform sampler2D u_samplerB;
uniform float u_ratio;
void main() {
	vec4 texelA = texture2D(u_samplerA, v_uv);
	vec4 texelB = texture2D(u_samplerB, v_uv);
	gl_FragColor = mix(texelA, texelB, u_ratio);
	//gl_FragColor = mix(texelA, texelB, 0.5);
	//gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv", 
];
const sUniformNameMap = {
	"u_samplerA" : WebGL.ShaderUniformData.sInt,
	"u_samplerB" : WebGL.ShaderUniformData.sInt,
	"u_ratio" : WebGL.ShaderUniformData.sFloat
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
	var texture = WebGL.TextureWrapper.factoryByteRGB(in_webGLState, in_screenWidth, in_screenHeight);
	var renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLState, texture.getWidth(), texture.getHeight(),
		[ WebGL.RenderTargetData.factory(texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);
	return renderTarget;
}

const factory = function(in_resourceManager, in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight){
	const m_drawCelticKnot = DrawCelticKnot.factory(in_resourceManager, in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight);

	var m_renderTargetA = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);
	var m_renderTargetB = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);
	var m_renderTargetOutput = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);
	var m_countdown = undefined;
	var m_blendFinished = false;

	const m_timeHold = 2.0;
	const m_timeFade = 1.0;
	const m_timeTotal = m_timeHold + m_timeFade;

	const m_textureArray = [m_renderTargetA.getTexture(0), m_renderTargetB.getTexture(0)];
	const m_material = WebGL.MaterialWrapper.factory(m_textureArray);
	const m_modelComponent = WebGL.ComponentModelScreenQuad.factory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_state = {
		"u_samplerA" : 0,
		"u_samplerB" : 1,
		"u_ratio" : 0.0
	};
	const m_shader = shaderFactory(in_webGLState);

	const that = Object.create({
		"run" : function(in_timeDelta){
			if (undefined === m_countdown){
				m_drawCelticKnot.draw(m_renderTargetB);
				m_countdown = m_timeHold;
				m_blendFinished = false;
			}

			//return m_renderTargetB.getTexture(0);

			m_countdown -= in_timeDelta;
			if (m_countdown <= 0.0){
				m_countdown += m_timeTotal;
				var temp = m_renderTargetA;
				m_renderTargetA = m_renderTargetB;
				m_renderTargetB = temp;
				m_drawCelticKnot.draw(m_renderTargetB);
				m_blendFinished = false;
			}

			if ((false === m_blendFinished) || (m_timeHold < m_countdown)){
				m_textureArray[0] = m_renderTargetA.getTexture(0);
				m_textureArray[1] = m_renderTargetB.getTexture(0);
				m_material.setTextureArray(m_textureArray);

				m_state.u_ratio = Math.max(0.0, Math.min(1.0, (m_timeTotal - m_countdown) / m_timeFade));

				in_webGLState.applyRenderTarget(m_renderTargetOutput);
				in_webGLState.applyShader(m_shader, m_state);
				in_webGLState.applyMaterial(m_material);
				in_webGLState.drawModel(m_model);

				if (m_countdown <= m_timeHold){
					m_blendFinished = true;
				}
			}

			return m_renderTargetOutput.getTexture(0);
			//return m_renderTargetB.getTexture(0);
		}

	});

	return that;
}

module.exports = {
	"factory" : factory,
};
