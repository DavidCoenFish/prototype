/* */
import modelScreenQuadFactory from "./../webgl/component-model-screen-quad.js"
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat, sFloat2, sFloat3} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';
import {factoryFloat32 as Vector3FactoryFloat32} from './../core/vector3.js';

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

uniform sampler2D u_sampler0;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec2 u_sunAzimuthAltitude; //degrees
uniform vec3 u_sunTint;
uniform vec2 u_sunRange; //degrees
uniform vec3 u_skyTint;
uniform vec3 u_groundTint;
uniform vec3 u_fogTint;
uniform float u_skySpread;
uniform float u_skyTurbitity;

varying vec2 v_uv;

vec3 makeViewNorm(vec3 in_screenEyeRay){
	return ((-(in_screenEyeRay.x) * u_cameraLeft) +
		(in_screenEyeRay.y * u_cameraUp) +
		(in_screenEyeRay.z * u_cameraAt));
}

//angles in degrees
vec3 calcSkyDomeColor(float gamma){
	float ratio = (1.0 - smoothstep(u_sunRange.x, u_sunRange.y, gamma));
	vec3 sky = u_skyTint * exp(u_skySpread * radians(gamma));
	vec3 result = mix(sky, u_sunTint, ratio);
	return result;
}

void main() {
	vec3 screenEyeRay = texture2D(u_sampler0, v_uv).xyz;
	vec3 viewNorm = makeViewNorm(screenEyeRay);

	float sunZ = sin(radians(u_sunAzimuthAltitude.y));
	float sunXY = cos(radians(u_sunAzimuthAltitude.y));
	vec3 sunNorm = vec3(cos(radians(u_sunAzimuthAltitude.x)) * sunXY, sin(radians(u_sunAzimuthAltitude.x)) * sunXY, sunZ);

	float angleSunViewDegrees = degrees(acos(dot(viewNorm, sunNorm)));

	vec3 skyDomeColor = calcSkyDomeColor(angleSunViewDegrees) + ((1.0 - viewNorm.z) * 0.25);
	float fog = (1.0 - abs(viewNorm.z));
	fog = max(0.0, min(1.0, pow(fog, u_skyTurbitity)));
	vec3 rgb = mix((u_groundTint - (viewNorm.z * 0.5)), skyDomeColor, step(0.0, viewNorm.z));
	rgb = mix(rgb, u_fogTint, fog);
	gl_FragColor = vec4(rgb, 1.0);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {
	"u_sampler0" : sInt,
	"u_viewportWidthHeight" : sFloat2,
	"u_cameraAt" : sFloat3, 
	"u_cameraUp" : sFloat3, 
	"u_cameraLeft" : sFloat3, 
	"u_cameraPos" : sFloat3,
	"u_sunAzimuthAltitude" : sFloat2,
	"u_sunTint" : sFloat3,
	"u_sunRange" : sFloat2,
	"u_skyTint" : sFloat3,
	"u_fogTint" : sFloat3,
	"u_groundTint" : sFloat3,
	"u_skySpread" : sFloat,
	"u_skyTurbitity" : sFloat
};

export default function(in_resourceManager, in_webGLState, in_state, in_texture){
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
		true, //in_depthFuncEnabledOrUndefined,
		"ALWAYS", //in_depthFuncEnumNameOrUndefined
		undefined, //in_frontFaceEnumNameOrUndefined, //"CW", "CCW"
		true, //in_colorMaskRedOrUndefined, //true
		true, //in_colorMaskGreenOrUndefined, //true
		true, //in_colorMaskBlueOrUndefined, //true
		true, //in_colorMaskAlphaOrUndefined, //false
		true, //in_depthMaskOrUndefined, //false
		false //in_stencilMaskOrUndefined //false
	);

	const m_sunAzimuthAltitude = Vector2FactoryFloat32(-90.0, 45.0);
	const m_sunTint = Vector3FactoryFloat32(255.0/255.0, 245.0/255.0, 235.0/255.0);
	const m_sunRange = Vector2FactoryFloat32(1.0, 5.0); 
	const m_skyTint = Vector3FactoryFloat32(10.0/255.0, 10.0/255.0, 255.0/255.0);
	const m_groundTint = Vector3FactoryFloat32(32.0/255.0, 16.0/255.0, 2.0/255.0);
	const m_fogTint = Vector3FactoryFloat32(200.0/255.0, 200.0/255.0, 200.0/255.0);
	const m_skySpread = -0.5; //-0.9;
	const m_skyTurbitity = 10.0;

	const m_state = {
		"u_sampler0" : 0,
		"u_sunAzimuthAltitude" : m_sunAzimuthAltitude.getRaw(),
		"u_sunTint" : m_sunTint.getRaw(),
		"u_sunRange" : m_sunRange.getRaw(),
		"u_skyTint" : m_skyTint.getRaw(),
		"u_groundTint" : m_groundTint.getRaw(),
		"u_fogTint" : m_fogTint.getRaw(),
		"u_skySpread" : m_skySpread,
		"u_skyTurbitity" : m_skyTurbitity
	};

	//public methods ==========================
	const that = Object.create({
		"draw" : function(){
			var state = Object.assign({}, m_state, in_state);
			in_webGLState.applyShader(m_shader, state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_modelComponent.getModel());
			return;
		},
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
			return;
		},
		"getFogTint" : function(){
			return m_fogTint;
		},
		"destroy" : function(){
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
