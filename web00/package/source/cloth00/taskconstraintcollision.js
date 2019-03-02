const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_uv;
uniform sampler2D u_samplerPos;
uniform sampler2D u_samplerForce;
uniform float u_timeDelta;
varying vec4 v_force;
void main() {
	vec4 pos = texture2D(u_samplerPos, a_uv);
	vec4 force = texture2D(u_samplerForce, a_uv);

	float timeDeltaSquared = u_timeDelta * u_timeDelta;
	float radius = pos.w;
	vec3 predictedPos = pos.xyz + (force.xyz * timeDeltaSquared);

	if (predictedPos.z < radius){
		if (pos.z < radius){
			//start inside case, push out
			// target z = pos.z + (force.z * u_timeDelta * u_timeDelta)
			force.z = (radius - pos.z) / timeDeltaSquared;
		} else {
			//stop movement at intersection point (friction)
			float ratio = (radius - pos.z) / (predictedPos.z - pos.z);
			force *= ratio;
		}
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
const sVertexAttributeNameArray = ["a_uv"];
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
