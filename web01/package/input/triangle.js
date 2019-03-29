import { factoryAppendBody } from './manipulatedom/component-canvas.js'
import WebGLStateFactory from './webgl/webglstate.js'
import {factoryFloat32 as Colour4FactoryFloat32} from './core/colour4.js';

export default function () {
	const html5CanvasWrapper = factoryAppendBody(document, 512, 512);
	const webGLState = WebGLStateFactory(html5CanvasWrapper.getElement(), false);
	webGLState.clear(Colour4FactoryFloat32(1.0,0.0,0.0));
}