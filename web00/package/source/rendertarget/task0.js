const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position * 0.5, 0.0, 1.0);
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
}

const factory = function(in_state){
	const m_colour = Core.Colour4.factoryFloat32(0.0, 0.0, 1.0, 1.0);
	const m_shader = WebGL.ShaderWrapper.factory(in_state.m_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_material = WebGL.MaterialWrapper.factory();

	const m_posDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Int8Array([
				-1, -1,
				-1, 1,
				1, -1
				]),
			"STATIC_DRAW",
			false
			);

	const m_model = WebGL.ModelWrapper.factory(
		in_state.m_webGLState, 
		"TRIANGLES",
		3,
		{
			"a_position" : m_posDataStream
		}
		);
	var m_texture = WebGL.TextureWrapper.factoryByteRGBA(in_state.m_webGLState, 512, 512);
	var m_renderTarget = WebGL.RenderTargetWrapper.factory(in_state.m_webGLState, 512, 512,
		[ WebGL.RenderTargetData.factory(m_texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);
	var m_state = {
		"u_colour" : m_colour.getRaw()
	};
	const m_clearColour = Core.Colour4.factoryFloat32(1.0, 0.0, 0.0, 1.0);

	const that = Object.create({
		"run" : function(in_input){
			in_state.m_webGLState.applyRenderTarget(m_renderTarget);
			in_state.m_webGLState.clear(m_clearColour);

			in_state.m_webGLState.applyShader(m_shader, m_state);
			in_state.m_webGLState.applyMaterial(m_material);
			in_state.m_webGLState.drawModel(m_model);

			return m_texture;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
