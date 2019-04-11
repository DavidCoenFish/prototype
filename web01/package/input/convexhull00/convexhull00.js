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

const sVertexShader = `
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

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize  = 100.0;
	v_colour = vec4(a_colour, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;
varying vec4 v_colour;
varying float v_keepOrDiscard;
void main() {
	if (v_keepOrDiscard <= 0.0)
		discard;
	vec2 diff = gl_PointCoord - vec2(.5, .5);
	if (length(diff) > 0.5)
		discard;

	gl_FragColor = v_colour;
	gl_FragColor.x = gl_PointCoord.x;
	gl_FragColor.y = gl_PointCoord.y;
	gl_FragColor.z = 0.0;
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
		webGLState.clear(backgroundColour);
		cameraComponent.update(in_timeDeltaActual);
		grid.draw();

		webGLState.applyShader(shader, state);
		webGLState.applyMaterial(material);
		webGLState.drawModel(model);
		return;
	};

	const stopCallback = function(){
		grid.destroy();
	}

	const componentScene = ComponentWebGLSceneFactory(document, true, sceneUpdateCallback, stopCallback, {
		"width" : "640px",
		"height" : "455px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
		}, false, undefined, undefined, undefined, true);
	const webGLState = componentScene.getWebGLState();
	const state = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : Vector4FactoryFloat32(webGLState.getCanvasWidth(), webGLState.getCanvasHeight(), webGLState.getCanvasWidth() / 2.0, webGLState.getCanvasHeight() / 2.0).getRaw(),
		"u_cameraFovhFovvFarClip" : Vector4FactoryFloat32(210.0, 150.0, 100.0, 128.8).getRaw(),
	};
	const cameraComponent = ComponentCameraFactory(componentScene.getCanvasElement(), state);
	const resourceManager = ResourceManagerFactory();
	const grid = WorldGridFactory(resourceManager, webGLState, state, 4, 16);

	const material = MaterialWrapperFactory();
	const shader = ShaderWrapperFactory(webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const model = ModelFactory(webGLState);

	return;
}