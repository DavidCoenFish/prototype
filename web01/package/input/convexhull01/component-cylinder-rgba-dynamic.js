import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat4} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';



const sVertexShader = `
precision mediump float;

attribute float a_index;

uniform vec4 u_cameraAtFovhradian;
uniform vec4 u_cameraLeftViewportWidth;
uniform vec4 u_cameraUpViewportHeight;
uniform vec4 u_cameraPosCameraFar;

uniform vec4 u_sphere00;
uniform vec4 u_cylinder00;
uniform vec4 u_colour00;

uniform vec4 u_sphere01;
uniform vec4 u_cylinder01;
uniform vec4 u_colour01;

uniform vec4 u_sphere02;
uniform vec4 u_cylinder02;
uniform vec4 u_colour02;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_cylinder;
varying float v_radius2;
varying vec4 v_colour;

void main() {
	//step return 0 if x < edge, 1 if edge <= x
	float ratio00 = step(-0.5, a_index) * step(a_index, 0.5);
	float ratio01 = step(0.5, a_index) * step(a_index, 1.5);
	float ratio02 = step(1.5, a_index) * step(a_index, 2.5);

	vec4 sphere = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 cylinder = vec4(0.0, 0.0, 0.0, 0.0);
	vec4 colour = vec4(0.0, 0.0, 0.0, 0.0);

	sphere += (ratio00 * u_sphere00);
	cylinder += (ratio00 * u_cylinder00);
	colour += (ratio00 * u_colour00);

	sphere += (ratio01 * u_sphere01);
	cylinder += (ratio01 * u_cylinder01);
	colour += (ratio01 * u_colour01);

	sphere += (ratio02 * u_sphere02);
	cylinder += (ratio02 * u_cylinder02);
	colour += (ratio02 * u_colour02);

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

uniform vec4 u_cameraAtFovhradian;
uniform vec4 u_cameraLeftViewportWidth;
uniform vec4 u_cameraUpViewportHeight;
uniform vec4 u_cameraPosCameraFar;

varying float v_keepOrDiscard;

varying vec2 v_uv;
varying vec2 v_uvScale;

varying vec4 v_sphere;
varying vec4 v_cylinder;
varying float v_radius2;
varying vec4 v_colour;

vec3 makeWorldRay(vec3 in_screenEyeRay){
	return ((-(in_screenEyeRay.x) * u_cameraLeftViewportWidth.xyz) +
		(in_screenEyeRay.y * u_cameraUpViewportHeight.xyz) +
		(in_screenEyeRay.z * u_cameraAtFovhradian.xyz));
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
	if (v_keepOrDiscard <= 0.0) {
		discard;
	}

	vec2 diff = (gl_PointCoord - vec2(.5, .5)) * 2.0;
	if (1.0 < dot(diff, diff)) {
		discard;
	}

	vec3 screenEyeRay = texture2D(u_samplerCameraRay, v_uv + (v_uvScale * gl_PointCoord)).xyz;
	vec3 worldRay = makeWorldRay(screenEyeRay);

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

	"u_cameraAtFovhradian" : sFloat4,
	"u_cameraLeftViewportWidth" : sFloat4,
	"u_cameraUpViewportHeight" : sFloat4,
	"u_cameraPosCameraFar" : sFloat4,

	"u_sphere00" : sFloat4,
	"u_cylinder00" : sFloat4,
	"u_colour00" : sFloat4,

	"u_sphere01" : sFloat4,
	"u_cylinder01" : sFloat4,
	"u_colour01" : sFloat4,

	"u_sphere02" : sFloat4,
	"u_cylinder02" : sFloat4,
	"u_colour02" : sFloat4
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
		in_webGLState, "POINTS", 3, {
			"a_index" : ModelDataStream(in_webGLState, "FLOAT", 1, new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0]), "STATIC_DRAW", true)
		}, undefined);

	var m_arraySphere = [];
	var m_arrayCylinder = [];
	var m_arrayColour = [];

	for (var index = 0; index < 3; ++index){
		m_arraySphere.push(Vector4FactoryFloat32());
		m_arrayCylinder.push(Vector4FactoryFloat32());
		m_arrayColour.push(Vector4FactoryFloat32());
	}

	var m_cameraAtFovhradian = Vector4FactoryFloat32();
	var m_cameraLeftViewportWidth = Vector4FactoryFloat32();
	var m_cameraUpViewportHeight = Vector4FactoryFloat32();
	var m_cameraPosCameraFar = Vector4FactoryFloat32();

	const m_state = {
		"u_samplerCameraRay" : 0,

		"u_cameraAtFovhradian" : m_cameraAtFovhradian.getRaw(),
		"u_cameraLeftViewportWidth" : m_cameraLeftViewportWidth.getRaw(),
		"u_cameraUpViewportHeight" : m_cameraUpViewportHeight.getRaw(),
		"u_cameraPosCameraFar" : m_cameraPosCameraFar.getRaw(),

		"u_sphere00" : m_arraySphere[0].getRaw(),
		"u_cylinder00" : m_arrayCylinder[0].getRaw(),
		"u_colour00" : m_arrayColour[0].getRaw(),

		"u_sphere01" : m_arraySphere[1].getRaw(),
		"u_cylinder01" : m_arrayCylinder[1].getRaw(),
		"u_colour01" : m_arrayColour[1].getRaw(),

		"u_sphere02" : m_arraySphere[2].getRaw(),
		"u_cylinder02" : m_arrayCylinder[2].getRaw(),
		"u_colour02" : m_arrayColour[2].getRaw()
	};

	//public methods ==========================
	const result = Object.create({
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
			return;
		},
		"draw" : function(){
			var arrayCount = in_state.m_dynamicCylinderArray.length;
			if (0 === arrayCount){
				return 0.0;
			}

			in_webGLState.applyMaterial(m_material);

			m_cameraAtFovhradian.setX(in_state.u_cameraAt[0]);
			m_cameraAtFovhradian.setY(in_state.u_cameraAt[1]);
			m_cameraAtFovhradian.setZ(in_state.u_cameraAt[2]);
			m_cameraAtFovhradian.setW(in_state.u_fovhradian);
			m_cameraLeftViewportWidth.setX(in_state.u_cameraLeft[0]);
			m_cameraLeftViewportWidth.setY(in_state.u_cameraLeft[1]);
			m_cameraLeftViewportWidth.setZ(in_state.u_cameraLeft[2]);
			m_cameraLeftViewportWidth.setW(in_state.u_viewportWidthHeight[0]);
			m_cameraUpViewportHeight.setX(in_state.u_cameraUp[0]);
			m_cameraUpViewportHeight.setY(in_state.u_cameraUp[1]);
			m_cameraUpViewportHeight.setZ(in_state.u_cameraUp[2]);
			m_cameraUpViewportHeight.setW(in_state.u_viewportWidthHeight[1]);
			m_cameraPosCameraFar.setX(in_state.u_cameraPos[0]);
			m_cameraPosCameraFar.setY(in_state.u_cameraPos[1]);
			m_cameraPosCameraFar.setZ(in_state.u_cameraPos[2]);
			m_cameraPosCameraFar.setW(in_state.u_cameraFar);

			var dynamicCylinderArray = in_state.m_dynamicCylinderArray;
			var trace = 0;
			var innerTrace = 0;
			var drawCount = 0;
			while (trace < arrayCount){
				innerTrace = 0;
				while ((innerTrace < 3) && (trace < arrayCount)){
					m_arraySphere[innerTrace].set(dynamicCylinderArray[trace].m_sphere);
					m_arrayCylinder[innerTrace].set(dynamicCylinderArray[trace].m_cylinder);
					m_arrayColour[innerTrace].set(dynamicCylinderArray[trace].m_colour);
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
