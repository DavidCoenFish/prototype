const WebGL = require("webgl");

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = document.createElement("canvas");
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);

	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);

	const divElement = document.getElementById('divElement');

	divElement.innerHTML = "hello world<br/>";
	divElement.innerHTML += "hello world<br/>";

	return;
}

window.addEventListener('load', onPageLoad, true);
