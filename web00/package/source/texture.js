const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

const sVertexShader = `
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
uniform sampler2D u_sampler0;
varying vec2 v_uv;
void main() {
	gl_FragColor = texture2D(u_sampler0, v_uv);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_sampler0" : WebGL.ShaderUniformData.sInt
};

const onPageLoad = function(){
	console.info("onPageLoad");

	const m_canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(document, 256, 256);
	const m_webGLState = WebGL.WebGLState.factory(m_canvaseElementWrapper.getElement());

	const textureWidth = 256;
	const textureHeight= 256;
	const textureRGBData = new Uint8Array(256 * 256 * 3);
	var trace = 0;
	for(var indexY = 0; indexY < textureHeight; ++indexY) {
		for(var indexX = 0; indexX < textureWidth; ++indexX) {
			textureRGBData[trace] = indexX; ++trace;
			textureRGBData[trace] = indexY; ++trace;
			var dot = (((indexX / (textureWidth - 1)) * 0.7071067811) + ((indexY / (textureHeight - 1)) * 0.7071067811));
			var value = (dot / 1.4142135623) * 255;
			var value2 = Math.max(0, Math.min(255, Math.round(value) ) );
			textureRGBData[trace] = value2; ++trace;
		}
	}
	const m_state = {
		"u_sampler0" : 0
	};

	const m_shader = WebGL.ShaderWrapper.factory(m_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_texture = WebGL.TextureWrapper.factoryByteRGB(m_webGLState, textureWidth, textureHeight, textureRGBData)
	const m_material = WebGL.MaterialWrapper.factory([m_texture]);

	const posDataStream = WebGL.ModelDataStream.factory(
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

	const uvDataStream = WebGL.ModelDataStream.factory(
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
		m_webGLState,
		"TRIANGLES",
		6,
		{
			"a_position" : posDataStream,
			"a_uv" : uvDataStream
		}
		);

	const clearColour = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	m_webGLState.clear(clearColour);

	m_webGLState.applyShader(m_shader);
	m_webGLState.applyMaterial(m_material);
	m_webGLState.drawModel(m_model);

	return;
}


window.addEventListener('load', onPageLoad, true);
