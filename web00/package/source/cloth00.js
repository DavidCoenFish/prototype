const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");
const ComponentTestScene = require("./component-test-scene.js");
const TaskClear = require("./cloth00/taskclear.js");

/*
	aim is to test out a 2d grid (cloth) using a seperate pass to dampen the velocity
 */
const onPageLoad = function(){
	console.info("onPageLoad");

	const callbackPresent = function(){
	}
	const callbackStep = function(in_timeDeltaActual, in_timeDeltaAjusted){
		m_state.u_timeDelta = in_timeDeltaAjusted;
		Core.TaskHelper.runArray([m_taskClear]);
		m_camera.tick(in_timeDeltaActual);
	}
	const callbackStopUpdate = function(){
		m_camera.destroy();
		console.info("stop");
	}

	const m_componentTestScene = ComponentTestScene.factory(callbackPresent, callbackStep, callbackStopUpdate, WebGL.WebGLState.makeParam(false), document);
	const m_state = {
		"u_timeDelta" : 0.0,
		"m_webGLState" : m_componentTestScene.getWebGLState(),
		"m_resourceManager" : Core.ResourceManager.factory()
	};
	const m_camera = ManipulateDom.ComponentMouseKeyboardCamera.factory(m_componentTestScene.getCanvasElement(), m_state);

	const m_taskClear = TaskClear.factory(m_state);

	return;
}

window.addEventListener('load', onPageLoad, true);
