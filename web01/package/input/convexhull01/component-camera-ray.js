import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import { RenderTargetDataFactoryAttachment0FloatRGBA } from './../webgl/component-render-target-data-factory.js';
import ComponentModelScreenQuadFactory from './../webgl/component-model-screen-quad.js';
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';
import {factoryFloat32 as Vector3FactoryFloat32} from './../core/vector3.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sFloat, sFloat2} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";

const sVertexShader = `
precision highp float;

attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision highp float;

uniform float u_fovhradian;
uniform vec2 u_viewportWidthHeight;

varying vec2 v_uv;

vec2 makePolareCoords(vec2 in_uv){
	float aspect = u_viewportWidthHeight.y / u_viewportWidthHeight.x;
	vec2 result = vec2((in_uv.x - 0.5) * u_fovhradian, (in_uv.y - 0.5) * u_fovhradian * aspect);
	return result; 
}

vec3 makeScreenEyeRay(vec2 in_polarCoords) {
	float polar_a_radian = atan(in_polarCoords.y, in_polarCoords.x);
	float polar_r_radian = length(in_polarCoords);

	float z = cos(polar_r_radian);
	float temp = sqrt(1.0 - (z * z));
	float x = temp * cos(polar_a_radian);
	float y = temp * sin(polar_a_radian);
	return vec3(x, y, z);
}

void main() {
	vec2 polarCoords = makePolareCoords(v_uv);
	vec3 screenEyeRay = makeScreenEyeRay(polarCoords);
	gl_FragColor = vec4(screenEyeRay, 1.0);
}
`;

const sVertexAttributeNameArray = [
	"a_position",
	"a_uv",
];
const sUniformNameMap = {
	"u_fovhradian" : sFloat,
	"u_viewportWidthHeight" : sFloat2
};

export default function(in_resourceManager, in_webGLState, in_fovHRadian, in_width, in_height){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0FloatRGBA
	], in_width, in_height);
	var m_componentModel = ComponentModelScreenQuadFactory(in_resourceManager, in_webGLState);
	const m_material = MaterialWrapperFactory();
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_viewportWidthHeight = Vector2FactoryFloat32(in_width, in_height);
	const m_shaderState = {
		"u_fovhradian" : in_fovHRadian,
		"u_viewportWidthHeight" : m_viewportWidthHeight.getRaw()
	};

	const render = function(){
		m_componentRenderTarget.apply();

		m_viewportWidthHeight.setX(in_width);
		m_viewportWidthHeight.setY(in_height);

		in_webGLState.applyShader(m_shader, m_shaderState);
		in_webGLState.applyMaterial(m_material);
		in_webGLState.drawModel(m_componentModel.getModel());
	}

	render();

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
				render();
			}
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
			if (undefined !== m_componentModel){
				m_componentModel.destroy();
				m_componentModel = undefined;
			}
			return;
		}
	});

	return result;

}
