const Core = require("core");
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
const sUniformNameArray = [];

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const uniformServer = undefined;
	const shader = WebGL.ShaderWrapper.factory(webGLContextWrapper, sVertexShader, sFragmentShader, uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const material = WebGL.MaterialWrapper.factoryDefault(shader);
	const webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	const posDataStream = WebGL.ModelDataStream.factory(
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
	const uvDataStream = WebGL.ModelDataStream.factory(
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

	const model = WebGL.ModelWrapper.factory(
		webGLContextWrapper, 
		"TRIANGLES",
		6,
		{
			"a_position" : posDataStream,
			"a_uv" : uvDataStream
		}
		);

	const clearColour = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	WebGL.WebGLContextWrapperHelper.clear(webGLContextWrapper, clearColour);

	material.apply(webGLContextWrapper, webGLState);
	model.draw(webGLContextWrapper, shader.getMapVertexAttribute());

	return;
}


window.addEventListener('load', onPageLoad, true);
