/* 
	render over the current render target
alpha = bx + c;
*/

const Core = require("core");
const ComponentModelScreenQuad = require("./component-model-screen-quad.js");
const MaterialWrapper = require("./materialwrapper.js");
const ShaderWrapper = require("./shaderwrapper.js");
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

uniform vec3 u_colour;
uniform vec2 u_widthHeightPercentage;
uniform vec4 u_viewport;

float alphaFunction(vec2 in_uv, vec2 in_widthHeightPercentage){
	float widthB = 1.0 / u_viewport.z;
	float widthLowA = ((-widthB) * in_uv.x) + in_widthHeightPercentage.x;
	float widthHighA = ((-widthB) * (1.0 - in_uv.x)) + in_widthHeightPercentage.x;
	float heightB = 1.0 / u_viewport.w;
	float heightLowA = ((-heightB) * in_uv.y) + in_widthHeightPercentage.y;
	float heightHighA = ((-heightB) * (1.0 - in_uv.y)) + in_widthHeightPercentage.y;

	float alpha = max(0.0, min(1.0, max(widthLowA, max(widthHighA, max(heightLowA, hightHighA)))));

	return alpha;
}

void main() {
	float alpha = alphaFunction(v_uv, u_widthHeightPercentage);
	gl_FragColor = vec4(u_colour.x, u_colour.y, u_colour.z, alpha);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_colour" : ShaderUniformData.sFloat3, 
	"u_widthHeightPercentage" : ShaderUniformData.sFloat2,
	"u_viewport" : ShaderUniformData.sFloat4,
};

const shaderFactory = function(in_webGLState){
	return ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}
const sShaderName = "componentRenderLetterboxShader";

const factory = function(in_resourceManager, in_webGLState, in_colourRGB, in_widthPercentage, in_heightPercentage){
	const m_widthInterpolator = Core.LinearInterpolator.factory(in_widthPercentage);
	const m_heightInterpolator = Core.LinearInterpolator.factory(in_heightPercentage);

	const m_modelComponent = ComponentModelScreenQuad.factory(in_resourceManager, in_webGLState);
	const m_model = m_modelComponent.getModel();
	const m_material = MaterialWrapper.factory(
		undefined, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined, //"FRONT", "BACK", "FRONT_AND_BACK"
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //in_destinationBlendEnumNameOrUndefined,
		);
	const m_widthHeightPercentage = Core.Vector2.factoryFloat32(in_widthPercentage, in_heightPercentage);
	const m_colour = Core.Vector3.factoryFloat32(in_colourRGB.getRed(), in_colourRGB.getGreen(), in_colourRGB.getBlue());
	const m_viewport = Core.Vector4.factoryFloat32();
	const m_state = {
		"u_colour" : m_colour.getRaw(),
		"u_widthHeightPercentage" : m_widthHeightPercentage.getRaw(),
		"u_viewport" : m_viewport.getRaw()
	};

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLState);

	//public methods ==========================
	const that = Object.create({
		"setWidth" : function(in_width, in_time){
			m_widthInterpolator.setValue(in_width, in_time);
			return;
		},
		"setHeight" : function(in_height, in_time){
			m_heightInterpolator.setValue(in_height, in_time);
			return;
		},
		"tick" : function(in_timeDelta){
			m_widthInterpolator.tick(in_timeDelta);
			m_heightInterpolator.tick(in_timeDelta);
			return;
		},
		"draw" : function(){
			m_widthHeightPercentage.setX(m_widthInterpolator.getValue());
			m_widthHeightPercentage.setY(m_heightInterpolator.getValue());
			in_webGLState.getViewport(m_viewport);

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);
		},
		"destroy" : function(){
			m_modelComponent.destroy();
			release();
		}
	})

	return that;
}

module.exports = {
	"factory" : factory
}