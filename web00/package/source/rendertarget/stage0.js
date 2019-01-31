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
const sUniformNameArray = ["u_colour"];

const factory = function(in_webGLContextWrapper){
	const m_colour = Core.Colour4.factoryFloat32(0.0, 0.0, 1.0, 1.0);
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_colour"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, m_colour.getRaw());
			}
		}
	};
	const m_shader = WebGL.ShaderWrapper.factory(in_webGLContextWrapper, sVertexShader, sFragmentShader, m_uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shader);

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
			//in_typeName,in_elementsPerVertex,in_arrayData,in_usageName,in_normalise

	const m_model = WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"TRIANGLES",
		3,
		{
			"a_position" : m_posDataStream
		}
		);
	var m_texture = WebGL.TextureWrapper.factoryByteRGBA(in_webGLContextWrapper, 512, 512);
	var m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper, 512, 512,
		[ WebGL.RenderTargetData.factory(m_texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			m_renderTarget.apply(localWebGLContextWrapper, localWebGLState);

			const clearColour = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
			WebGL.WebGLContextWrapperHelper.clear(localWebGLContextWrapper, clearColour);

			m_material.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, m_shader.getMapVertexAttribute());

			WebGL.WebGLContextWrapperHelper.resetRenderTarget(localWebGLContextWrapper, localWebGLState);
		},
		"getTexture" : function(){
			return m_texture;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
