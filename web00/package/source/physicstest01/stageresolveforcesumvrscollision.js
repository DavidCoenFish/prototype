const WebGL = require("webgl");

// input [prev_pos, force_sum]
// output [collision_resolved_force_sum]
// (if force would result in penetration, add force to counteract. todo: friction)

const sVertexShaserSource = `
attribute vec2 a_uv;
varying vec3 v_forceSum;
uniform sampler2D u_samplerPrevPos;
uniform sampler2D u_samplerForceSum;
uniform float u_timeStep;
void main() {
	vec4 prevPos = texture2D(u_samplerPrevPos, a_uv);
	vec4 forceSum = texture2D(u_samplerForceSum, a_uv);
	float radius = prevPos.w / 2.0;
	float predectedHeight = prevPos.z + (forceSum.z * u_timeStep * u_timeStep);

	float height = predectedHeight - radius;
	if (height < 0.0){
		//float targetDisplacment = min(predectedHeight + radius, radius) - prevPos.z;
		float targetDisplacment = radius - prevPos.z;
		forceSum.z = targetDisplacment / (u_timeStep * u_timeStep);
	}

	v_forceSum = forceSum.xyz;

	gl_Position = vec4((a_uv.x * 2.0) - 1.0, (a_uv.y * 2.0) - 1.0, 0.0, 1.0);
	gl_PointSize = 1.0; //point size is diameter
}
`;
const sFragmentShaderSource = `
precision mediump float;
varying vec3 v_forceSum;
void main() {
	gl_FragColor = vec4(v_forceSum.x, v_forceSum.y, v_forceSum.z, 1.0);
}
`;
const sVertexAttributeNameArray = ["a_uv"];
const sUniformNameArray = ["u_samplerPrevPos", "u_samplerForceSum", "u_timeStep"];

const factory = function(in_resourceManager, in_webGLContextWrapper, in_webGLState, in_dataServer){
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_samplerPrevPos"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_samplerForceSum"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 1);
			} else if (in_key === "u_timeStep"){
				var m_timeDelta = in_dataServer.getTimeDelta();
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_timeDelta);
			}
		}
	};
	const m_shader = WebGL.ShaderWrapper.factory(in_webGLContextWrapper, sVertexShaserSource, sFragmentShaderSource, m_uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const m_material = WebGL.MaterialWrapper.factory(m_shader, [in_dataServer.getTexturePrevPos(), in_dataServer.getTextureForceSum()]);
	const m_model = in_resourceManager.getCommonReference("model", in_webGLContextWrapper);

	const m_renderTargetData = WebGL.RenderTargetData.factory(in_dataServer.getTextureCollisionResolvedForceSum(), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D");
	const m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper, in_dataServer.getTextureCollisionResolvedForceSum().getWidth(), in_dataServer.getTextureCollisionResolvedForceSum().getHeight(), [m_renderTargetData]);

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			m_renderTarget.apply(in_webGLContextWrapper, in_webGLState);

			m_material.setTextureArray([in_dataServer.getTexturePrevPos(), in_dataServer.getTextureForceSum()]);
			m_material.apply(in_webGLContextWrapper, in_webGLState);
			m_model.draw(in_webGLContextWrapper, in_webGLState.getMapVertexAttribute());

			WebGL.WebGLContextWrapperHelper.resetRenderTarget(in_webGLContextWrapper, in_webGLState);
		},
	})

	return result;
}

module.exports = {
	"factory" : factory
}