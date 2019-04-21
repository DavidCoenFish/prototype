import ComponentSkyBox from './component-skybox.js';
import ComponentModelScreenQuadFactory from './../webgl/component-model-screen-quad.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat3} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";

const sVertexShader = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision mediump float;

uniform sampler2D u_samplerAttachment0;
uniform sampler2D u_samplerDepth;
uniform vec3 u_fogTint;

varying vec2 v_uv;

void main() {
	vec3 attachment0 = texture2D(u_samplerAttachment0, v_uv).xyz;
	highp float depth = texture2D(u_samplerDepth, v_uv).x;
	if (1.0 <= depth){
		discard;
	}
	vec3 colour = mix(attachment0, u_fogTint, depth); 
	gl_FragColor = vec4(colour, 1.0);
}
`;

const sVertexAttributeNameArray = [
	"a_position",
	"a_uv",
];
const sUniformNameMap = {
	"u_samplerAttachment0" : sInt,
	"u_samplerDepth" : sInt,
	"u_fogTint" : sFloat3
};

const sOverlayFragmentShader = `
precision mediump float;

uniform sampler2D u_samplerOverlay;
varying vec2 v_uv;

void main() {
	gl_FragColor = texture2D(u_samplerOverlay, v_uv);
}
`;

const sOverlayUniformNameMap = {
	"u_samplerOverlay" : sInt
};


export default function(in_resourceManager, in_webGLState, in_state, in_cameraRay, in_attachment0, in_depth, in_overlay){
	const m_componentSkyBox = ComponentSkyBox(in_resourceManager, in_webGLState, in_state, in_cameraRay);
	var m_componentModel = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_textureArray = [in_attachment0, in_depth];
	const m_material = MaterialWrapperFactory(m_textureArray);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_state = {
		"u_samplerAttachment0" : 0,
		"u_samplerDepth" : 1,
		"u_fogTint" : m_componentSkyBox.getFogTint().getRaw()
	};

	const m_overlayTextureArray = [in_overlay];
	const m_overlayMaterial = MaterialWrapperFactory(m_overlayTextureArray
		, undefined, undefined, true, "SRC_ALPHA", "ONE_MINUS_SRC_ALPHA"
	);
	const m_overlayShader = ShaderWrapperFactory(in_webGLState, sVertexShader, sOverlayFragmentShader, sVertexAttributeNameArray, sOverlayUniformNameMap);
	const m_overlayState = {
		"u_samplerOverlay" : 0
	};


	//public methods ==========================
	const result = Object.create({
		"setTextureCameraRay" : function(in_cameraRay){
			m_componentSkyBox.setTexture(in_cameraRay);
			//m_worldGrid.setTexture(in_cameraRay);
			return;
		},
		"setTextureDeferedrender" : function(in_attachment0, in_depth){
			m_textureArray[0] = in_attachment0;
			m_textureArray[1] = in_depth;
			return;
		},
		"setTextureOverlay" : function(in_overlay){
			m_overlayTextureArray[0] = in_overlay;
		},
		"draw" : function(){
			m_componentSkyBox.draw();
			//m_worldGrid.draw();

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_componentModel.getModel());

			in_webGLState.applyShader(m_overlayShader, m_overlayState);
			in_webGLState.applyMaterial(m_overlayMaterial);
			in_webGLState.drawModel(m_componentModel.getModel());

			return;
		},
		"destroy" : function(){
			if (undefined !== m_componentModel){
				m_componentModel.destroy();
				m_componentModel = undefined;
			}
			if (undefined !== m_componentSkyBox){
				m_componentSkyBox.destroy();
			}
			return;
		}
	});

	return result;

}

