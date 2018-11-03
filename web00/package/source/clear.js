const WebGL = require("webgl");
const Math = require("math");

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);

	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const colour = Math.Colour4.factoryFloat32(1.0, 0.0, 0.0, 1.0);

	webGLContextWrapper.clear(colour);

	return;
}

window.addEventListener('load', onPageLoad, true);
