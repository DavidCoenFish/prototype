const Core = require("core");
const WebGL = require("webgl");
const Stage0 = require("./celticknot/stage0.js");
const CelticKnotTile = require("./celticknot/celticknottile.js");
const ModelCelticKnot = require("./celticknot/modelcelticknot.js");
const Shader0 = require("./celticknot/shader0.js");

/* */
const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	var width = undefined;
	var height = undefined;
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
		width = html5CanvasElement.width;
		height = html5CanvasElement.height;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, [
		"OES_texture_float"
	]);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	const resourceManager = Core.ResourceManager.factory({
		"celticKnotTile" : CelticKnotTile.factory,
		"modelCelticKnot" : ModelCelticKnot.factory,
		"shader0" : Shader0.factory,
	});

	const stage0 = Stage0.factory(webGLContextWrapper, resourceManager, width, height, 32, 32);

	stage0.draw(webGLContextWrapper, webGLState);

	return;
}

window.addEventListener('load', onPageLoad, true);
