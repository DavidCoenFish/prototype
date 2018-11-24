const WebGL = require("webgl");
const Math = require("math");

const sVertexShader = "";
const sFragmentShader = "";

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);

	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam, draw);

	const colour = Math.Colour4.factoryFloat32(1.0, 0.0, 0.0, 1.0);
	const shader = webGLContextWrapper.createShader(sVertexShader, sFragmentShader);
	const material = webGLContextWrapper.createMaterial(shader);
	const model = webGLContextWrapper.createModel({"pos" : sPosStream}, "TRIANGLES");
	const draw = function(in_webGLContextWrapper)
	{
		in_webGLContextWrapper.clear(colour);
		in_webGLContextWrapper.setMaterial(shader);
		in_webGLContextWrapper.drawModel(model);
		return;
	}

	draw(webGLContextWrapper);

	return;
}

window.addEventListener('load', onPageLoad, true);
