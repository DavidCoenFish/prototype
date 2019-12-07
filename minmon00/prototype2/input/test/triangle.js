import CanvasFactory from './../dom/canvasfactory.js'
import WebGLAPIFactory from './../webgl/apifactory.js'

export default function () {
	const canvaseWrapper = CanvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#000000", //"#FFFFFF"
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
		});
	document.body.appendChild(canvaseWrapper.getElement());

	const webGLApi = WebGLAPIFactory(canvaseWrapper.getElement(), undefined, false);

	const data = new Float32Array([1.0, 0.0, 0.0, 0.0]);

	webGLApi.clear(data[0], data[1], data[2], data[3]);
	//webGLApi.clear(0.5);

	return;
}