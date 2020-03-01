/*
C:\development\prototype\web01\package\input\webgl
*/

import { factoryDagNodeCalculate } from './../../core/dagnode.js'

const sVertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = (a_position * 0.5) + 0.5; //[0.0 ... 1.0]
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler0;
void main() {
	vec4 texel = texture2D(u_sampler0, v_uv);
	texel.w = 1.0;
	gl_FragColor = texel;
	//gl_FragColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);
}
`;

//uniform vec2 u_fovRadian;
const sVertexAttributeNameArray = ["a_position"];

const dagCallback =  function(in_webglApi){
	const m_shader = in_webglApi.getShaderManager().getShader(
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray
		);

	const m_geom = in_webglApi.getGeometryManager().getFullScreenQuad();
	var m_textureArray = [ undefined ]

	const result = Object.create({
		"draw" : function(){
			in_webglApi.draw(
				m_shader, 
				undefined, 
				m_textureArray, 
				m_geom
				);

		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		m_textureArray[0] = in_inputIndexArray[0];
		return result;
	}
}

export default function(in_webglApi){
	return factoryDagNodeCalculate(dagCallback(in_webglApi));
}
