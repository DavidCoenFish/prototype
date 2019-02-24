const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;
/*

ad = 0.5
dc = 0.86602540378443864676372317075294
tan(30) = ad / dc
1/dc = 1.1547005383792515290182975610039

	a
	|
	d		c
	|
	b

	//float originX = floor(sample.x);
	//float originY = floor(sample.y -0.25 + (mod(originX, 2.0) * 0.5));
	//float minDistance = (mod(originX, 2.0) * 0.5) + (mod(originY, 2.0) * 0.5);

float cellNoise(vec2 in_uv){
	vec2 sample = vec2(in_uv.x * 1.1547005383792515290182975610039, in_uv.y);

	float minDistance = 1000.0;
	for (int yOffset = 0; yOffset < 3; ++yOffset){
		for (int xOffset = 0; xOffset < 3; ++xOffset){
			vec2 grid = vec2(float(xOffset), float(yOffset) + (mod(float(xOffset), 2.0) * 0.5));
			float dist = length(sample - grid);
			minDistance = min(minDistance, dist);
		}
	}
	return minDistance;
}

 */
const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;

// Hash without Sine
// Creative Commons Attribution-ShareAlike 4.0 International Public License
// Created by David Hoskins.
// https://www.shadertoy.com/view/4djSRW
#define HASHSCALE3 vec3(443.897, 441.423, 437.195)
vec2 hash22(vec2 in_input){
	vec3 p3 = fract(vec3(in_input.xyx) * HASHSCALE3);
	p3 += dot(p3, p3.yzx+19.19);
	return fract((p3.xx+p3.yz)*p3.zy);
}

float cellNoise(vec2 in_uv){
	vec2 sample = vec2(in_uv.x * 1.1547005383792515290182975610039, in_uv.y);
	vec2 sampleFloor = floor(sample);

	// based on concept from inigo quilez <http://iquilezles.org/www/articles/voronoise/voronoise.htm>
	float minDistance = 10000.0;
	for (int yOffset = -2; yOffset <= 2; ++yOffset){
		for (int xOffset = -2; xOffset <= 2; ++xOffset){
			vec2 rawGrid = vec2(sampleFloor.x + float(xOffset), sampleFloor.y + float(yOffset));
			vec2 noiseOffset = (hash22(rawGrid) - 0.5) * 1.5;
			vec2 offset = sample - (vec2(rawGrid.x, rawGrid.y + (mod(float(xOffset) + sampleFloor.x, 2.0) * 0.5)) + noiseOffset);
			float distSquared = dot(offset, offset);
			minDistance = min(minDistance, distSquared);
		}
	}
	return sqrt(minDistance);
}

void main() {
	float value = 1.0 - cellNoise(v_uv * 30.0); 
	gl_FragColor = vec4(value, value, value, 1.0);
}

`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];

const onPageLoad = function(){
	console.info("onPageLoad");

	const m_canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(document, 256, 256);
	const m_webGLState = WebGL.WebGLState.factory(m_canvaseElementWrapper.getElement());

	const m_shader = WebGL.ShaderWrapper.factory(m_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray);
	const m_material = WebGL.MaterialWrapper.factory();

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
	const m_uvDataStream = WebGL.ModelDataStream.factory(
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
		m_webGLState, 
		"TRIANGLES",
		6,
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream
		}
		);

	const clearColour = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	m_webGLState.clear(clearColour);

	m_webGLState.applyShader(m_shader);
	m_webGLState.applyMaterial(m_material);
	m_webGLState.drawModel(m_model);

	return;
}


window.addEventListener('load', onPageLoad, true);
