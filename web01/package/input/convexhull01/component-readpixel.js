/* */
import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA } from './../webgl/component-render-target-data-factory.js';
import modelScreenQuadFactory from "./../webgl/component-model-screen-quad.js"
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat2} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';

const sVertexShader = `
precision mediump float;
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 1.0, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;

uniform sampler2D u_sampler;
uniform vec2 u_uv;
void main() {
	gl_FragColor = texture2D(u_sampler, u_uv);
}
`;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameMap = {
	"u_sampler" : sInt,
	"u_uv" : sFloat2
};

export default function(in_resourceManager, in_webGLState, in_texture){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA
	], 1, 1);

	var m_modelComponent = modelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_texture];
	var m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	var m_material = MaterialWrapperFactory(
		m_textureArray, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined,
		undefined, //in_blendModeEnabledOrUndefined,
		undefined, //"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		undefined, //"ONE_MINUS_SRC_ALPHA", //"ONE",  //in_destinationBlendEnumNameOrUndefined,
		undefined, //in_depthFuncEnabledOrUndefined,
		undefined, //in_depthFuncEnumNameOrUndefined
		undefined, //in_frontFaceEnumNameOrUndefined, //"CW", "CCW"
		true, //in_colorMaskRedOrUndefined, //true
		true, //in_colorMaskGreenOrUndefined, //true
		true, //in_colorMaskBlueOrUndefined, //true
		true, //in_colorMaskAlphaOrUndefined, //false
		undefined, //in_depthMaskOrUndefined, //false
		undefined //in_stencilMaskOrUndefined //false
	);

	const m_pixels = new Uint8Array(4);
	const m_uv = Vector2FactoryFloat32(0.0, 0.0);
	const m_state = {
		"u_sampler" : 0,
		"u_uv" : m_uv.getRaw()
	};

	//public methods ==========================
	const that = Object.create({
		"run" : function(in_texture, in_x, in_y){
			if ((undefined === in_x) || (undefined === in_y)){
				m_pixels[0] = 0;
				m_pixels[1] = 0;
				m_pixels[2] = 0;
				m_pixels[3] = 0;
			} else {
				m_textureArray[0] = in_texture;
				m_uv.setX(in_x);
				m_uv.setY(in_y);

				in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());
				in_webGLState.applyShader(m_shader, m_state);
				in_webGLState.applyMaterial(m_material);
				in_webGLState.drawModel(m_modelComponent.getModel());
				in_webGLState.readTexturePixel(m_pixels, "RGBA", "UNSIGNED_BYTE", 0, 0, 1, 1);
			}

			return;
		},
		"getPixels" : function(){
			return m_pixels;
		},
		"destroy" : function(){
			m_componentRenderTarget.destroy();
			m_componentRenderTarget = undefined;
			m_modelComponent.destroy();
			m_modelComponent = undefined;
			m_shader.destroy();
			m_shader = undefined;
			m_material = undefined;
			return;
		}
	})

	return that;
}
