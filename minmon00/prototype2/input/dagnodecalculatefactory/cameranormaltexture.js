
/*
index input 

in_inputIndexArray:
	0: target width pixels
	1: target height pixels
	2: horizontal fov radians
	3: vertical fov radians
	4: camera transform matrix 4x4 (3x3?)

in_inputArray

output 
	//object implementing "getTexture" (returns a webglapi texture wrapper object)
	//..using "getTexture" rather than just return the texture to 
	returns a webglapi texture wrapper object
*/

import { factoryDagNodeCalculate } from "./../core/dagnode.js";
import { sFloat2 } from "./../webgl/shaderuniformtype.js"
import { sRGB, sRGBA, sUNSIGNED_BYTE, sFLOAT, sLINEAR, sNEAREST_MIPMAP_NEAREST, sCLAMP_TO_EDGE } from "./../webgl/texturetype.js"

const sVertexShader = `
precision highp float;

attribute vec2 a_position;
varying vec2 v_uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = (a_position * 0.5) + 0.5; //[0.0 ... 1.0]
}
`;

const sFragmentShader = `
precision highp float;

uniform vec2 u_fovRadian;

varying vec2 v_uv;

vec2 makePolareCoords(vec2 in_uv){
	vec2 result = vec2((in_uv.x - 0.5) * u_fovRadian.x, (in_uv.y - 0.5) * u_fovRadian.y);
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
	//gl_FragColor = vec4(screenEyeRay, 1.0);
	gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
`;

//uniform vec2 u_fovRadian;
const sVertexAttributeNameArray = ["a_position"];


export default function(in_webglApi){
	var m_renderTarget = undefined;
	var m_texture = undefined;
	var m_oldFovH = undefined;
	var m_oldFovV = undefined;

	const m_uniformArray = [
		in_webglApi.createShaderDataUniform("u_fovRadian", sFloat2 )
	];

	var m_shader = in_webglApi.getShaderManager().getShader(
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray,
		m_uniformArray
		);

	var m_geom = in_webglApi.getGeometryManager().getFullScreenQuad();
	var m_uniforValueArray = [[0.0, 0.0]];

	const Draw = function(){
		in_webglApi.setRenderTarget(m_renderTarget);
		in_webglApi.draw(m_shader, m_uniforValueArray, undefined, m_geom);
	};

	const UpdateTexture = function(in_width, in_height, in_fovH, in_fovV){
		var recreated = false;
		if ((undefined === m_renderTarget) || 
			(in_width != m_renderTarget.getWidth()) ||
			(in_height != m_renderTarget.getHeight())){
			recreated = true;
			if (undefined !== m_renderTarget){
				m_renderTarget.destroy();
				m_renderTarget = undefined;
			}

			if (undefined !== m_texture){
				m_texture.destroy();
				m_texture = undefined;
			}

			m_texture = in_webglApi.createTexture(
				in_width, 
				in_height,
				sRGBA,
				sRGBA,
				//sFLOAT, //
				sUNSIGNED_BYTE//, //
				// undefined,
				// undefined,
				// sLINEAR,
				// sNEAREST_MIPMAP_NEAREST,
				// sCLAMP_TO_EDGE,
				// sCLAMP_TO_EDGE
				);
			
			var renderData = in_webglApi.createRenderTargetDataTexture(
				m_texture,
				"FRAMEBUFFER",
				"COLOR_ATTACHMENT0",
				"TEXTURE_2D"
				);

			var renderTargetDataArray = [renderData];
			m_renderTarget = in_webglApi.createRenderTarget(
				0,
				0,
				in_width,
				in_height,
				renderTargetDataArray
				)
		}

		if (( true === recreated ) ||
			( m_oldFovH != in_fovH ) || 
			( m_oldFovV != in_fovV )){
			m_oldFovH = in_fovH;
			m_oldFovV = in_fovV;
			m_uniforValueArray[0][0] = in_fovH;
			m_uniforValueArray[0][1] = in_fovH;
			Draw();
		}
	}

	const callback = function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		const width = in_inputIndexArray[0];
		const height = in_inputIndexArray[1];
		const fovH = in_inputIndexArray[2];
		const fovV = in_inputIndexArray[3];

		UpdateTexture(width, height, fovH, fovV);

		return m_texture;
	}

	return factoryDagNodeCalculate(callback);
}
