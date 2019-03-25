/*
input texture (celtic knot with alpha)
input texture background
output texture
 */

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
uniform sampler2D u_samplerForeground;
uniform sampler2D u_samplerBackground;
uniform sampler2D u_samplerDropshadow;
void main() {
	vec4 foreground = texture2D(u_samplerForeground, v_uv);
	vec4 background = texture2D(u_samplerBackground, v_uv);
	vec4 dropshadow = texture2D(u_samplerDropshadow, v_uv);
	//gl_FragColor.xyz = (foreground.xyz * foreground.w) + 
	//	(background.xyz * (1.0 - foreground.w - dropshadow.w));
	//gl_FragColor.w = 1.0;
	//gl_FragColor = vec4(foreground.w, foreground.w, foreground.w, 1.0);
	//gl_FragColor = vec4(dropshadow.w, dropshadow.w, dropshadow.w, 1.0);
	float value = foreground.w;
	if (0.0 == value){
		value = background.x * dropshadow.w;
		value = 0.5; //background.x * dropshadow.w;
		value = 1.0 - dropshadow.w;
	}
	gl_FragColor = vec4(value, value, value, 1.0);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv", 
];
const sUniformNameMap = {
	"u_samplerForeground" : WebGL.ShaderUniformData.sInt,
	"u_samplerBackground" : WebGL.ShaderUniformData.sInt,
	"u_samplerDropshadow" : WebGL.ShaderUniformData.sInt,
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

const factory = function(in_resourceManager, in_webGLState, in_screenWidth, in_screenHeight){
	const m_textureArray = [ undefined, undefined, undefined ];
	const m_material = WebGL.MaterialWrapper.factory(m_textureArray);
	const m_modelComponent = WebGL.ComponentModelScreenQuad.factory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_state = {
		"u_samplerForeground" : 0,
		"u_samplerBackground" : 1,
		"u_samplerDropshadow" : 2,
	};
	const m_shader = shaderFactory(in_webGLState);
	const m_componentBlur0 = WebGL.componentRenderBlur5.factory(in_resourceManager, in_webGLState);
	m_componentBlur0.setMask(false, false, false, true);
	const m_blurRenderTarget0 = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);
	const m_componentBlur1 = WebGL.componentRenderBlur5.factory(in_resourceManager, in_webGLState, m_blurRenderTarget0.getTexture(0));
	m_componentBlur1.setMask(false, false, false, true);
	const m_blurRenderTarget1 = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);

	const m_backgroundRenderTarget = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);
	in_webGLState.applyRenderTarget(m_backgroundRenderTarget);
	in_webGLState.clear(Core.Colour4.sGrey);

	const m_outputRenderTarget = makeRenderTarget(in_webGLState, in_screenWidth, in_screenHeight);

	const that = Object.create({
		"run" : function(in_texture){
			m_componentBlur0.setTexture(in_texture);
			m_componentBlur0.draw(m_blurRenderTarget0);
			m_componentBlur1.draw(m_blurRenderTarget1);
			//return m_blurRenderTarget1.getTexture(0);

			m_textureArray[0] = in_texture;
			m_textureArray[1] = m_backgroundRenderTarget.getTexture(0);
			m_textureArray[2] = m_blurRenderTarget1.getTexture(0);

			in_webGLState.applyRenderTarget(m_outputRenderTarget);
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			return m_outputRenderTarget.getTexture(0);
		}

	});

	return that;
}

module.exports = {
	"factory" : factory,
};
