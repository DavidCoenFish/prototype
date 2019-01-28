const WebGL = require("webgl");

	// input [prev_pos, collision_resolved_force_sum]
	// output [new_pos]

const sVertexShaserSource = `
attribute vec2 a_uv;
varying vec4 v_sphere;
uniform sampler2D u_samplerPrevPos;
uniform sampler2D u_samplerForceSum;
uniform float u_timeStep;
void main() {
	vec4 prevPos = texture2D(u_samplerPrevPos, a_uv);
	vec4 forceSum = texture2D(u_samplerForceSum, a_uv);

	v_sphere.xyz = prevPos.xyz + (forceSum.xyz * u_timeStep * u_timeStep);
	v_sphere.w = prevPos.w;

	gl_Position = vec4((a_uv.x * 2.0) - 1.0, (a_uv.y * 2.0) - 1.0, 0.0, 1.0);
	gl_PointSize = 1.0; //point size is diameter
}
`;
const sFragmentShaderSource = `
precision mediump float;
varying vec4 v_sphere;
void main() {
	gl_FragColor = v_sphere;
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
	const m_material = WebGL.MaterialWrapper.factory(m_shader, [in_dataServer.getTexturePrevPos(), in_dataServer.getTextureCollisionResolvedForceSum()]);
	const m_model = in_resourceManager.getCommonReference("model", in_webGLContextWrapper);

	const m_renderTargetData = WebGL.RenderTargetData.factory(in_dataServer.getTextureNewPos(), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D");
	const m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper, [m_renderTargetData]);

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			m_renderTargetData.setTextureWrapper(in_dataServer.getTextureNewPos());
			m_renderTarget.apply(in_webGLContextWrapper);

			m_material.setTextureArray([in_dataServer.getTexturePrevPos(), in_dataServer.getTextureCollisionResolvedForceSum()]);
			m_material.apply(in_webGLContextWrapper, in_webGLState);
			m_model.draw(in_webGLContextWrapper, in_webGLState.getMapVertexAttribute());

			WebGL.WebGLContextWrapperHelper.resetRenderTarget(in_webGLContextWrapper);
		},
	})

	return result;
}

module.exports = {
	"factory" : factory
}