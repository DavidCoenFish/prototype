import ComponentWebGLSceneFactory from './../manipulatedom/component-webgl-scene.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import CelticKnotComponentFactory from './celticknotcomponent.js';

export default function () {
	const sceneUpdateCallback = function(in_timeDeltaActual, in_timeDeltaAjusted){
		celticknotcomponent.draw(in_timeDeltaAjusted);
		return;
	};

	const componentScene = ComponentWebGLSceneFactory(document, sceneUpdateCallback, undefined, false, undefined, undefined, undefined, true);
	const webGLState = componentScene.getWebGLState();

	const canvasWidth = webGLState.getCanvasWidth();
	const canvasHeight = webGLState.getCanvasHeight();
	const resourceManager = ResourceManagerFactory();

	const celticknotcomponent = CelticKnotComponentFactory(resourceManager, webGLState, canvasWidth, canvasHeight, 32, 32);

	return;
}