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
const TaskContraintCollisionSphere = require("./cloth00/taskconstraintcollisionsphere.js");
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
		if (0 < in_timeDeltaAjusted){
			m_state.u_timeDelta = in_timeDeltaAjusted;
			Core.TaskHelper.runArray([
				m_taskPrepInput,
				m_taskCalculateForce,
				m_taskContraintCollision,
				m_taskContraintCollisionSphere,
				m_taskContraintSpring,
				//m_taskContraintVelocityDampen,
				m_taskUpdatePosition
				]);
			m_state.u_timeDeltaPrev = in_timeDeltaAjusted;
		}
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
		document, 
		//true,
		//0.016666, //undefined//0.01
		);
	const m_webGLState = m_componentTestScene.getWebGLState();
	const m_resourceManager = Core.ResourceManager.factory();

	const m_canvasWidth = m_webGLState.getCanvasWidth();
	const m_canvasHeight = m_webGLState.getCanvasHeight();

	const m_state = {
		"u_timeDelta" : 0.0,
		"u_timeDeltaPrev" : 0.0,
		"u_viewportWidthHeightWidthhalfHeighthalf" : Core.Vector4.factoryFloat32(m_canvasWidth, m_canvasHeight, m_canvasWidth / 2.0, m_canvasHeight / 2.0).getRaw(),
		"u_cameraFovhFovvFar" : Core.Vector3.factoryFloat32(90.0, 90.0, 100.0).getRaw(),
		// "u_cameraPos" : [-1.0719465017318725, 8.465320587158203, 6.531123638153076],
		// "u_cameraAt" : [0.4652847945690155, -0.8222289681434631, -0.3277950882911682],
		// "u_cameraLeft" : [0.8832346796989441, 0.4556824564933777, 0.1106799840927124],
		// "u_cameraUp" : [0.05836617946624756, -0.3410176932811737, 0.9382432103157043],
		"u_cameraPos" : [-0.5422263145446777, 2.572321891784668, 2.031367540359497],
		"u_cameraAt" : [0.39100712537765503, -0.7689058780670166, -0.505862832069397],
		"u_cameraLeft" : [0.9099526405334473, 0.4054783284664154, 0.08702617883682251],
		"u_cameraUp" : [0.13820147514343262, -0.49433907866477966, 0.8582128286361694],
	};
	Asset.registerAssets(m_resourceManager, m_webGLState);

	const m_camera = ManipulateDom.ComponentMouseKeyboardCamera.factory(m_componentTestScene.getCanvasElement(), m_state);
	
	const m_taskPrepInput = TaskPrepInput.factory(m_resourceManager, m_webGLState, m_state, Asset.sTexturePosName);
	const m_taskCalculateForce = TaskCalculateForce.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);
	const m_taskContraintCollision = TaskContraintCollision.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);
	const m_taskContraintCollisionSphere = TaskContraintCollisionSphere.factory(m_resourceManager, m_webGLState, m_state, Asset.sModelName);
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
