const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_uv;
attribute float a_canMove;
uniform sampler2D u_samplerPos;
uniform sampler2D u_samplerPosPrev;
uniform float u_timeDelta;
uniform float u_timeDeltaPrev;
varying vec4 v_force;
void main() {
	vec4 pos = texture2D(u_samplerPos, a_uv);
	vec4 posPrev = texture2D(u_samplerPosPrev, a_uv);

	vec3 acceleration = vec3(0.0, 0.0, 0.0);
	if (0.0 < u_timeDeltaPrev){
		vec3 velocity = (pos.xyz - posPrev.xyz) / u_timeDeltaPrev;
		acceleration = velocity / u_timeDelta;
	}
	vec3 gravity = vec3(0.0, 0.0, -9.8);

	float canMove = 1.0; //a_canMove
	v_force = vec4(canMove * (acceleration + gravity), canMove);

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
const sVertexAttributeNameArray = ["a_uv", "a_canMove"];
const sUniformNameMap = {
	"u_samplerPos" : WebGL.ShaderUniformData.sInt,
	"u_samplerPosPrev" : WebGL.ShaderUniformData.sInt,
	"u_timeDelta" : WebGL.ShaderUniformData.sFloat,
	"u_timeDeltaPrev" : WebGL.ShaderUniformData.sFloat
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
		"u_samplerPosPrev" : 1,
		"u_timeDelta" : undefined,
		"u_timeDeltaPrev" : undefined
	};

	const that = Object.create({
		"run" : function(in_taskState){
			m_textureArray[0] = in_taskState.pos.getTexture(0);
			m_textureArray[1] = in_taskState.pos_prev.getTexture(0);

			//we assume we are the first to write to focre, so just use input rather than output
			var renderTarget = in_taskState.force_in;

			in_webGLState.applyRenderTarget(renderTarget);
			m_state.u_timeDelta = in_state.u_timeDelta;
			m_state.u_timeDeltaPrev = in_state.u_timeDeltaPrev;

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			//Core.Util.swap(in_taskState, "force_in", "force_out");

			return in_taskState;
		}
	});

	return that;
}

module.exports = {
	"factory" : factory,
};
