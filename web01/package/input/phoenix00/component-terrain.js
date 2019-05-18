import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat4} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import {Base64ToUint8Array} from './../core/base64.js';
import {factory as TextureFactory} from "./../webgl/texturewrapper.js";
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStreamFactory from './../webgl/modeldatastream.js';

const sVertexShader = `
precision mediump float;
attribute vec2 a_position;
uniform vec4 u_cameraPanZoomAspect;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position.x, a_position.y, a_position.y, 1.0);
	v_uv = vec2(
		(a_position.x * 0.5) + 0.5 + u_cameraPanZoomAspect.x,
		(a_position.y * 0.5) + 0.5 + u_cameraPanZoomAspect.y
		//(a_position.y * 0.5 / u_cameraPanZoomAspect.w) + 0.5 + u_cameraPanZoomAspect.y
		);
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

const sVertexAttributeNameArray = [
	"a_position",
];
const sUniformNameMap = {
	"u_sampler0" : sInt,
	"u_cameraPanZoomAspect" : sFloat4
};

export default function(in_webGLState, in_state){
	const m_texture = TextureFactory(
		in_webGLState,
		256, 
		256, 
		Base64ToUint8Array(sGrassTextureData),
		false,
		"RGB",
		"RGB",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"REPEAT",
		"REPEAT"
		);
	
	const m_textureArray = [m_texture];
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		"ALWAYS",
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true
	);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_model = ModelWrapperFactory(
		in_webGLState, 
		"TRIANGLES", 
		6, 
		{
			"a_position" : ModelDataStreamFactory(
				in_webGLState, 
				"FLOAT",
				2,
				new Float32Array([
					-1.0, -1.0,
					-1.0, 1.0,
					1.0, -1.0,
					-1.0, 1.0,
					1.0, -1.0, 
					1.0, 1.0
					]),
				"STATIC_DRAW", 
				false 
				),
		}
	);
	const m_state = Object.assign({
		"u_sampler0" : 0
	}, in_state);

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			return;
		},
		"destroy" : function(){
			return;
		}
	});

	return result;

}
