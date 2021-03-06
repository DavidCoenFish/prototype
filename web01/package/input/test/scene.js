import ComponentWebGLSceneFactory from './../manipulatedom/component-webgl-scene.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import WorldGridFactory from './../webgl/component-world-grid.js';
import ComponentCameraFactory from './../manipulatedom/component-mouse-keyboard-camera.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import {factoryFloat32 as Vector3FactoryFloat32} from './../core/vector3.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';

export default function () {
	const backgroundColour = Colour4FactoryFloat32(0.5,0.5,0.5,1.0);
	const sceneUpdateCallback = function(in_timeDeltaActual, in_timeDeltaAjusted){
		webGLState.clear(backgroundColour);
		cameraComponent.update(in_timeDeltaActual);
		grid.draw();

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

	const componentScene = ComponentWebGLSceneFactory(document, true, sceneUpdateCallback, stopCallback,
	{
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	},
	 false, undefined, undefined, true);
	const webGLState = componentScene.getWebGLState();

	const canvasWidth = webGLState.getCanvasWidth();
	const canvasHeight = webGLState.getCanvasHeight();
	const state = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : Vector4FactoryFloat32(canvasWidth, canvasHeight, canvasWidth / 2.0, canvasHeight / 2.0).getRaw(),
		"u_cameraFovhFovvFarClip" : Vector4FactoryFloat32(90.0, 90.0, 100.0, 128.0).getRaw(),
	};
	const cameraComponent = ComponentCameraFactory(componentScene.getCanvasElement(), state);
	const resourceManager = ResourceManagerFactory();
	const grid = WorldGridFactory(resourceManager, webGLState, state, 4, 16);

	return;
}