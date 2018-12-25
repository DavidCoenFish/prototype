/* 
	render to screen the given texture
*/

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
const sFragmentShader = `
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform vec2 u_widthHeight;
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
	float minDistance = 1000.0;
	for (int yOffset = -2; yOffset <= 2; ++yOffset){
		for (int xOffset = -2; xOffset <= 2; ++xOffset){
			vec2 rawGrid = vec2(sampleFloor.x + float(xOffset), sampleFloor.y + float(yOffset));
			vec2 noiseOffset = hash22(rawGrid);
			vec2 grid = vec2(rawGrid.x, rawGrid.y + (mod(float(xOffset) + sampleFloor.x, 2.0) * 0.5)) + noiseOffset;
			float dist = length(sample - grid);
			minDistance = min(minDistance, dist);
		}
	}
	return 1.0 - (minDistance * minDistance);
}

float sampleHeight(vec2 in_uv){
	float height = texture2D(u_sampler0, in_uv).x;
	if (height < 0.25){
		height = cellNoise(in_uv * 50.0) * 0.25;
	}
	return height;
}

void main() {
	vec2 uvStep = vec2(1.0 / u_widthHeight.x, 1.0 / u_widthHeight.y);
	float height0 = sampleHeight(v_uv);
	float height1 = sampleHeight(v_uv - vec2(uvStep.x, 0.0)) - height0;
	float height2 = sampleHeight(v_uv - vec2(0.0, uvStep.y)) - height0;
	float height3 = sampleHeight(v_uv + vec2(uvStep.x, 0.0)) - height0;
	float height4 = sampleHeight(v_uv + vec2(0.0, uvStep.y)) - height0;
	float offset = 0.25;
	vec3 cross1 = cross(vec3(offset, 0, height1), vec3(0, offset, height2));
	vec3 cross2 = cross(vec3(offset, 0, -height3), vec3(0, offset, -height4));
	vec3 normal = normalize(cross1 + cross2);
	vec2 envMapUV = (normal.xy * 0.5) + 0.5;

	vec4 texel = texture2D(u_sampler1, envMapUV);

	vec2 edgeShade = max(10.0 * max(vec2(1.0, 1.0) - v_uv, v_uv) - vec2(9.0), 0.0);
	float drop = 1.0 - max(edgeShade.x, edgeShade.y);

	float shade = 1.0 - (max(0.0, height1) + max(0.0, height2) + max(0.0, height3) + max(0.0, height4));
	if (height0 < 0.275){
		shade *= 0.25;
	} else {
		drop = min(1.0, drop + 0.5);
	}

	gl_FragColor = texel * shade * drop;
}
`;



/*
	const vec2 uvStep = vec2(1.0 / u_widthHeight.x, 1.0 / u_widthHeight.y);
	float height0 = texture2D(u_sampler0, v_uv).x;
	float height1 = texture2D(u_sampler0, v_uv - vec2(uvStep.x))).x - height0;
	float height2 = texture2D(u_sampler0, v_uv - vec2(uvStep.y))).x - height0;
	float height3 = texture2D(u_sampler0, v_uv + vec2(uvStep.x))).x - height0;
	float height4 = texture2D(u_sampler0, v_uv + vec2(uvStep.y))).x - height0;

	vec3 normal = normalise(cross(vec3(1.0/255.0, 0, height1), vec3(0, 1.0/255.0, height2)) + cross(vec3(0, 1.0/255.0, height4), vec3(1.0/255.0, 0, height3)));
	vec3 envMapUV = (normal.xy * 0.5) + 0.5;

	gl_FragColor = vec4(envMapUV.x, envMapUV.y, 0.0, 1.0);

 */

//	gl_FragColor = texture2D(u_sampler1, envMapUV);

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameArray = ["u_sampler0", "u_sampler1", "u_widthHeight"];

const factory = function(in_webGLContextWrapper, in_textureWrapper, in_width, in_height, in_resourceManager){
	const m_widthHeight = Core.Vector2.factoryFloat32(in_width, in_height);
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sampler0"){
				//console.log("uniformServer:u_sampler0");
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_sampler1"){
				//console.log("uniformServer:u_sampler1");
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 1);
			} else if (in_key === "u_widthHeight"){
				//console.log("uniformServer:u_widthHeight");
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_widthHeight.getRaw());
			}
			return;
		}
	};
	const m_shader = WebGL.ShaderWrapper.factory(in_webGLContextWrapper, sVertexShader, sFragmentShader, m_uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const m_envMapTexture = in_resourceManager.getCommonReference("envMap", in_webGLContextWrapper);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shader, [in_textureWrapper, m_envMapTexture]);

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
			//in_typeName,in_elementsPerVertex,in_arrayData,in_usageName,in_normalise

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
		in_webGLContextWrapper, 
		"TRIANGLES",
		6,
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream
		}
	);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			WebGL.WebGLContextWrapperHelper.resetRenderTarget(localWebGLContextWrapper);

			m_material.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, m_shader.getMapVertexAttribute());
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
