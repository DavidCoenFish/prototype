const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
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
	"u_colour" : WebGL.ShaderUniformData.sFloat4
};

const onPageLoad = function(){
	console.info("onPageLoad");

	const m_canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(document, 512, 256);
	const m_webGLState = WebGL.WebGLState.factory(m_canvaseElementWrapper.getElement());

	const m_state = {
		"u_colour" : Core.Colour4.factoryFloat32(0.0, 0.0, 1.0, 1.0).getRaw()
	}
	const m_shader = WebGL.ShaderWrapper.factory(m_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_material = WebGL.MaterialWrapper.factory(m_webGLState);

	const m_model = WebGL.ModelWrapper.factory(
		m_webGLState, 
		"TRIANGLES",
		3,
		{
			"a_position" : WebGL.ModelDataStream.factory(
				"BYTE",
				2,
				new Int8Array([
					-1, -1,
					-1, 1,
					1, -1
					]),
				"STATIC_DRAW",
				false
				)
		}
	);

	const m_clearColour = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	m_webGLState.clear(m_clearColour);

	m_webGLState.applyMaterial(m_material);
	m_webGLState.applyShader(m_shader, m_state);
	m_webGLState.drawModel(m_model);

	return;
}

// const onPageLoad = function(){
// 	console.info("onPageLoad2");
// }

window.addEventListener('load', onPageLoad, true);
