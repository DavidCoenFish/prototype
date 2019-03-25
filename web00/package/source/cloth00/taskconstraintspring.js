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

vec3 SpringForce(float in_targetDistance, float in_actualDistance, vec3 in_predictedPos, vec3 in_normal, vec3 in_predictedVel){
	if (0.0 == in_targetDistance){
		return vec3(0.0, 0.0, 0.0);
	}
	float springLength = in_actualDistance - in_targetDistance;
	float k = -1000.0; // * in_uvd.z;
	vec3 accel = (k * springLength) * in_normal;
	vec3 force = accel * (-0.5);
	return force;
}

vec4 makeNormalDistance(vec2 in_uv, vec3 in_predictedPos){
	if (0.0 == in_uv.x){
		return vec4(0.0, 0.0, 0.0, 0.0);
	}
	vec4 linkPos = texture2D(u_samplerPos, in_uv);
	vec4 linkForce = texture2D(u_samplerForce, in_uv);
	vec3 linkPredictedPos = linkPos.xyz + (linkForce.xyz * (u_timeDelta * u_timeDelta));

	vec3 offset = linkPredictedPos - in_predictedPos;
	float linkLength = length(offset);
	vec3 springNormal = offset / linkLength;
	return vec4(springNormal, linkLength);
}

vec4 minMaxConstraint(float in_targetDistance, float in_actualDistance, vec3 in_predictedPos, vec3 in_normal){
	if (0.0 == in_targetDistance){
		return vec4(0.0, 0.0, 0.0, 0.0);
	}
	float correctionMax = in_actualDistance - (in_targetDistance * 1.1);
	if (0.0 < correctionMax){
		return vec4(in_predictedPos + (in_normal * (correctionMax * 0.5)), 1.0);
	}
	float correctionMin = in_actualDistance - (in_targetDistance * 0.9);
	if (correctionMin < 0.0){
		return vec4(in_predictedPos + (in_normal * (correctionMin * 0.5)), 1.0);
	}

	return vec4(0.0, 0.0, 0.0, 0.0);
}

void main() {
	vec4 pos = texture2D(u_samplerPos, a_uv);
	vec4 force = texture2D(u_samplerForce, a_uv);
	vec3 predictedVel = force.xyz * u_timeDelta;
	vec3 predictedPos = pos.xyz + (predictedVel * u_timeDelta);

	//calculate state
	vec4 normalDistance0 = makeNormalDistance(a_link0.xy, predictedPos);
	vec4 normalDistance1 = makeNormalDistance(a_link1.xy, predictedPos);
	vec4 normalDistance2 = makeNormalDistance(a_link2.xy, predictedPos);
	vec4 normalDistance3 = makeNormalDistance(a_link3.xy, predictedPos);
	vec4 normalDistance4 = makeNormalDistance(a_link4.xy, predictedPos);
	vec4 normalDistance5 = makeNormalDistance(a_link5.xy, predictedPos);
	vec4 normalDistance6 = makeNormalDistance(a_link6.xy, predictedPos);
	vec4 normalDistance7 = makeNormalDistance(a_link7.xy, predictedPos);
	vec4 normalDistance8 = makeNormalDistance(a_link8.xy, predictedPos);
	vec4 normalDistance9 = makeNormalDistance(a_link9.xy, predictedPos);
	vec4 normalDistance10 = makeNormalDistance(a_link10.xy, predictedPos);
	vec4 normalDistance11 = makeNormalDistance(a_link11.xy, predictedPos);

	//add all the spring force
	force.xyz += SpringForce(a_link0.z, normalDistance0.w, predictedPos, normalDistance0.xyz, predictedVel);
	force.xyz += SpringForce(a_link1.z, normalDistance1.w, predictedPos, normalDistance1.xyz, predictedVel);
	force.xyz += SpringForce(a_link2.z, normalDistance2.w, predictedPos, normalDistance2.xyz, predictedVel);
	force.xyz += SpringForce(a_link3.z, normalDistance3.w, predictedPos, normalDistance3.xyz, predictedVel);
	force.xyz += SpringForce(a_link4.z, normalDistance4.w, predictedPos, normalDistance4.xyz, predictedVel);
	force.xyz += SpringForce(a_link5.z, normalDistance5.w, predictedPos, normalDistance5.xyz, predictedVel);
	force.xyz += SpringForce(a_link6.z, normalDistance6.w, predictedPos, normalDistance6.xyz, predictedVel);
	force.xyz += SpringForce(a_link7.z, normalDistance7.w, predictedPos, normalDistance7.xyz, predictedVel);
	force.xyz += SpringForce(a_link8.z, normalDistance8.w, predictedPos, normalDistance8.xyz, predictedVel);
	force.xyz += SpringForce(a_link9.z, normalDistance9.w, predictedPos, normalDistance9.xyz, predictedVel);
	force.xyz += SpringForce(a_link10.z, normalDistance10.w, predictedPos, normalDistance10.xyz, predictedVel);
	force.xyz += SpringForce(a_link11.z, normalDistance11.w, predictedPos, normalDistance11.xyz, predictedVel);

	//force.xyz *= max(0.0, (1.0 - (u_timeDelta * 0.1)));
	
	//take the average of the max/ min constraint and move to it, if there is one
	vec4 sumTarget = vec4(0.0, 0.0, 0.0, 0.0);
	sumTarget += minMaxConstraint(a_link0.z, normalDistance0.w, predictedPos, normalDistance0.xyz);
	sumTarget += minMaxConstraint(a_link1.z, normalDistance1.w, predictedPos, normalDistance1.xyz);
	sumTarget += minMaxConstraint(a_link2.z, normalDistance2.w, predictedPos, normalDistance2.xyz);
	sumTarget += minMaxConstraint(a_link3.z, normalDistance3.w, predictedPos, normalDistance3.xyz);
	sumTarget += minMaxConstraint(a_link4.z, normalDistance4.w, predictedPos, normalDistance4.xyz);
	sumTarget += minMaxConstraint(a_link5.z, normalDistance5.w, predictedPos, normalDistance5.xyz);
	sumTarget += minMaxConstraint(a_link6.z, normalDistance6.w, predictedPos, normalDistance6.xyz);
	sumTarget += minMaxConstraint(a_link7.z, normalDistance7.w, predictedPos, normalDistance7.xyz);
	sumTarget += minMaxConstraint(a_link8.z, normalDistance8.w, predictedPos, normalDistance8.xyz);
	sumTarget += minMaxConstraint(a_link9.z, normalDistance9.w, predictedPos, normalDistance9.xyz);
	sumTarget += minMaxConstraint(a_link10.z, normalDistance10.w, predictedPos, normalDistance10.xyz);
	sumTarget += minMaxConstraint(a_link11.z, normalDistance11.w, predictedPos, normalDistance11.xyz);
	if (0.0 < sumTarget.w){
		sumTarget.xyz /= sumTarget.w;
		vec3 targetForce = (sumTarget.xyz - pos.xyz) / (u_timeDelta * u_timeDelta);
		//force.xyz = (0.8 * targetForce) + (0.2 * force.xyz);
		force.xyz = (0.9 * targetForce) + (0.1 * force.xyz);
		//force.xyz = targetForce;
	}

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
