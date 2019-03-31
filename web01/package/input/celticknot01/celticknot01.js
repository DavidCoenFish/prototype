import ComponentWebGLSceneFactory from './../manipulatedom/component-webgl-scene.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import ResourceManagerFactory from './../core/resourcemanager.js';

export default function () {
	const backgroundColour = Colour4FactoryFloat32(1.0,1.0,1.0,1.0);
	const sceneUpdateCallback = function(in_timeDeltaActual, in_timeDeltaAjusted){
		webGLState.clear(backgroundColour);

		return;
	};

	const componentScene = ComponentWebGLSceneFactory(document, sceneUpdateCallback, undefined, false, undefined, undefined, undefined, true);
	const webGLState = componentScene.getWebGLState();

	const canvasWidth = webGLState.getCanvasWidth();
	const canvasHeight = webGLState.getCanvasHeight();
	const resourceManager = ResourceManagerFactory();

	return;
}