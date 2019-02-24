const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position * 0.5, 0.0, 1.0);
	v_uv = a_uv;
}
`;
const sFragmentShader = `
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_uv;
void main() {
	gl_FragColor = texture2D(u_sampler0, v_uv);
	gl_FragColor.a = 1.0;
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_sampler0" : WebGL.ShaderUniformData.sInt
}

const factory = function(in_state){
	const m_shader = WebGL.ShaderWrapper.factory(in_state.m_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_material = WebGL.MaterialWrapper.factory();
	//m_material.setColorMaskAlpha(true);
	const m_state = {
		"u_sampler0" : 0
	};

	const m_posDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Int8Array([
				-1, -1,
				-1, 1,
				1, -1,

				1, -1,
				-1, 1,
				1, 1
				]),
			"STATIC_DRAW",
			false
			);

	const m_uvDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Uint8Array([
				0, 0,
				0, 1,
				1, 0,

				1, 0,
				0, 1,
				1, 1
				]),
			"STATIC_DRAW",
			false
			);

	const m_model = WebGL.ModelWrapper.factory(
		in_state.m_webGLState, 
		"TRIANGLES",
		6,
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream
		}
		);

	const m_clearColour = Core.Colour4.factoryFloat32(0.0, 1.0, 0.0, 1.0);

	const that = Object.create({
		"run" : function(in_input){
			in_state.m_webGLState.resetRenderTarget();
			in_state.m_webGLState.clear(m_clearColour);

			in_state.m_webGLState.applyShader(m_shader, m_state);
			m_material.setTextureArray([in_input]);
			in_state.m_webGLState.applyMaterial(m_material);
			in_state.m_webGLState.drawModel(m_model);
			return undefined;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
