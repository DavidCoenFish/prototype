import ComponentCanvasFactory from './../manipulatedom/component-canvas.js';
import WebGLStateFactory from './../webgl/webglstate.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import {factoryFloat32 as Vector3FactoryFloat32} from './../core/vector3.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';

export default function () {
	const componentCanvas = ComponentCanvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const webGLState = WebGLStateFactory(componentCanvas.getCanvasElement(), false);

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