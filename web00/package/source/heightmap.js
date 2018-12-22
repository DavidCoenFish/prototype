const Core = require("core");
const WebGL = require("webgl");
const Stage0 = require("./heightmap/stage0.js");
const Stage1 = require("./heightmap/stage1.js");
const Stage2 = require("./heightmap/stage2.js");
const CelticKnotTile = require("./heightmap/resource/celticknottile.js");

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
		"celticTile" : CelticKnotTile.factory
	});

	const stage0 = Stage0.factory(webGLContextWrapper, width, height, resourceManager);
	//const stage1 = Stage1.factory(webGLContextWrapper, stage0.getTexture(), width, height);
	const stage2 = Stage2.factory(webGLContextWrapper, stage0.getTexture());

	stage0.draw(webGLContextWrapper, webGLState);
	//stage1.draw(webGLContextWrapper, webGLState);
	stage2.draw(webGLContextWrapper, webGLState);

	return;
}

window.addEventListener('load', onPageLoad, true);
