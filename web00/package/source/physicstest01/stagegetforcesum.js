const WebGL = require("webgl");

//	input [prev_prev_pos, prev_pos]
//	output [force_sum]
//	(gravity, velocity)


const sVertexShaserSource = `
attribute vec2 a_uv;
attribute vec3 a_link0;
attribute vec3 a_link1;
attribute vec3 a_link2;
attribute vec3 a_link3;
attribute vec3 a_link4;
attribute vec3 a_link5;
attribute vec3 a_link6;
attribute vec3 a_link7;

varying vec3 v_forceSum;

uniform sampler2D u_samplerPrevPrevPos;
uniform sampler2D u_samplerPrevPos;
uniform float u_timeStep;

vec3 forceFromLink(vec3 in_link, vec4 in_position){
	if (0.0 == in_link.x){
		return vec3(0.0, 0.0, 0.0);
	}
	vec4 positionLink = texture2D(u_samplerPrevPos, in_link.xy);
	vec3 offset = positionLink.xyz - in_position.xyz;
	float len = length(offset);
	if (0.0 == len){
		return vec3(0.0, 0.0, 0.0);
	}
	offset /= len;
	len -= in_link.z;
	len *= 0.5;
	vec3 targetOffset = (offset * len);
	//vec3 force = targetOffset / (u_timeStep * u_timeStep);
	vec3 force = targetOffset / u_timeStep;
	return force;
}

void main() {
	vec4 positionPrev = texture2D(u_samplerPrevPos, a_uv);
	vec4 positionPrevPrev = texture2D(u_samplerPrevPrevPos, a_uv);
	vec3 velocity = (positionPrev.xyz - positionPrevPrev.xyz) / u_timeStep;
	vec3 vAccel = velocity / u_timeStep;
	vec3 gravity = vec3(0.0, 0.0, -9.8);

	vec3 forceSum = vAccel + gravity;
	forceSum += forceFromLink(a_link0, positionPrev);
	forceSum += forceFromLink(a_link1, positionPrev);
	forceSum += forceFromLink(a_link2, positionPrev);
	forceSum += forceFromLink(a_link3, positionPrev);
	forceSum += forceFromLink(a_link4, positionPrev);
	forceSum += forceFromLink(a_link5, positionPrev);
	forceSum += forceFromLink(a_link6, positionPrev);
	forceSum += forceFromLink(a_link7, positionPrev);

	v_forceSum = forceSum;

	gl_Position = vec4((a_uv.x * 2.0) - 1.0, (a_uv.y * 2.0) - 1.0, 0.0, 1.0);
	gl_PointSize = 1.0; //point size is diameter
}
`;
const sFragmentShaderSource = `
precision mediump float;
varying vec3 v_forceSum;
void main() {
	gl_FragColor = vec4(v_forceSum.x, v_forceSum.y, v_forceSum.z, 1.0);
	//gl_FragColor = vec4(100.0, 100.0, 100.0, 1.0);
}
`;
const sVertexAttributeNameArray = ["a_uv", "a_link0", "a_link1", "a_link2", "a_link3", "a_link4", "a_link5", "a_link6", "a_link7"];
const sUniformNameArray = ["u_samplerPrevPrevPos", "u_samplerPrevPos", "u_timeStep"];

const factory = function(in_resourceManager, in_webGLContextWrapper, in_webGLState, in_dataServer){
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_samplerPrevPrevPos"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_samplerPrevPos"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 1);
			} else if (in_key === "u_timeStep"){
				var m_timeDelta = in_dataServer.getTimeDelta();
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_timeDelta);
			}
		}
	};
	const m_shader = WebGL.ShaderWrapper.factory(in_webGLContextWrapper, sVertexShaserSource, sFragmentShaderSource, m_uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const m_material = WebGL.MaterialWrapper.factory(m_shader, [in_dataServer.getTexturePrevPrevPos(), in_dataServer.getTexturePrevPos()]);
	const m_model = in_resourceManager.getCommonReference("model", in_webGLContextWrapper);

	const m_renderTargetData = WebGL.RenderTargetData.factory(in_dataServer.getTextureForceSum(), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D");
	const m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper, in_dataServer.getTextureForceSum().getWidth(), in_dataServer.getTextureForceSum().getHeight(), [m_renderTargetData]);

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			m_renderTarget.apply(in_webGLContextWrapper, in_webGLState);

			m_material.setTextureArray([in_dataServer.getTexturePrevPrevPos(), in_dataServer.getTexturePrevPos()]);
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