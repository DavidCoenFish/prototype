import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat2, sFloat4} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import {Base64ToUint8Array} from './../core/base64.js';
import {factory as TextureFactory} from "./../webgl/texturewrapper.js";
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStreamFactory from './../webgl/modeldatastream.js';
import {factoryFloat32 as Vector2FactoryFloat} from "./../core/vector2.js";

const sVertexShader = `
precision mediump float;
attribute vec2 a_position;
uniform vec4 u_cameraPanZoomAspect;
uniform vec2 u_origin;
uniform vec2 u_scale;
varying vec2 v_uv;
void main() {
	vec2 scale = u_scale;
	scale.y /= u_cameraPanZoomAspect.w;
	vec2 halfScale = scale * 0.5;
	vec2 origin = u_origin - vec2(u_cameraPanZoomAspect.x, u_cameraPanZoomAspect.y / u_cameraPanZoomAspect.w);

	gl_Position = vec4(
		mix(origin.x - halfScale.x, origin.x + halfScale.x, a_position.x), 
		mix(origin.y, origin.y + scale.y, a_position.y),
		origin.y,
		1.0
		);
	v_uv = vec2(a_position.x, -a_position.y);
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
	"u_cameraPanZoomAspect" : sFloat4,
	"u_origin" : sFloat2,
	"u_scale" : sFloat2
};

export default function(in_webGLState, in_state, in_textureData){
	const m_texture = TextureFactory(
		in_webGLState,
		256, 
		256, 
		Base64ToUint8Array(in_textureData),
		false,
		"RGBA",
		"RGBA",
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
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //"ONE",  //in_destinationBlendEnumNameOrUndefined,
		false, //true,
		"LESS",
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
				"UNSIGNED_BYTE",
				2,
				new Uint8Array([0, 0, 0, 1, 1, 0,   0, 1, 1, 0, 1, 1]),
				"STATIC_DRAW", 
				false 
				),
		}
	);

	var m_origin = Vector2FactoryFloat(0.0, 0.0);
	var m_scale = Vector2FactoryFloat(0.0, 0.0);
	const m_state = {
		"u_sampler0" : 0,
		"u_cameraPanZoomAspect" : in_state.u_cameraPanZoomAspect,
		"u_origin" : m_origin.getRaw(),
		"u_scale" : m_scale.getRaw()
	};

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			if (false === ("m_treeArray" in in_state)){
				return;
			}
			var treeArray = in_state.m_treeArray;

			in_webGLState.applyMaterial(m_material);

			for (var index = 0; index < treeArray.length; ++index){
				var item = treeArray[index];

				m_origin.setX(item.x);
				m_origin.setY(item.y);
				m_scale.setX(item.z);
				m_scale.setY(item.w);

				in_webGLState.applyShader(m_shader, m_state);
				in_webGLState.drawModel(m_model);
			}

			return;
		},
		"destroy" : function(){
			return;
		}
	});

	return result;

}
