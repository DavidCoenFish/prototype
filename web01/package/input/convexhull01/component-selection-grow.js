import modelScreenQuadFactory from "./../webgl/component-model-screen-quad.js"
import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import { RenderTargetDataFactoryAttachment0ByteRGBANearest } from './../webgl/component-render-target-data-factory.js';
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat, sFloat2, sFloat3} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";

const sVertexShader = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying highp vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 1.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision highp float;

uniform sampler2D u_samplerRbga;
uniform sampler2D u_samplerDepth;
uniform vec2 u_dxDy;

varying vec2 v_uv;

vec3 sample(vec3 in_value, vec2 in_offset){
	vec2 uv = (in_offset * u_dxDy) + v_uv;
	//float depth = min(in_value.z, texture2D(u_samplerDepth, uv).x);
	//return vec3(mix(in_value.xy, texture2D(u_samplerRbga, uv).xy, step(depth, in_value.z)), depth);
	float depth = texture2D(u_samplerDepth, uv).x;
	if (in_value.z <= depth){
		return in_value;
	}
	return vec3(texture2D(u_samplerRbga, uv).xy, depth);
}

void main() {
	vec3 rgDepth = vec3(0.0, 0.0, 1.0);

	//assume at lease 2x2 area of clickable, so only sample 8, not 20 times

	rgDepth = sample(rgDepth, vec2(-2.0, -1.0));
	//rgDepth = sample(rgDepth, vec2(-2.0, 0.0));
	rgDepth = sample(rgDepth, vec2(-2.0, 1.0));
	rgDepth = sample(rgDepth, vec2(-1.0, -2.0));
	//rgDepth = sample(rgDepth, vec2(-1.0, -1.0));
	//rgDepth = sample(rgDepth, vec2(-1.0, 0.0));
	//rgDepth = sample(rgDepth, vec2(-1.0, 1.0));
	rgDepth = sample(rgDepth, vec2(-1.0, 2.0));
	//rgDepth = sample(rgDepth, vec2(0.0, -2.0));
	//rgDepth = sample(rgDepth, vec2(0.0, -1.0));
	//rgDepth = sample(rgDepth, vec2(0.0, 1.0));
	//rgDepth = sample(rgDepth, vec2(0.0, 2.0));
	rgDepth = sample(rgDepth, vec2(1.0, -2.0));
	//rgDepth = sample(rgDepth, vec2(1.0, -1.0));
	//rgDepth = sample(rgDepth, vec2(1.0, 0.0));
	//rgDepth = sample(rgDepth, vec2(1.0, 1.0));
	rgDepth = sample(rgDepth, vec2(1.0, 2.0));
	rgDepth = sample(rgDepth, vec2(2.0, -1.0));
	//rgDepth = sample(rgDepth, vec2(2.0, 0.0));
	rgDepth = sample(rgDepth, vec2(2.0, 1.0));

	gl_FragColor = vec4(rgDepth.xy, 0.0, 1.0);
	// vec2 source = texture2D(u_samplerRbga, v_uv).xy;
	// if ((source.x == rgDepth.x) && (source.y == rgDepth.y)){
	// 	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	// } else {
	// }
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_samplerRbga" : sInt,
	"u_samplerDepth" : sInt,
	"u_dxDy" : sFloat2
}

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_textureRgba, in_textureDepth){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBANearest
	], in_width, in_height);

	var m_modelComponent = modelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_textureRgba, in_textureDepth];

	var m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	var m_material = MaterialWrapperFactory(m_textureArray);
	var m_dxDy = Vector2FactoryFloat32(1.0 / in_width, 1.0 / in_height);
	var m_state = {
		"u_samplerRbga" : 0,
		"u_samplerDepth" : 1,
		"u_dxDy" : m_dxDy.getRaw()
	};

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
				m_dxDy.setX(1.0 / in_width);
				m_dxDy.setY(1.0 / in_height);
			}

			in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());

			return;
		},
		"setTexture" : function(in_textureRgba, in_textureDepth){
			m_textureArray[0] = in_textureRgba;
			m_textureArray[1] = in_textureDepth;
			return;
		},
		"getTexture" : function(){
			return m_componentRenderTarget.getTexture(0);
		},
		"destroy" : function(){
			if (undefined !== m_componentRenderTarget){
				m_componentRenderTarget.destroy();
				m_componentRenderTarget = undefined;
			}
			if (undefined !== m_modelComponent){
				m_modelComponent.destroy();
				m_modelComponent = undefined;
			}
			if (undefined !== m_shader){
				m_shader.destroy();
				m_shader = undefined;
			}
			return;
		}
	});

	return result;

}
