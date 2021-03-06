/* 
	render over the current render target, using a vec4 uniform colour
*/

import LinearInterpolatorFactory from "./../core/linearinterpolator.js";
import ComponentModelScreenQuadFactory from "./component-model-screen-quad.js";
import MaterialWrapperFactory from "./materialwrapper.js";
import ShaderWrapperFactory from "./shaderwrapper.js";
import {sFloat4} from "./shaderuniformdata.js";

const sVertexShader = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;
uniform vec4 u_colour;
void main() {
	gl_FragColor = u_colour;
}
`;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameMap = {
	"u_colour" : sFloat4
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


export default function(in_resourceManager, in_webGLState, in_colourRGBA){
	const m_valueInterpolator = LinearInterpolatorFactory(in_colourRGBA.getAlpha());

	const m_modelComponent = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_material = MaterialWrapperFactory(
		undefined, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined, //"FRONT", "BACK", "FRONT_AND_BACK"
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //in_destinationBlendEnumNameOrUndefined,
		);
	const m_colour = Core.Colour4.factoryFloat32(in_colourRGBA.getRed(), in_colourRGBA.getGreen(), in_colourRGBA.getBlue(), in_colourRGBA.getAlpha());
	const m_state = {
		"u_colour" : m_colour.getRaw()
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
		"draw" : function(){
			m_state.u_colour[3] = m_valueInterpolator.getValue();
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
