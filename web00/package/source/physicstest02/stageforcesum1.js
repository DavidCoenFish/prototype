const WebGL = require("webgl");

// input [prev_pos, force_sum]
// output [collision_resolved_force_sum]
// (if force would result in penetration, add force to counteract. todo: friction)

const sVertexShaserSource = `
attribute vec2 a_uv;
attribute vec4 a_linkUv0;
attribute vec4 a_linkUv1;
attribute vec4 a_linkUv2;
attribute vec4 a_linkUv3;
attribute vec4 a_linkUv4;
attribute vec4 a_linkUv5;

uniform sampler2D u_samplerPrevPos;
uniform sampler2D u_samplerForceSum;
uniform sampler2D u_samplerVolumeData0;
uniform sampler2D u_samplerVolumeData1;
uniform sampler2D u_samplerVolumeData2;
uniform sampler2D u_samplerVolumeData3;
uniform sampler2D u_samplerVolumeData4;
uniform float u_timeStep;

varying vec3 v_forceSum;

float getVolume(vec3 in_vertexA, vec3 in_vertexB, vec3 in_vertexC){
	float volume = dot(in_vertexA, cross(in_vertexB, in_vertexC));
	return volume;
}

vec3 getVolumeSpringForce(float in_volume, vec3 in_vertexA, vec3 in_vertexB, vec3 in_vertexC, vec3 in_vertexD) {
	if (in_volume == 0.0){
		return vec3(0.0, 0.0, 0.0);
	}
	float volume = getVolume(in_vertexA - in_vertexB, in_vertexA - in_vertexC, in_vertexA - in_vertexD);
	//float volume = getVolume(in_vertexB - in_vertexA, in_vertexC - in_vertexA, in_vertexD - in_vertexA);

	vec3 midPoint = (in_vertexA + in_vertexB + in_vertexC + in_vertexD) * 0.25;
	vec3 offset = in_vertexA - midPoint;
	float lengthMidpointToA = length(offset);
	if (lengthMidpointToA == 0.0){
		return vec3(0.0, 0.0, 0.0);
	}
	vec3 forceNormal = offset / lengthMidpointToA;
	float desiredLength = (lengthMidpointToA / in_volume) / volume;
	vec3 desiredMove = in_vertexA - (midPoint + (desiredLength * forceNormal));

	vec3 force = (desiredMove / (u_timeStep * u_timeStep)) * 0.25;

	return force;
}

void main() {
	float timeStepSquared = u_timeStep * u_timeStep;

	vec4 prevPos = texture2D(u_samplerPrevPos, a_uv);
	vec4 forceSum = texture2D(u_samplerForceSum, a_uv);
	vec4 volumeData0 = texture2D(u_samplerVolumeData0, a_uv);
	vec4 volumeData1 = texture2D(u_samplerVolumeData1, a_uv);
	vec4 volumeData2 = texture2D(u_samplerVolumeData2, a_uv);
	vec4 volumeData3 = texture2D(u_samplerVolumeData3, a_uv);
	vec4 volumeData4 = texture2D(u_samplerVolumeData4, a_uv);

	//links
	vec4 prevPos0 = texture2D(u_samplerPrevPos, vec2(a_linkUv0.x, a_linkUv0.y));
	vec4 forceSum0 = texture2D(u_samplerForceSum, vec2(a_linkUv0.x, a_linkUv0.y));
	vec3 targetPos0 = prevPos0.xyz + (forceSum0.xyz * timeStepSquared);
	vec4 prevPos1 = texture2D(u_samplerPrevPos, vec2(a_linkUv0.z, a_linkUv0.w));
	vec4 forceSum1 = texture2D(u_samplerForceSum, vec2(a_linkUv0.z, a_linkUv0.w));
	vec3 targetPos1 = prevPos1.xyz + (forceSum1.xyz * timeStepSquared);
	vec4 prevPos2 = texture2D(u_samplerPrevPos, vec2(a_linkUv1.x, a_linkUv1.y));
	vec4 forceSum2 = texture2D(u_samplerForceSum, vec2(a_linkUv1.x, a_linkUv1.y));
	vec3 targetPos2 = prevPos2.xyz + (forceSum2.xyz * timeStepSquared);
	vec4 prevPos3 = texture2D(u_samplerPrevPos, vec2(a_linkUv1.z, a_linkUv1.w));
	vec4 forceSum3 = texture2D(u_samplerForceSum, vec2(a_linkUv1.z, a_linkUv1.w));
	vec3 targetPos3 = prevPos3.xyz + (forceSum3.xyz * timeStepSquared);
	vec4 prevPos4 = texture2D(u_samplerPrevPos, vec2(a_linkUv2.x, a_linkUv2.y));
	vec4 forceSum4 = texture2D(u_samplerForceSum, vec2(a_linkUv2.x, a_linkUv2.y));
	vec3 targetPos4 = prevPos4.xyz + (forceSum4.xyz * timeStepSquared);
	vec4 prevPos5 = texture2D(u_samplerPrevPos, vec2(a_linkUv2.z, a_linkUv2.w));
	vec4 forceSum5 = texture2D(u_samplerForceSum, vec2(a_linkUv2.z, a_linkUv2.w));
	vec3 targetPos5 = prevPos5.xyz + (forceSum5.xyz * timeStepSquared);
	vec4 prevPos6 = texture2D(u_samplerPrevPos, vec2(a_linkUv3.x, a_linkUv3.y));
	vec4 forceSum6 = texture2D(u_samplerForceSum, vec2(a_linkUv3.x, a_linkUv3.y));
	vec3 targetPos6 = prevPos6.xyz + (forceSum6.xyz * timeStepSquared);
	vec4 prevPos7 = texture2D(u_samplerPrevPos, vec2(a_linkUv3.z, a_linkUv3.w));
	vec4 forceSum7 = texture2D(u_samplerForceSum, vec2(a_linkUv3.z, a_linkUv3.w));
	vec3 targetPos7 = prevPos7.xyz + (forceSum7.xyz * timeStepSquared);
	vec4 prevPos8 = texture2D(u_samplerPrevPos, vec2(a_linkUv4.x, a_linkUv4.y));
	vec4 forceSum8 = texture2D(u_samplerForceSum, vec2(a_linkUv4.x, a_linkUv4.y));
	vec3 targetPos8 = prevPos8.xyz + (forceSum8.xyz * timeStepSquared);
	vec4 prevPos9 = texture2D(u_samplerPrevPos, vec2(a_linkUv4.z, a_linkUv4.w));
	vec4 forceSum9 = texture2D(u_samplerForceSum, vec2(a_linkUv4.z, a_linkUv4.w));
	vec3 targetPos9 = prevPos9.xyz + (forceSum9.xyz * timeStepSquared);
	vec4 prevPos10 = texture2D(u_samplerPrevPos, vec2(a_linkUv5.x, a_linkUv5.y));
	vec4 forceSum10 = texture2D(u_samplerForceSum, vec2(a_linkUv5.x, a_linkUv5.y));
	vec3 targetPos10 = prevPos10.xyz + (forceSum10.xyz * timeStepSquared);
	vec4 prevPos11 = texture2D(u_samplerPrevPos, vec2(a_linkUv5.z, a_linkUv5.w));
	vec4 forceSum11 = texture2D(u_samplerForceSum, vec2(a_linkUv5.z, a_linkUv5.w));
	vec3 targetPos11 = prevPos11.xyz + (forceSum11.xyz * timeStepSquared);

	vec3 forceSumTotal = forceSum.xyz; //vec3(0.0, 0.0, 0.0);
	vec3 targetPos = prevPos.xyz + (forceSum.xyz * timeStepSquared);

	//volume sprint
	//0:[0,1,2],
	forceSumTotal += getVolumeSpringForce(volumeData0.x, targetPos, targetPos0, targetPos1, targetPos2);
	//1:[0,2,5],
	forceSumTotal += getVolumeSpringForce(volumeData0.y, targetPos, targetPos0, targetPos2, targetPos5);
	//2:[0,3,4],
	forceSumTotal += getVolumeSpringForce(volumeData0.z, targetPos, targetPos0, targetPos3, targetPos4);
	//3:[0,4,1],
	forceSumTotal += getVolumeSpringForce(volumeData0.w, targetPos, targetPos0, targetPos4, targetPos1);
	//4:[0,5,3],
	forceSumTotal += getVolumeSpringForce(volumeData1.x, targetPos, targetPos0, targetPos5, targetPos3);
	//5:[1,4,6],
	forceSumTotal += getVolumeSpringForce(volumeData1.y, targetPos, targetPos1, targetPos4, targetPos6);
	//6:[1,6,2],
	forceSumTotal += getVolumeSpringForce(volumeData1.z, targetPos, targetPos1, targetPos6, targetPos2);
	//7:[2,6,8],
	forceSumTotal += getVolumeSpringForce(volumeData1.w, targetPos, targetPos2, targetPos6, targetPos8);
	//8:[2,7,5],
	forceSumTotal += getVolumeSpringForce(volumeData2.x, targetPos, targetPos2, targetPos7, targetPos5);
	//9:[2,8,7],
	forceSumTotal += getVolumeSpringForce(volumeData2.y, targetPos, targetPos2, targetPos8, targetPos7);
	//10:[3,5,9],
	forceSumTotal += getVolumeSpringForce(volumeData2.z, targetPos, targetPos3, targetPos5, targetPos9);
	//11:[3,9,4],
	forceSumTotal += getVolumeSpringForce(volumeData2.w, targetPos, targetPos3, targetPos9, targetPos4);
	//12:[4,9,10],
	forceSumTotal += getVolumeSpringForce(volumeData3.x, targetPos, targetPos4, targetPos9, targetPos10);
	//13:[4,10,6],
	forceSumTotal += getVolumeSpringForce(volumeData3.y, targetPos, targetPos4, targetPos10, targetPos6);
	//14:[5,7,9],
	forceSumTotal += getVolumeSpringForce(volumeData3.z, targetPos, targetPos5, targetPos7, targetPos9);
	//15:[6,10,8],
	forceSumTotal += getVolumeSpringForce(volumeData3.w, targetPos, targetPos6, targetPos10, targetPos8);
	//16:[7,8,11],
	forceSumTotal += getVolumeSpringForce(volumeData4.x, targetPos, targetPos7, targetPos8, targetPos11);
	//17:[7,11,9],
	forceSumTotal += getVolumeSpringForce(volumeData4.y, targetPos, targetPos7, targetPos11, targetPos9);
	//18:[8,10,11],
	forceSumTotal += getVolumeSpringForce(volumeData4.z, targetPos, targetPos8, targetPos10, targetPos11);
	//19:[9,11,10]
	forceSumTotal += getVolumeSpringForce(volumeData4.w, targetPos, targetPos9, targetPos11, targetPos10);

	v_forceSum = forceSumTotal;
	gl_Position = vec4((a_uv.x * 2.0) - 1.0, (a_uv.y * 2.0) - 1.0, 0.0, 1.0);
	gl_PointSize = 1.0; //point size is diameter
}
`;


const sVertexShaserSource1 = `
attribute vec2 a_uv;
attribute vec4 a_linkUv0;
attribute vec4 a_linkUv1;

uniform sampler2D u_samplerPrevPos;
uniform sampler2D u_samplerForceSum;
uniform sampler2D u_samplerVolumeData0;

uniform float u_timeStep;

varying vec3 v_forceSum;

float getVolume(vec3 in_vertexA, vec3 in_vertexB, vec3 in_vertexC){
	float volume = dot(in_vertexA, cross(in_vertexB, in_vertexC));
	return volume;
}

vec3 getVolumeSpringForce(float in_volume, vec3 in_vertexA, vec3 in_vertexB, vec3 in_vertexC, vec3 in_vertexD) {
	if (in_volume == 0.0){
		return vec3(0.0, 0.0, 0.0);
	}
	float volume = getVolume(in_vertexA - in_vertexB, in_vertexA - in_vertexC, in_vertexA - in_vertexD);

	vec3 midPoint = (in_vertexA + in_vertexB + in_vertexC + in_vertexD) * 0.25;
	vec3 offset = in_vertexA - midPoint;
	float lengthMidpointToA = length(offset);
	if (lengthMidpointToA == 0.0){
		return vec3(0.0, 0.0, 0.0);
	}
	vec3 forceNormal = offset / lengthMidpointToA;
	float desiredLength = (lengthMidpointToA / in_volume) / volume;
	vec3 desiredMove = in_vertexA - (midPoint + (desiredLength * forceNormal));

	vec3 force = (desiredMove / (u_timeStep * u_timeStep)) * 0.5;

	return force;
}

void main() {
	float timeStepSquared = u_timeStep * u_timeStep;

	vec4 prevPos = texture2D(u_samplerPrevPos, a_uv);
	vec4 forceSum = texture2D(u_samplerForceSum, a_uv);
	vec4 volumeData0 = texture2D(u_samplerVolumeData0, a_uv);

	//links
	vec4 prevPos0 = texture2D(u_samplerPrevPos, vec2(a_linkUv0.x, a_linkUv0.y));
	vec4 forceSum0 = texture2D(u_samplerForceSum, vec2(a_linkUv0.x, a_linkUv0.y));
	vec3 targetPos0 = prevPos0.xyz + (forceSum0.xyz * timeStepSquared);
	vec4 prevPos1 = texture2D(u_samplerPrevPos, vec2(a_linkUv0.z, a_linkUv0.w));
	vec4 forceSum1 = texture2D(u_samplerForceSum, vec2(a_linkUv0.z, a_linkUv0.w));
	vec3 targetPos1 = prevPos1.xyz + (forceSum1.xyz * timeStepSquared);
	vec4 prevPos2 = texture2D(u_samplerPrevPos, vec2(a_linkUv1.x, a_linkUv1.y));
	vec4 forceSum2 = texture2D(u_samplerForceSum, vec2(a_linkUv1.x, a_linkUv1.y));
	vec3 targetPos2 = prevPos2.xyz + (forceSum2.xyz * timeStepSquared);

	vec3 forceSumTotal = forceSum.xyz; //vec3(0.0, 0.0, 0.0);
	vec3 targetPos = prevPos.xyz + (forceSum.xyz * timeStepSquared);

	//volume sprint
	//0:[0,1,2],
	forceSumTotal += getVolumeSpringForce(volumeData0.x, targetPos, targetPos0, targetPos1, targetPos2);

	v_forceSum = forceSumTotal;
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
const sVertexAttributeNameArray = ["a_uv", "a_linkUv0", "a_linkUv1", "a_linkUv2", "a_linkUv3", "a_linkUv4", "a_linkUv5"];
//const sVertexAttributeNameArray = ["a_uv", "a_linkUv0", "a_linkUv1"];
const sUniformNameArray = ["u_samplerPrevPos", "u_samplerForceSum", "u_samplerVolumeData0", "u_samplerVolumeData1", "u_samplerVolumeData2", "u_samplerVolumeData3", "u_samplerVolumeData4", "u_timeStep"];
//const sUniformNameArray = ["u_samplerPrevPos", "u_samplerForceSum", "u_samplerVolumeData0", "u_timeStep"];

const factory = function(in_resourceManager, in_webGLContextWrapper, in_webGLState, in_dataServer){
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_samplerPrevPos"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_samplerForceSum"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 1);
			} else if (in_key === "u_samplerVolumeData0"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 2);
			} else if (in_key === "u_samplerVolumeData1"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 3);
			} else if (in_key === "u_samplerVolumeData2"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 4);
			} else if (in_key === "u_samplerVolumeData3"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 5);
			} else if (in_key === "u_samplerVolumeData4"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 6);
			} else if (in_key === "u_timeStep"){
				var m_timeDelta = in_dataServer.getTimeDelta();
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_timeDelta);
			}
		}
	};
	const m_shader = WebGL.ShaderWrapper.factory(in_webGLContextWrapper, sVertexShaserSource, sFragmentShaderSource, m_uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const m_material = WebGL.MaterialWrapper.factory(m_shader, 
		[in_dataServer.getTexturePrevPos(), 
		in_dataServer.getTextureForceSum0(),
		in_dataServer.getTextureVolumeData0(),
		in_dataServer.getTextureVolumeData1(),
		in_dataServer.getTextureVolumeData2(),
		in_dataServer.getTextureVolumeData3(),
		in_dataServer.getTextureVolumeData4()
		]);
	const m_model = in_resourceManager.getCommonReference("model", in_webGLContextWrapper);

	const m_renderTargetData = WebGL.RenderTargetData.factory(in_dataServer.getTextureForceSum1(), "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D");
	const m_renderTarget = WebGL.RenderTargetWrapper.factory(in_webGLContextWrapper, in_dataServer.getTextureForceSum1().getWidth(), in_dataServer.getTextureForceSum1().getHeight(), [m_renderTargetData]);

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			m_renderTarget.apply(in_webGLContextWrapper, in_webGLState);

			m_material.setTextureArray([
				in_dataServer.getTexturePrevPos(), 
				in_dataServer.getTextureForceSum0(),
				in_dataServer.getTextureVolumeData0(),
				in_dataServer.getTextureVolumeData1(),
				in_dataServer.getTextureVolumeData2(),
				in_dataServer.getTextureVolumeData3(),
				in_dataServer.getTextureVolumeData4()
				]);
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