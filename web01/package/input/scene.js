import ComponentWebGLSceneFactory from './manipulatedom/component-webgl-scene.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './core/colour4.js';

export default function () {
	const backgroundColour = Colour4FactoryFloat32(0.5,0.5,0.5,1.0);
	const sceneUpdateCallback = function(in_timeDeltaActual, in_timeDeltaAjusted){
		webGLState.clear(backgroundColour);
		return;
	};

	const componentScene = ComponentWebGLSceneFactory(document, sceneUpdateCallback, undefined, false);
	const webGLState = componentScene.getWebGLState();

	return;
}