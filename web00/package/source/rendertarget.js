const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

const Task0 = require("./rendertarget/task0.js");
const Task1 = require("./rendertarget/task1.js");

const onPageLoad = function(){
	console.info("onPageLoad");

	const m_canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(document, 256, 256);
	const m_webGLState = WebGL.WebGLState.factory(m_canvaseElementWrapper.getElement(), WebGL.WebGLState.makeParam(false));

	const state = {
		"m_webGLState" : m_webGLState
	};

	const task0 = Task0.factory(state);
	const task1 = Task1.factory(state);

	Core.TaskHelper.runArray([task0, task1]);

	return;
}

window.addEventListener('load', onPageLoad, true);
