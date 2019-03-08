const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_uv;
attribute vec3 a_link0;
attribute vec3 a_link1;
attribute vec3 a_link2;
attribute vec3 a_link3;
attribute vec3 a_link4;
attribute vec3 a_link5;
attribute vec3 a_link6;
attribute vec3 a_link7;
attribute vec3 a_link8;
attribute vec3 a_link9;
attribute vec3 a_link10;
attribute vec3 a_link11;

uniform sampler2D u_samplerPos;
uniform sampler2D u_samplerForce;
uniform float u_timeDelta;
varying vec4 v_force;

vec3 SpringForce(vec3 in_uvd, vec3 in_predictedPos){
	if (0.0 == in_uvd.x){
		return vec3(0.0, 0.0, 0.0);
	}
	vec4 linkPos = texture2D(u_samplerPos, in_uvd.xy);
	vec4 linkForce = texture2D(u_samplerForce, in_uvd.xy);
	vec3 linkPredictedPos = linkPos.xyz + (linkForce.xyz * (u_timeDelta * u_timeDelta));

	vec3 offset = linkPredictedPos - in_predictedPos;
	float linkLength = length(offset);
	vec3 springNormal = offset / linkLength;
	float springLength = linkLength - in_uvd.z;
	float k = -1000.0 * in_uvd.z;
	vec3 accel = (k * springLength) * springNormal;
	vec3 force = accel * (-0.5);
	return force;
}

void main() {
	vec4 pos = texture2D(u_samplerPos, a_uv);
	vec4 force = texture2D(u_samplerForce, a_uv);
	vec3 predictedPos = pos.xyz + (force.xyz * (u_timeDelta * u_timeDelta));

	force.xyz += SpringForce(a_link0, predictedPos);
	force.xyz += SpringForce(a_link1, predictedPos);
	force.xyz += SpringForce(a_link2, predictedPos);
	force.xyz += SpringForce(a_link3, predictedPos);
	force.xyz += SpringForce(a_link4, predictedPos);
	force.xyz += SpringForce(a_link5, predictedPos);
	force.xyz += SpringForce(a_link6, predictedPos);
	force.xyz += SpringForce(a_link7, predictedPos);
	force.xyz += SpringForce(a_link8, predictedPos);
	force.xyz += SpringForce(a_link9, predictedPos);
	force.xyz += SpringForce(a_link10, predictedPos);
	force.xyz += SpringForce(a_link11, predictedPos);

	v_force = force;

	gl_Position = vec4((a_uv.x * 2.0) - 1.0, (a_uv.y * 2.0) - 1.0, 0.0, 1.0);
	gl_PointSize = 1.0; //point size is diameter
}
`;
const sFragmentShader = `
precision mediump float;
varying vec4 v_force;
void main() {
	gl_FragColor = v_force;
}
`;
const sVertexAttributeNameArray = [
	"a_uv", 
	"a_link0",
	"a_link1",
	"a_link2",
	"a_link3",
	"a_link4",
	"a_link5",
	"a_link6",
	"a_link7",
	"a_link8",
	"a_link9",
	"a_link10",
	"a_link11",
	];
const sUniformNameMap = {
	"u_samplerPos" : WebGL.ShaderUniformData.sInt,
	"u_samplerForce" : WebGL.ShaderUniformData.sInt,
	"u_timeDelta" : WebGL.ShaderUniformData.sFloat
};

const shaderFactory = function(in_webGLState){
	return WebGL.ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}

const factory = function(in_resourceManager, in_webGLState, in_state, in_modelName){
	const m_shader = shaderFactory(in_webGLState);
	const m_material = WebGL.MaterialWrapper.factory();
	const m_textureArray = [undefined, undefined];

	m_material.setTextureArray(m_textureArray);

	const m_model = in_resourceManager.getCommonReference(in_modelName, in_webGLState);
	const m_state = {
		"u_samplerPos" : 0,
		"u_samplerForce" : 1,
		"u_timeDelta" : undefined
	};

	const that = Object.create({
		"run" : function(in_taskState){
			m_textureArray[0] = in_taskState.pos.getTexture(0);
			m_textureArray[1] = in_taskState.force_in.getTexture(0);
			var renderTarget = in_taskState.force_out;

			in_webGLState.applyRenderTarget(renderTarget);
			m_state.u_timeDelta = in_state.u_timeDelta;

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			Core.Util.swap(in_taskState, "force_in", "force_out");

			return in_taskState;
		}
	});

	return that;
}

module.exports = {
	"factory" : factory,
};
