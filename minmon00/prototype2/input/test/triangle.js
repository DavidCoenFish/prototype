import CanvasFactory from './../dom/canvasfactory.js'
import WebGLAPIFactory from './../webgl/apifactory.js'

export default function () {
	const html5CanvasWrapper = CanvasFactory(document, 
	{
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	}
	);

	console.log("pre appendChild");
	document.body.appendChild(html5CanvasWrapper.getElement());
	console.log("post appendChild");
	html5CanvasWrapper.onResize();

	console.log("WebGLAPIFactory");
	const webGLApi = WebGLAPIFactory(html5CanvasWrapper.getElement(), undefined, false);

	const data = new Float32Array([0.0, 1.0, 0.0, 0.0]);

	console.log("webGLApi clear");
	webGLApi.clear(data[0], data[1], data[2], data[3]);
	//webGLApi.clear(0.5);

	return;
}