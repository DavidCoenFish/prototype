/* 
	render over the current render target, using a vec4 uniform colour
*/

import LinearInterpolatorFactory from "./../core/linearinterpolator.js";
import ComponentModelScreenQuadFactory from "./component-model-screen-quad.js";
import MaterialWrapperFactory from "./materialwrapper.js";
import ShaderWrapperFactory from "./shaderwrapper.js";
import {sInt, sFloat} from "./shaderuniformdata.js";

const sVertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
	v_uv = (a_position.xy * 0.5) + vec2(0.5, 0.5);
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;
uniform float u_alpha;
uniform sampler2D u_sampler;
varying vec2 v_uv;
void main() {
	vec4 texel = texture2D(u_sampler, v_uv);
	gl_FragColor = vec4(texel.xyz, u_alpha);
}
`;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameMap = {
	"u_alpha" : sFloat,
	"u_sampler" : sInt,
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}
const sShaderName = "componentRenderFadeTextureShader";


export default function(in_resourceManager, in_webGLState, in_textureRGB){
	const m_valueInterpolator = LinearInterpolatorFactory(0.0);

	const m_modelComponent = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_textureArray = [in_textureRGB];
	const m_material = MaterialWrapperFactory(
		m_textureArray, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined, //"FRONT", "BACK", "FRONT_AND_BACK"
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //in_destinationBlendEnumNameOrUndefined,
		undefined,
		undefined, 
		undefined,
		true,
		true,
		true,
		true
		);
	const m_state = {
		"u_alpha" : m_valueInterpolator.getValue(),
		"u_sampler" : 0
	};

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);

	//public methods ==========================
	const that = Object.create({
		"tick" : function(in_timeDelta){
			m_valueInterpolator.tick(in_timeDelta);
			return;
		},
		"setAlpha" : function(in_alpha, in_time){
			m_valueInterpolator.setValue(in_alpha, in_time);
			return;
		},
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
			return;
		},
		"draw" : function(){
			m_state.u_alpha = m_valueInterpolator.getValue();

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
