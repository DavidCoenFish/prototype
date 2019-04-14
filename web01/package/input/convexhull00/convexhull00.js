import ModelFactory from "./model.js";
import ResourceManagerFactory from './../core/resourcemanager.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import {factoryFloat32 as Vector3FactoryFloat32} from './../core/vector3.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';
import ComponentWebGLSceneFactory from './../manipulatedom/component-webgl-scene.js';
import ComponentCameraFactory from './../manipulatedom/component-mouse-keyboard-camera.js';
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sFloat3 as ShaderUniformDataFloat3, sFloat4 as ShaderUniformDataFloat4 } from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import WorldGridFactory from './../webgl/component-world-grid.js';
/*
gl_PointSize is diameter
gl_PointCoord [0...1,0..1]
0,0 --> +x
|
V
+y
  a--\   P
 /r    ---\
p---------------eye
       A
ar is angle at the eye for the sphere at p
A == cameraSpaceLength

the sphere radius suggests a pixel radius of (ar / fovhHalf) * pixelWidth
ar = asin (ops/hyp ) = asin(radius/cameraSpaceLength)
   ar
  / |
 /  |
.___.  _____________ar.


*/
const sVertexShader = `
precision mediump float;

attribute vec4 a_sphere;
attribute vec2 a_objectID;
attribute vec3 a_colour;
attribute vec4 a_plane0;
attribute vec4 a_plane1;
attribute vec4 a_plane2;
attribute vec4 a_plane3;
attribute vec4 a_plane4;
attribute vec4 a_plane5;
attribute vec4 a_plane6;
attribute vec4 a_plane7;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec4 u_cameraFovhFovvFarClip;

varying vec4 v_colour;
varying float v_keepOrDiscard;

varying vec2 v_polarTopLeft;
varying vec2 v_polarWidthHeight;

varying vec4 v_sphere;
varying vec4 v_plane0;
varying vec4 v_plane1;
varying vec4 v_plane2;
varying vec4 v_plane3;
varying vec4 v_plane4;
varying vec4 v_plane5;
varying vec4 v_plane6;
varying vec4 v_plane7;

void main() {
	vec3 cameraToAtom = a_sphere.xyz - u_cameraPos;

	float cameraSpaceX = -dot(cameraToAtom, u_cameraLeft);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = degrees(acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0)));
	v_keepOrDiscard = 1.0 - (polarR / u_cameraFovhFovvFarClip.w);

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float fovHHalf = u_cameraFovhFovvFarClip.x * 0.5;
	float width = u_viewportWidthHeightWidthhalfHeighthalf.x;
	float height = u_viewportWidthHeightWidthhalfHeighthalf.y;
	float widthHalf = u_viewportWidthHeightWidthhalfHeighthalf.z;
	float heightHalf = u_viewportWidthHeightWidthhalfHeighthalf.w;
	float screenR = polarR / fovHHalf; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = cameraSpaceLength / u_cameraFovhFovvFarClip.z;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float sphereRadiusAngleRadians = asin(a_sphere.w / cameraSpaceLength);
	float fovHHalfRadians = radians(u_cameraFovhFovvFarClip.x * 0.5);
	float pixelDiameter = width * (sphereRadiusAngleRadians / fovHHalfRadians);

	float radianDiameter = (pixelDiameter / widthHalf) * fovHHalfRadians;
	v_polarWidthHeight = vec2(radianDiameter, radianDiameter);
	v_polarTopLeft = vec2(screenX * fovHHalfRadians, screenY * fovHHalfRadians / apsectCorrection) - (0.5 * v_polarWidthHeight);

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pixelDiameter;
	v_colour = vec4(a_colour, 1.0);

	float polarRRadians = radians(polarR);
	float pixelRadians = 2.0 * pixelDiameter / widthHalf;

	v_sphere = a_sphere;
	v_plane0 = a_plane0;
	v_plane1 = a_plane1;
	v_plane2 = a_plane2;
	v_plane3 = a_plane3;
	v_plane4 = a_plane4;
	v_plane5 = a_plane5;
	v_plane6 = a_plane6;
	v_plane7 = a_plane7;
}
`;

const sFragmentShader = `
#extension GL_EXT_frag_depth : enable
precision mediump float;

uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec4 u_cameraFovhFovvFarClip;

varying vec4 v_colour;
varying float v_keepOrDiscard;

varying vec2 v_polarTopLeft;
varying vec2 v_polarWidthHeight;

varying vec4 v_sphere;
varying vec4 v_plane0;
varying vec4 v_plane1;
varying vec4 v_plane2;
varying vec4 v_plane3;
varying vec4 v_plane4;
varying vec4 v_plane5;
varying vec4 v_plane6;
varying vec4 v_plane7;

vec3 makeScreenEyeRay(vec2 in_polarCoords) {
	float polar_a_radian = atan(in_polarCoords.y, in_polarCoords.x);
	float polar_r_radian = length(in_polarCoords);

	float z = cos(polar_r_radian);
	float temp = sqrt(1.0 - (z * z));
	float x = temp * cos(polar_a_radian);
	float y = temp * sin(polar_a_radian);
	return vec3(x, y, z);
}

vec3 makeWorldRay(vec3 in_screenEyeRay){
	return ((-(in_screenEyeRay.x) * u_cameraLeft) +
		(in_screenEyeRay.y * u_cameraUp) +
		(in_screenEyeRay.z * u_cameraAt));
}

//intersect world ray with plane0, check point inside all other planes
float planeTest(float distanceFromFarClip, float farClip, vec3 eyePos, vec3 eyeRay, vec4 in_plane0, vec4 in_plane1, vec4 in_plane2, vec4 in_plane3, vec4 in_plane4, vec4 in_plane5, vec4 in_plane6, vec4 in_plane7){
	float ln = dot(eyeRay, in_plane0.xyz);
	//if (abs(ln) < 0.0001){
	if (0.0001 < ln){
		return distanceFromFarClip;
	}
	float t = (in_plane0.w - dot(eyePos, in_plane0.xyz)) / ln;

	if (t < 0.0){
		return distanceFromFarClip;
	}
	if (farClip < t){
		return distanceFromFarClip;
	}
	vec3 testPos = eyePos + (eyeRay * t);

	float inside = 1.0;
	inside *= step(dot(testPos, in_plane1.xyz), in_plane1.w);
	inside *= step(dot(testPos, in_plane2.xyz), in_plane2.w);
	inside *= step(dot(testPos, in_plane3.xyz), in_plane3.w);
	inside *= step(dot(testPos, in_plane4.xyz), in_plane4.w);
	inside *= step(dot(testPos, in_plane5.xyz), in_plane5.w);
	inside *= step(dot(testPos, in_plane6.xyz), in_plane6.w);
	inside *= step(dot(testPos, in_plane7.xyz), in_plane7.w);
	float testDistanceFromFarClip = farClip - t;

	return mix(distanceFromFarClip, testDistanceFromFarClip, inside);
}

//v_plane0, worldRay, u_cameraPos, farClip
float planeDebug(vec4 in_plane, vec3 in_eyeRay, vec3 in_eyePos, float in_farClip){
	float ln = dot(in_eyeRay, in_plane.xyz);
	if (0.0001 < ln){
	//if (abs(ln) < 0.0001){
		return in_farClip;
	}
	float t = (in_plane.w - dot(in_eyePos, in_plane.xyz)) / ln;
	if (t < 0.0){
		return in_farClip;
	}
	return t;
}

void main() {
	if (v_keepOrDiscard <= 0.0) {
		discard;
	}
	//vec2 diff = (gl_PointCoord - vec2(.5, .5)) * 2.0;
	//if (1.0 < dot(diff, diff)) {
	//	discard;
	//}

	vec2 polarCoords = v_polarTopLeft + vec2(gl_PointCoord.x * v_polarWidthHeight.x, (1.0 - gl_PointCoord.y) * v_polarWidthHeight.y);
	vec3 screenEyeRay = makeScreenEyeRay(polarCoords);
	vec3 worldRay = makeWorldRay(screenEyeRay);
	gl_FragColor = vec4(worldRay, 1.0);

	float farClip = u_cameraFovhFovvFarClip.z;
	gl_FragDepthEXT = 0.5;
	float distanceFromFarClip = 0.0;

	//float distanceToPlane = planeDebug(v_plane0, worldRay, u_cameraPos, farClip);
	//float distanceToPlane = planeDebug(vec4(0,0,1,0), worldRay, u_cameraPos, farClip);
	//if (farClip <= distanceToPlane){
	//	discard;
	//}
	//float distance = 1.0 - (distanceToPlane / farClip);
	//gl_FragColor = vec4(distance, distance, distance, 1.0);

	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane1, v_plane0, v_plane2, v_plane3, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane2, v_plane0, v_plane1, v_plane3, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane3, v_plane0, v_plane1, v_plane2, v_plane4, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane4, v_plane0, v_plane1, v_plane2, v_plane3, v_plane5, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane5, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane6, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane6, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane5, v_plane7);
	distanceFromFarClip = planeTest(distanceFromFarClip, farClip, u_cameraPos, worldRay, v_plane7, v_plane0, v_plane1, v_plane2, v_plane3, v_plane4, v_plane5, v_plane6);

	if (distanceFromFarClip == 0.0){
		discard;
	}

	float distance = farClip - distanceFromFarClip;
	vec3 worldPos = u_cameraPos + (worldRay * distance);
	float colourDistance = length(worldPos - v_sphere.xyz);

	gl_FragColor = mix(vec4(1.0, 1.0, 1.0, 1.0), v_colour, colourDistance / v_sphere.w);
	gl_FragDepthEXT = distance / farClip;

	//gl_FragColor = vec4(v_plane0.x, v_plane0.y, v_plane0.z, 1.0);
}
`;

const sVertexAttributeNameArray = [
	"a_sphere",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("AAAAAAAAAAAAAAAAP5PNOg=="), "STATIC_DRAW", false),
	"a_objectID",// : ModelDataStream(in_webGLState, "BYTE", 2, Base64ToUint8Array("AAE="), "STATIC_DRAW", true),
	"a_colour",// : ModelDataStream(in_webGLState, "BYTE", 3, Base64ToUint8Array("MzOA"), "STATIC_DRAW", true),
	"a_plane0",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("AAAAAAAAAAA/gAAAP4AAAA=="), "STATIC_DRAW", false),
	"a_plane1",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("AAAAAAAAAAC/gAAAP4AAAA=="), "STATIC_DRAW", false),
	"a_plane2",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("P4AAAAAAAAAAAAAAPwAAAA=="), "STATIC_DRAW", false),
	"a_plane3",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("v4AAAAAAAAAAAAAAPwAAAA=="), "STATIC_DRAW", false),
	"a_plane4",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("PwAAAD9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false),
	"a_plane5",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("PwAAAL9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false),
	"a_plane6",// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("vwAAAD9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false),
	"a_plane7"// : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("vwAAAL9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false)
];
const sUniformNameMap = {
	"u_viewportWidthHeightWidthhalfHeighthalf" : ShaderUniformDataFloat4, 
	"u_cameraAt" : ShaderUniformDataFloat3, 
	"u_cameraUp" : ShaderUniformDataFloat3, 
	"u_cameraLeft" : ShaderUniformDataFloat3, 
	"u_cameraPos" : ShaderUniformDataFloat3, 
	"u_cameraFovhFovvFarClip" : ShaderUniformDataFloat4
};


export default function () {
	const backgroundColour = Colour4FactoryFloat32(0.5,0.5,0.5,1.0);
	const sceneUpdateCallback = function(in_timeDeltaActual, in_timeDeltaAjusted){
		webGLState.clear(backgroundColour, 1.0);
		cameraComponent.update(in_timeDeltaActual);
		grid.draw();

		webGLState.applyShader(shader, state);
		webGLState.applyMaterial(material);
		webGLState.drawModel(model);
		return;
	};

	const stopCallback = function(){
		grid.destroy();
		var message = "";
		message += `		"u_cameraPos" : [${state.u_cameraPos[0]}, ${state.u_cameraPos[1]}, ${state.u_cameraPos[2]}],\n`;
		message += `		"u_cameraAt" : [${state.u_cameraAt[0]}, ${state.u_cameraAt[1]}, ${state.u_cameraAt[2]}],\n`;
		message += `		"u_cameraLeft" : [${state.u_cameraLeft[0]}, ${state.u_cameraLeft[1]}, ${state.u_cameraLeft[2]}],\n`;
		message += `		"u_cameraUp" : [${state.u_cameraUp[0]}, ${state.u_cameraUp[1]}, ${state.u_cameraUp[2]}],\n`;
		console.log(message);
	}

	const componentScene = ComponentWebGLSceneFactory(document, true, sceneUpdateCallback, stopCallback, {
		"width" : "640px",
		"height" : "455px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
		}, false, true, undefined, ["EXT_frag_depth"], true);
	const webGLState = componentScene.getWebGLState();
	const state = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : Vector4FactoryFloat32(webGLState.getCanvasWidth(), webGLState.getCanvasHeight(), webGLState.getCanvasWidth() / 2.0, webGLState.getCanvasHeight() / 2.0).getRaw(),
		"u_cameraFovhFovvFarClip" : Vector4FactoryFloat32(210.0, 150.0, 100.0, Math.sqrt((210 * 210) + (150 * 150)) * 0.5).getRaw(),

		"u_cameraPos" : [-1.1833, 0, 0],
		"u_cameraAt" : [1, 0, 0],
		"u_cameraLeft" : [0, 1, 0],
		"u_cameraUp" : [0, 0, 1],
	};
	const cameraComponent = ComponentCameraFactory(componentScene.getCanvasElement(), state);
	const resourceManager = ResourceManagerFactory();
	const grid = WorldGridFactory(resourceManager, webGLState, state, 4, 16);

	const material = MaterialWrapperFactory(
		undefined,
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
	const shader = ShaderWrapperFactory(webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const model = ModelFactory(webGLState);

	return;
}