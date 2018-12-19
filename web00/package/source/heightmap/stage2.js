/* 
take a normal map, add a env map, and generate a texture
*/

const Core = require("core");
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
	vec4 texel = texture2D(u_sampler0, v_uv);
	gl_FragColor = texel;
}
`;
//vec4(texel.x, 0.0, 0.0, 1.0);
//	gl_FragColor = texture2D(u_sampler0, v_uv);

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameArray = ["u_sampler0"];

const factory = function(in_webGLContextWrapper, in_textureWrapper){
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sampler0"){
				//console.log("uniformServer:u_sampler0");
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			}
		}
	};
	const m_shader = WebGL.ShaderWrapper.factory(in_webGLContextWrapper, sVertexShader, sFragmentShader, m_uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shader, [in_textureWrapper]);

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
			//in_typeName,in_elementsPerVertex,in_arrayData,in_usageName,in_normalise

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
		in_webGLContextWrapper, 
		"TRIANGLES",
		6,
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream
		}
		);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			WebGL.WebGLContextWrapperHelper.resetRenderTarget(localWebGLContextWrapper);

			const clearColour = Core.Colour4.factoryFloat32(0.0, 0.0, 0.0, 1.0);
			WebGL.WebGLContextWrapperHelper.clear(localWebGLContextWrapper, clearColour);

			m_material.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, m_shader.getMapVertexAttribute());
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
