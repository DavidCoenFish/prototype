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

	document.body.appendChild(html5CanvasWrapper.getElement());
	html5CanvasWrapper.onResize();

	const webGLApi = WebGLAPIFactory(html5CanvasWrapper.getElement(), undefined, false);

	webGLApi.clear(1.0);

	return;
}