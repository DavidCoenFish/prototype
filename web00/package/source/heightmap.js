const WebGL = require("webgl");
const Stage0 = require("./heightmap/stage0.js");
const Stage1 = require("./heightmap/stage1.js");

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, 
		[
			//"EXT_color_buffer_float",
			"OES_texture_float"
		]);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	const stage0 = Stage0.factory(webGLContextWrapper);
	const stage1 = Stage1.factory(webGLContextWrapper, stage0.getTexture());

	stage0.draw(webGLContextWrapper, webGLState);
	stage1.draw(webGLContextWrapper, webGLState);

	return;
}

window.addEventListener('load', onPageLoad, true);
