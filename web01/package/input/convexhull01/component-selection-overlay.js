import modelScreenQuadFactory from "./../webgl/component-model-screen-quad.js"
import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA } from './../webgl/component-render-target-data-factory.js';
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat2, sFloat4} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";

const sVertexShader = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 1.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision mediump float;

uniform sampler2D u_samplerSelection;
uniform sampler2D u_samplerGrow;
uniform vec2 u_viewportWidthHeight;
uniform vec2 u_mouseXY;
uniform vec2 u_radiusInnerOuter;

uniform vec2 u_selectionObjectID_00;
uniform vec4 u_selectionColour_00;
uniform vec2 u_selectionObjectID_01;
uniform vec4 u_selectionColour_01;
uniform vec2 u_selectionObjectID_02;
uniform vec4 u_selectionColour_02;
uniform vec2 u_selectionObjectID_03;
uniform vec4 u_selectionColour_03;

varying vec2 v_uv;

float makeRollowerAlpha(){
	vec2 pixelUV = vec2(v_uv.x * u_viewportWidthHeight.x, (1.0 - v_uv.y) * u_viewportWidthHeight.y);
	float radiusInner = u_radiusInnerOuter.x * u_viewportWidthHeight.x;
	float radiusOuter = u_radiusInnerOuter.y * u_viewportWidthHeight.x;

	float d = length(u_mouseXY - pixelUV);
	if (radiusOuter < d){
		return 0.0;
	}
	if (d < radiusInner){
		return 1.0;
	}
	float ratio = (d - radiusOuter) / (radiusInner - radiusOuter);
	return ratio;
}

void main() {
	vec2 selection = texture2D(u_samplerSelection, v_uv).xy;
	vec2 grow = texture2D(u_samplerGrow, v_uv).xy;
	float rolloverAlpha = makeRollowerAlpha();
	vec4 colour = vec4(0.0, 0.0, 0.0, rolloverAlpha);

	if (grow != selection){
		colour.xy = vec2(1.0, 1.0);
	} else {
		colour.w = 0.0;
	}

	if (grow == u_selectionObjectID_00){
		colour = u_selectionColour_00;
	}
	if (grow == u_selectionObjectID_01){
		colour = u_selectionColour_01;
	}
	if (grow == u_selectionObjectID_02){
		colour = u_selectionColour_02;
	}
	if (grow == u_selectionObjectID_03){
		colour = u_selectionColour_03;
	}
	
	gl_FragColor = colour;
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_samplerSelection" : sInt,
	"u_samplerGrow" : sInt,
	"u_viewportWidthHeight" : sFloat2,
	"u_mouseXY" : sFloat2,
	"u_radiusInnerOuter" : sFloat2, //width percentage

	"u_selectionObjectID_00" : sFloat2,
	"u_selectionColour_00" : sFloat4,
	"u_selectionObjectID_01" : sFloat2,
	"u_selectionColour_01" : sFloat4,
	"u_selectionObjectID_02" : sFloat2,
	"u_selectionColour_02" : sFloat4,
	"u_selectionObjectID_03" : sFloat2,
	"u_selectionColour_03" : sFloat4
}

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_textureSelection, in_textureGrow, in_mouseTracker){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA
	], in_width, in_height);

	var m_modelComponent = modelScreenQuadFactory(in_resourceManager, in_webGLState);
	var m_textureArray = [in_textureSelection, in_textureGrow];

	var m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	var m_material = MaterialWrapperFactory(m_textureArray, 
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		true,
		true,
		true);
	var m_viewportWidthHeight = Vector2FactoryFloat32(in_width, in_height);
	var m_mouseXY = Vector2FactoryFloat32(-1000.0, -1000.0);
	var m_radiusInnerOuter = Vector2FactoryFloat32(0.05, 0.2);
	var m_selectionObjectID_00 = Vector2FactoryFloat32(0.0, 1.0/256.0);
	var m_state = {
		"u_samplerSelection" : 0,
		"u_samplerGrow" : 1,
		"u_viewportWidthHeight" : m_viewportWidthHeight.getRaw(),
		"u_mouseXY" : m_mouseXY.getRaw(),
		"u_radiusInnerOuter" : m_radiusInnerOuter.getRaw(),

		"u_selectionObjectID_00" : m_selectionObjectID_00.getRaw(),
		"u_selectionColour_00" : Vector4FactoryFloat32(1.0, 0.0, 0.0, 0.5).getRaw(),
		"u_selectionObjectID_01" : Vector2FactoryFloat32(0.0, 2.0/255.0).getRaw(),
		"u_selectionColour_01" : Vector4FactoryFloat32(1.0, 1.0, 0.0, 0.5).getRaw(),
		"u_selectionObjectID_02" : Vector2FactoryFloat32(0.0, 3.0/255.0).getRaw(),
		"u_selectionColour_02" : Vector4FactoryFloat32(1.0, 0.0, 1.0, 0.5).getRaw(),
		"u_selectionObjectID_03" : Vector2FactoryFloat32(0.0, 4.0/255.0).getRaw(),
		"u_selectionColour_03" : Vector4FactoryFloat32(0.0, 1.0, 1.0, 0.5).getRaw()
	};

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
				m_viewportWidthHeight.setX(in_width);
				m_viewportWidthHeight.setY(in_height);
			}
			var mouseX = in_mouseTracker.getX();
			var mouseY = in_mouseTracker.getY();
			if ((undefined === mouseX) || (undefined === mouseY)){
				m_mouseXY.setX(-9000.0);
				m_mouseXY.setY(-9000.0);
				m_selectionObjectID_00.setX(1.0);
				m_selectionObjectID_00.setY(1.0);
			} else {
				m_mouseXY.setX(mouseX);
				m_mouseXY.setY(mouseY);
				var pixels = in_webGLState.readTexturePixel(in_textureGrow, "RGBA", mouseX, in_height - mouseY - 1, 1, 1);
				//console.log(pixels);
				var a = pixels[0];
				var b = pixels[1];
				if ((a === 0) && (b === 0)){
					m_selectionObjectID_00.setX(1.0);
					m_selectionObjectID_00.setY(1.0);
				} else {
					m_selectionObjectID_00.setX(a / 255.0);
					m_selectionObjectID_00.setY(b / 255.0);
				}
			}

			//console.log("x:" + m_mouseXY.getX());
			//console.log("y:" + m_mouseXY.getY());

			in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());

			//var state = Object.assign({}, m_state, in_state);
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());

			return;
		},
		"setTexture" : function(in_newTextureSelection, in_newTextureGrow){
			in_textureSelection = in_newTextureSelection;
			in_textureGrow = in_newTextureGrow;
			m_textureArray[0] = in_textureSelection;
			m_textureArray[1] = in_textureGrow;
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
