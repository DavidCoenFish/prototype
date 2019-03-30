/* 
	render over the current render target
*/

const Core = require("core");
const ComponentModelScreenQuad = require("./component-model-screen-quad.js");
const MaterialWrapper = require("./materialwrapper.js");
import ShaderWrapperFactory from "./shaderwrapper.js";
const ShaderUniformData = require("./shaderuniformdata.js");

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
	"u_sampler" : ShaderUniformData.sInt,
	"u_viewport" : ShaderUniformData.sFloat4
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}
const sShaderName = "componentRenderFadeShader";


const factory = function(in_resourceManager, in_webGLState, in_texture){
	const m_modelComponent = ComponentModelScreenQuad.factory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_textureArray = [in_texture];
	const m_material = MaterialWrapper.factory(m_textureArray);
	m_material.setColorMaskAlpha(true);
	const m_viewport = Core.Vector4.factoryFloat32();
	const m_state = {
		"u_sampler" : 0,
		"u_viewport" : m_viewport.getRaw()
	};

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);

	//public methods ==========================
	const that = Object.create({
		"setMask" : function(in_drawRed, in_drawBlue, in_drawGreen, in_drawAlpha){
			m_material.getColorMaskRed(in_drawRed);
			m_material.getColorMaskRed(in_drawBlue);
			m_material.getColorMaskRed(in_drawGreen);
			m_material.getColorMaskRed(in_drawAlpha);
			return;
		},
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
		},
		"draw" : function(in_renderTarget){
			in_webGLState.applyRenderTarget(in_renderTarget);

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

module.exports = {
	"factory" : factory
}