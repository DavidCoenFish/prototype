const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

const onPageLoad = function(){
	console.info("onPageLoad");

	const canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(document, 512, 256);
	const webGLState = WebGL.WebGLState.factory(canvaseElementWrapper.getElement());

	const colour = Core.Colour4.factoryFloat32(1.0, 0.0, 0.0, 1.0);
	webGLState.clear(colour);

	return;
}

window.addEventListener('load', onPageLoad, true);
