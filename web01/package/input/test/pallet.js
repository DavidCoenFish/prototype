import ComponentWebGLSceneFactory from './../manipulatedom/component-webgl-scene.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import WorldGridFactory from './../webgl/component-world-grid2.js';
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

	const componentScene = ComponentWebGLSceneFactory(document, sceneUpdateCallback, undefined, false,
	{
		"width" : "640px",
		"height" : "455px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	},
	 undefined, undefined, undefined, true);
	const webGLState = componentScene.getWebGLState();

	const canvasWidth = webGLState.getCanvasWidth();
	const canvasHeight = webGLState.getCanvasHeight();
	const state = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : Vector4FactoryFloat32(canvasWidth, canvasHeight, canvasWidth / 2.0, canvasHeight / 2.0).getRaw(),
		"u_cameraFovhFovvFarClip" : Vector4FactoryFloat32(210.0, 150.0, 100.0, Math.sqrt((210 * 210) + (150 * 150)) * 0.5).getRaw(),
	};
	const cameraComponent = ComponentCameraFactory(componentScene.getCanvasElement(), state);
	const resourceManager = ResourceManagerFactory();
	const grid = WorldGridFactory(resourceManager, webGLState, state);

	return;
}