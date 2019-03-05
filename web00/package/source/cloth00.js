const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");
const ComponentTestScene = require("./component-test-scene.js");
const Asset = require("./cloth00/asset.js");
const TaskClear = require("./cloth00/taskclear.js");
const TaskDrawGrid = require("./cloth00/taskdrawgrid.js");
const TaskDebugScreenTexture = require("./cloth00/taskdebugscreentexture.js");
const TaskPresent = require("./cloth00/taskpresent.js");
const TaskPrepInput = require("./cloth00/taskprepinput.js");
const TaskCalculateForce = require("./cloth00/taskcalculateforce.js");
const TaskUpdatePosition = require("./cloth00/taskupdateposition.js");

const TaskContraintCollision = require("./cloth00/taskconstraintcollision.js");
const TaskContraintSpring = require("./cloth00/taskconstraintspring.js");
const TaskContraintVelocityDampen = require("./cloth00/taskconstraintvelocitydampen.js");

/*
	aim is to test out a 2d grid (cloth) using a seperate pass to dampen the velocity

	task prep input
		new pos => pos => pos prev
	taskCalculateForce
		take pos, and pos previous, and generate force texture (add gravity?)
		in pos
		in pos prev
		out force
	task constraint collision
		in pos
		in force
		out force
	task constraint cloth spring
		in pos
		in force
		out force
	task constraint velocity dampen
		in pos
		in force
		out force
	task update position
		in pos
		in force
		out new pos

 */

const onPageLoad = function(){
	console.info("onPageLoad");
	const callbackPresent = function(){
		Core.TaskHelper.runArray([
			m_taskClear, 
			m_taskDrawGrid, 
			m_taskDebugScreenTexture, 
			m_taskPresent
			]);
		return;
	}
	const callbackStep = function(in_timeDeltaActual, in_timeDeltaAjusted){
		m_camera.tick(in_timeDeltaActual);
		m_state.u_timeDelta = in_timeDeltaAjusted;
		Core.TaskHelper.runArray([
			m_taskPrepInput,
			m_taskCalculateForce,
			m_taskContraintCollision,
			m_taskContraintSpring,
			m_taskContraintVelocityDampen,
			m_taskUpdatePosition
			]);
		m_state.u_timeDeltaPrev = m_state.u_timeDelta;
		return;
	}
	const callbackStopUpdate = function(){
		m_camera.destroy();
		console.info("stop");
		var message = "";
		message += `		"u_cameraPos" : [${m_state.u_cameraPos[0]}, ${m_state.u_cameraPos[1]}, ${m_state.u_cameraPos[2]}],\n`;
		message += `		"u_cameraAt" : [${m_state.u_cameraAt[0]}, ${m_state.u_cameraAt[1]}, ${m_state.u_cameraAt[2]}],\n`;
		message += `		"u_cameraLeft" : [${m_state.u_cameraLeft[0]}, ${m_state.u_cameraLeft[1]}, ${m_state.u_cameraLeft[2]}],\n`;
		message += `		"u_cameraUp" : [${m_state.u_cameraUp[0]}, ${m_state.u_cameraUp[1]}, ${m_state.u_cameraUp[2]}],\n`;
		console.log(message);
		return;
	}

	const m_componentTestScene = ComponentTestScene.factory(
		callbackPresent, 
		callbackStep, 
		callbackStopUpdate, 
		WebGL.WebGLState.makeParam(false, true, true, ["OES_texture_float"]), 
		document);
	const m_webGLState = m_componentTestScene.getWebGLState();
	const m_resourceManager = Core.ResourceManager.factory();

	const m_canvasWidth = m_webGLState.getCanvasWidth();
	const m_canvasHeight = m_webGLState.getCanvasHeight();

	const m_state = {
		"u_timeDelta" : 0.0,
		"u_timeDeltaPrev" : 0.0,
		"u_viewportWidthHeightWidthhalfHeighthalf" : Core.Vector4.factoryFloat32(m_canvasWidth, m_canvasHeight, m_canvasWidth / 2.0, m_canvasHeight / 2.0).getRaw(),
		"u_cameraFovhFovvFar" : Core.Vector3.factoryFloat32(90.0, 90.0, 100.0).getRaw(),
		"u_cameraPos" : [-0.7398508191108704, 2.9275126457214355, 0.9037196040153503],
		"u_cameraAt" : [0.3491857945919037, -0.9339750409126282, -0.0758940726518631],
		"u_cameraLeft" : [0.9350206851959229, 0.3526155948638916, -0.0373971126973629],
		"u_cameraUp" : [0.06168940290808678, -0.05790398642420769, 0.9964143633842468],
	};
	Asset.registerAssets(m_resourceManager, m_webGLState);

	const m_camera = ManipulateDom.ComponentMouseKeyboardCamera.factory(m_componentTestScene.getCanvasElement(), m_state);
	
	const m_taskPrepInput = TaskPrepInput.factory(m_resourceManager, m_webGLState, m_state, Asset.sTexturePosName);
	const m_taskCalculateForce = TaskCalculateForce.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);
	const m_taskContraintCollision = TaskContraintCollision.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);
	const m_taskContraintSpring = TaskContraintSpring.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);
	const m_taskContraintVelocityDampen = TaskContraintVelocityDampen.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);

	const m_taskUpdatePosition = TaskUpdatePosition.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);

	const m_taskClear = TaskClear.factory(m_resourceManager, m_webGLState, m_state);
	const m_taskDrawGrid = TaskDrawGrid.factory(m_resourceManager, m_webGLState, m_state);
	const m_taskDebugScreenTexture = TaskDebugScreenTexture.factory(m_resourceManager, m_webGLState, m_taskPrepInput);
	const m_taskPresent = TaskPresent.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);

	return;
}

window.addEventListener('load', onPageLoad, true);
