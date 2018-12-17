const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_data;
varying vec2 v_data;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_data = a_data;
}
`;
const sFragmentShader = `
precision mediump float;
varying vec2 v_data;
void main() {
	float value = ((cos(radians(v_data.x * 360.0)) * cos(radians(v_data.y * 360.0))) * 0.5) + 0.5;
	gl_FragColor = vec4(value, 0.0, 0.0, 1.0);;
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
				1, -1,
				1, -1,
				-1, 1,
				1, 1
				]),
			"STATIC_DRAW",
			false
			);
			//in_typeName,in_elementsPerVertex,in_arrayData,in_usageName,in_normalise

	const m_dataStream = WebGL.ModelDataStream.factory(
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
			"a_data" : m_dataStream
		}
		);
	var m_texture = WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		512, 
		512,
		undefined,
		false, //in_flip,
		"LUMINANCE",
		"LUMINANCE",
		"FLOAT",
		"LINEAR",
		"LINEAR",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);

	var m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper,
		[ WebGL.RenderTargetData.factory(m_texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	);

	const m_clearColour = Core.Colour4.factoryFloat32(0.0, 0.0, 0.0, 1.0);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			m_renderTarget.apply(localWebGLContextWrapper);

			WebGL.WebGLContextWrapperHelper.clear(localWebGLContextWrapper, m_clearColour);

			m_material.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, localWebGLState.getMapVertexAttribute());

			WebGL.WebGLContextWrapperHelper.resetRenderTarget(localWebGLContextWrapper);
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
