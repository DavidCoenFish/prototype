import ShaderWrapperFactory from "./../../webgl/shaderwrapper.js";
import {sInt, sMat4} from "./../../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../../webgl/materialwrapper.js";
import ModelWrapperFactory from './../../webgl/modelwrapper.js';
import ModelDataStream from './../../webgl/modeldatastream.js';
import {factoryFloat32 as Matrix44FactoryFloat32} from './../../core/matrix44.js';

/*
{
	m_sphere, //pos, sphere radius
	m_cylinder, //normal, halfHeight cylinder
	m_colour,
}
// pipe radius = sqrt(sphereRadius^2 - halfHeight^2)

//r1 = half height of cylinder
//r2 = pipe radius


 */


const sVertexShader = `
precision mediump float;

attribute float a_index;

uniform mat4 u_camera;

uniform mat4 u_data00;
uniform mat4 u_data01;
uniform mat4 u_data02;
uniform mat4 u_data03;
uniform mat4 u_data04;
uniform mat4 u_data05;
uniform mat4 u_data06;
uniform mat4 u_data07;
uniform mat4 u_data08;
uniform mat4 u_data09;
uniform mat4 u_data10;
uniform mat4 u_data11;
uniform mat4 u_data12;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_cylinder;
varying float v_radius2;
varying vec4 v_colour;

void main() {
	vec4 u_cameraAtFovhradian = u_camera[0];
	vec4 u_cameraLeftViewportWidth = u_camera[1];
	vec4 u_cameraUpViewportHeight = u_camera[2];
	vec4 u_cameraPosCameraFar = u_camera[3];

	//step return 0 if x < edge, 1 if edge <= x
	float ratio00 = step(-0.5, a_index) * step(a_index, 0.5);
	float ratio01 = step(0.5, a_index) * step(a_index, 1.5);
	float ratio02 = step(1.5, a_index) * step(a_index, 2.5);
	float ratio03 = step(2.5, a_index) * step(a_index, 3.5);
	float ratio04 = step(3.5, a_index) * step(a_index, 4.5);
	float ratio05 = step(4.5, a_index) * step(a_index, 5.5);
	float ratio06 = step(5.5, a_index) * step(a_index, 6.5);
	float ratio07 = step(6.5, a_index) * step(a_index, 7.5);
	float ratio08 = step(7.5, a_index) * step(a_index, 8.5);
	float ratio09 = step(8.5, a_index) * step(a_index, 9.5);
	float ratio10 = step(9.5, a_index) * step(a_index, 10.5);
	float ratio11 = step(10.5, a_index) * step(a_index, 11.5);
	float ratio12 = step(11.5, a_index) * step(a_index, 12.5);
	float ratio13 = step(12.5, a_index) * step(a_index, 13.5);
	float ratio14 = step(13.5, a_index) * step(a_index, 14.5);
	float ratio15 = step(14.5, a_index) * step(a_index, 15.5);
	float ratio16 = step(15.5, a_index) * step(a_index, 16.5);

	vec4 sphere = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 cylinder = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 colour = vec4(0.0, 0.0, 0.0, 0.0);

	sphere += (ratio00 * u_data00[0]);
	cylinder += (ratio00 * u_data00[1]);
	colour += (ratio00 * u_data00[2]);

	sphere += (ratio01 * u_data00[3]);
	cylinder += (ratio01 * u_data01[0]);
	colour += (ratio01 * u_data01[1]);

	sphere += (ratio02 * u_data01[2]);
	cylinder += (ratio02 * u_data01[3]);
	colour += (ratio02 * u_data02[0]);

	sphere += (ratio03 * u_data02[1]);
	cylinder += (ratio03 * u_data02[2]);
	colour += (ratio03 * u_data02[3]);

	sphere += (ratio04 * u_data03[0]);
	cylinder += (ratio04 * u_data03[1]);
	colour += (ratio04 * u_data03[2]);

	sphere += (ratio05 * u_data03[3]);
	cylinder += (ratio05 * u_data04[0]);
	colour += (ratio05 * u_data04[1]);

	sphere += (ratio06 * u_data04[2]);
	cylinder += (ratio06 * u_data04[3]);
	colour += (ratio06 * u_data05[0]);

	sphere += (ratio07 * u_data05[1]);
	cylinder += (ratio07 * u_data05[2]);
	colour += (ratio07 * u_data05[3]);

	sphere += (ratio08 * u_data06[0]);
	cylinder += (ratio08 * u_data06[1]);
	colour += (ratio08 * u_data06[2]);

	sphere += (ratio09 * u_data06[3]);
	cylinder += (ratio09 * u_data07[0]);
	colour += (ratio09 * u_data07[1]);

	sphere += (ratio10 * u_data07[2]);
	cylinder += (ratio10 * u_data07[3]);
	colour += (ratio10 * u_data08[0]);

	sphere += (ratio11 * u_data08[1]);
	cylinder += (ratio11 * u_data08[2]);
	colour += (ratio11 * u_data08[3]);

	sphere += (ratio12 * u_data09[0]);
	cylinder += (ratio12 * u_data09[1]);
	colour += (ratio12 * u_data09[2]);

	sphere += (ratio13 * u_data09[3]);
	cylinder += (ratio13 * u_data10[0]);
	colour += (ratio13 * u_data10[1]);

	sphere += (ratio14 * u_data10[2]);
	cylinder += (ratio14 * u_data10[3]);
	colour += (ratio14 * u_data11[0]);

	sphere += (ratio15 * u_data11[1]);
	cylinder += (ratio15 * u_data11[2]);
	colour += (ratio15 * u_data11[3]);

	sphere += (ratio16 * u_data12[0]);
	cylinder += (ratio16 * u_data12[1]);
	colour += (ratio16 * u_data12[2]);

	vec3 cameraToAtom = sphere.xyz - u_cameraPosCameraFar.xyz;

	float cameraSpaceX = -dot(cameraToAtom, u_cameraLeftViewportWidth.xyz);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUpViewportHeight.xyz);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAtFovhradian.xyz);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0));
	float maxRadian = 0.5 * u_cameraAtFovhradian.w * (length(vec2(u_cameraLeftViewportWidth.w, u_cameraUpViewportHeight.w)) / u_cameraLeftViewportWidth.w);
	v_keepOrDiscard = 1.0 - (polarR / maxRadian);

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float width = u_cameraLeftViewportWidth.w;
	float height = u_cameraUpViewportHeight.w;
	float fovHHalfRadians = u_cameraAtFovhradian.w * 0.5;
	float screenR = polarR / fovHHalfRadians; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = cameraSpaceLength / u_cameraPosCameraFar.w;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float sphereRadiusAngleRadians = asin(sphere.w / cameraSpaceLength);
	float pixelDiameter = width * (sphereRadiusAngleRadians / fovHHalfRadians);
	pixelDiameter += max(0.0, ((1.0 * screenR * width) * tan(sphereRadiusAngleRadians)));

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pixelDiameter;

	v_uvScale = vec2(pixelDiameter / width, -pixelDiameter / width * apsectCorrection);
	v_uv = vec2((screenX / 2.0) + 0.5, (screenY / 2.0) + 0.5) - (v_uvScale * 0.5);

	v_sphere = sphere;
	v_cylinder = cylinder;
	v_radius2 = sqrt((sphere.w * sphere.w) - (cylinder.w * cylinder.w));
	v_colour = colour;
}
`;

const sFragmentShader = `
#extension GL_EXT_frag_depth : enable
precision mediump float;

uniform sampler2D u_samplerCameraRay;

uniform mat4 u_camera;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_cylinder;
varying float v_radius2;
varying vec4 v_colour;

vec3 makeWorldRay(vec3 in_screenEyeRay, vec3 u_cameraLeft, vec3 u_cameraUp, vec3 u_cameraAt){
	return ((-(in_screenEyeRay.x) * u_cameraLeft) +
		(in_screenEyeRay.y * u_cameraUp) +
		(in_screenEyeRay.z * u_cameraAt));
}

//https://www.gamedev.net/forums/topic/467789-raycylinder-intersection/
//r1 = half height of cylinder
//r2 = pipe radius
float rayCylinder(vec3 cylinderNormal, vec3 cylinderPos, float r1, float r2, vec3 eyeRay, vec3 eyePos, float maxDistance){
	// project camera eye pos and ray into cylinder space
	vec3 rightNormal = normalize(cross(eyeRay, cylinderNormal));
	vec3 atNormal = cross(cylinderNormal, rightNormal);
	vec3 posRelativeToCylinder = eyePos - cylinderPos;
	vec2 rayStart = vec2(dot(rightNormal, posRelativeToCylinder), dot(atNormal, posRelativeToCylinder));
	vec2 rayNormal = vec2(dot(rightNormal, eyeRay), dot(atNormal, eyeRay));

	float a = dot(rayNormal, rayNormal);
	float b = 2.0 * dot(rayNormal, rayStart);
	float c = dot(rayStart, rayStart) - (r2 * r2);

	float temp = (b * b) - (4.0 * a * c);
	if (temp < 0.0){
		return maxDistance;
	}

	//at^2 + bt + c = 0
	//d = sqrt(b^2 - 4ac)
	//t+-= (-b+-d)/2a
	float tempSqrt = sqrt(temp);
	float temp1 = (-b + tempSqrt) / (2.0 * a);
	float temp2 = (-b - tempSqrt) / (2.0 * a);
	float t1 = min(temp1, temp2);
	float t2 = max(temp1, temp2);

	float rateZChange = dot(cylinderNormal, eyeRay);
	float rateZStart = dot(cylinderNormal, eyePos - cylinderPos);
	float h1 = rateZStart + (rateZChange * t1);
	float h2 = rateZStart + (rateZChange * t2);
	//both near and far inside the body of cylinder
	if (abs(h1) <= r1){
		return min(t1, t2);
	}

	//end cap 1
	if ((h2 < r1) && (r1 <= h1)){
		float ratio = (r1 - h1) / (h2 - h1);
		return mix(t1, t2, ratio);
	}

	//end cap 2
	if ((-r1 < h2) && (h1 <= -r1)){
		float ratio = (-r1 - h1) / (h2 - h1);
		return mix(t1, t2, ratio);
	}

	return maxDistance;
}

void main() {
	vec4 u_cameraAtFovhradian = u_camera[0];
	vec4 u_cameraLeftViewportWidth = u_camera[1];
	vec4 u_cameraUpViewportHeight = u_camera[2];
	vec4 u_cameraPosCameraFar = u_camera[3];

	if (v_keepOrDiscard <= 0.0) {
		discard;
	}

	vec2 diff = (gl_PointCoord - vec2(.5, .5)) * 2.0;
	if (1.0 < dot(diff, diff)) {
		discard;
	}

	vec3 screenEyeRay = texture2D(u_samplerCameraRay, v_uv + (v_uvScale * gl_PointCoord)).xyz;
	vec3 worldRay = makeWorldRay(screenEyeRay, u_cameraLeftViewportWidth.xyz, u_cameraUpViewportHeight.xyz, u_cameraAtFovhradian.xyz);

	float distance = rayCylinder(v_cylinder.xyz, v_sphere.xyz, v_cylinder.w, v_radius2, worldRay, u_cameraPosCameraFar.xyz, u_cameraPosCameraFar.w);

	if (u_cameraPosCameraFar.w <= distance) {
		discard;
	}

	gl_FragColor = v_colour;
#ifdef GL_EXT_frag_depth
	gl_FragDepthEXT = distance / u_cameraPosCameraFar.w;
#endif
}
`;

const sVertexAttributeNameArray = [
	"a_index"
];
const sUniformNameMap = {
	"u_samplerCameraRay" : sInt,

	"u_camera" : sMat4,

	"u_data00" : sMat4,
	"u_data01" : sMat4,
	"u_data02" : sMat4,
	"u_data03" : sMat4,
	"u_data04" : sMat4,
	"u_data05" : sMat4,
	"u_data06" : sMat4,
	"u_data07" : sMat4,
	"u_data08" : sMat4,
	"u_data09" : sMat4,
	"u_data10" : sMat4,
	"u_data11" : sMat4,
	"u_data12" : sMat4
};


export default function(in_resourceManager, in_webGLState, in_state, in_texture){
	const m_textureArray = [in_texture];
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		"LESS",
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true
	);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_model = ModelWrapperFactory(
		in_webGLState, "POINTS", 17, {
			"a_index" : ModelDataStream(in_webGLState, "FLOAT", 1, new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0]), "STATIC_DRAW", true)
		}, undefined);

	var m_data = [];
	for (var index = 0; index < 13; ++index){
		m_data.push(Matrix44FactoryFloat32());
	}

	const m_state = Object.assign({
		"u_samplerCameraRay" : 0,

		"u_data00" : m_data[0].getRaw(),
		"u_data01" : m_data[1].getRaw(),
		"u_data02" : m_data[2].getRaw(),
		"u_data03" : m_data[3].getRaw(),
		"u_data04" : m_data[4].getRaw(),
		"u_data05" : m_data[5].getRaw(),
		"u_data06" : m_data[6].getRaw(),
		"u_data07" : m_data[7].getRaw(),
		"u_data08" : m_data[8].getRaw(),
		"u_data09" : m_data[9].getRaw(),
		"u_data10" : m_data[10].getRaw(),
		"u_data11" : m_data[11].getRaw(),
		"u_data12" : m_data[12].getRaw()
	}, in_state);


	//public methods ==========================
	const result = Object.create({
		"update" : function(in_texture){
			m_textureArray[0] = in_texture;
			var arrayCount = in_state.m_dynamicCylinderArray.length;
			if (0 === arrayCount){
				return;
			}

			in_webGLState.applyMaterial(m_material);

			var dynamicCylinderArray = in_state.m_dynamicCylinderArray;
			var trace = 0;
			var drawCount = 0;
			while (trace < arrayCount){
				var innerTrace = 0;
				var dataIndex = 0;
				var dataSubIndex = 0;

				while ((innerTrace < 17) && (trace < arrayCount)){
					var dataRaw = m_data[dataIndex].getRaw();
					dataRaw[dataSubIndex + 0] = dynamicCylinderArray[trace].m_sphere.getX();
					dataRaw[dataSubIndex + 1] = dynamicCylinderArray[trace].m_sphere.getY();
					dataRaw[dataSubIndex + 2] = dynamicCylinderArray[trace].m_sphere.getZ();
					dataRaw[dataSubIndex + 3] = dynamicCylinderArray[trace].m_sphere.getW();
					dataSubIndex += 4;
					if (16 <= dataSubIndex){
						dataSubIndex = 0;
						dataIndex += 1;
					}

					var dataRaw = m_data[dataIndex].getRaw();
					dataRaw[dataSubIndex + 0] = dynamicCylinderArray[trace].m_cylinder.getX();
					dataRaw[dataSubIndex + 1] = dynamicCylinderArray[trace].m_cylinder.getY();
					dataRaw[dataSubIndex + 2] = dynamicCylinderArray[trace].m_cylinder.getZ();
					dataRaw[dataSubIndex + 3] = dynamicCylinderArray[trace].m_cylinder.getW();
					dataSubIndex += 4;
					if (16 <= dataSubIndex){
						dataSubIndex = 0;
						dataIndex += 1;
					}

					var dataRaw = m_data[dataIndex].getRaw();
					dataRaw[dataSubIndex + 0] = dynamicCylinderArray[trace].m_colour.getX();
					dataRaw[dataSubIndex + 1] = dynamicCylinderArray[trace].m_colour.getY();
					dataRaw[dataSubIndex + 2] = dynamicCylinderArray[trace].m_colour.getZ();
					dataRaw[dataSubIndex + 3] = dynamicCylinderArray[trace].m_colour.getW();
					dataSubIndex += 4;
					if (16 <= dataSubIndex){
						dataSubIndex = 0;
						dataIndex += 1;
					}
					
					trace++;
					innerTrace++;
					drawCount = innerTrace;
				}

				in_webGLState.applyShader(m_shader, m_state);
				in_webGLState.drawModel(m_model, 0, drawCount);
			}

			return;
		},
		"destroy" : function(){
			m_model.destroy();
			return;
		}
	});

	return result;

}
