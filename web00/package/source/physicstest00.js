const Core = require("core");
const WebGL = require("webgl");
const ManipulateDom = require("manipulatedom");
const Asset = require("./physicstest00/asset.js");

const StageGetForceSum = require("./physicstest00/stagegetforcesum.js");
const StageResolveForceSumVrsCollision = require("./physicstest00/stageresolveforcesumvrscollision.js");
const StageConstuctNewPos = require("./physicstest00/stageconstuctnewpos.js");
const StagePresent = require("./physicstest00/stagepresent.js");
const StagePrepNextLoop = require("./physicstest00/stageprepnextloop.js");

/*
get force sum 
	input [prev_prev_pos, prev_pos]
	output [force_sum]
	(gravity, velocity)
resolve force sum vrs collision
	input [prev_pos, force_sum]
	output [collision_resolved_force_sum]
	(if force would result in penetration, add force to counteract. todo: friction)
constuct new pos
	input [prev_pos, collision_resolved_force_sum]
	output [new_pos]
present
	input [new_pos]
prep next loop
	prev_pos => prev_prev_pos
	new_pos => prev_pos

 */

const onPageLoad = function(){
	console.info("onPageLoad");

	const m_html5CanvasElement = (undefined !== document) ? document.getElementById("html5CanvasElement") : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	var m_width;
	var m_height;
	if (undefined !== m_html5CanvasElement){
		m_html5CanvasElement.width = m_html5CanvasElement.clientWidth;
		m_html5CanvasElement.height = m_html5CanvasElement.clientHeight;
		m_width = m_html5CanvasElement.width;
		m_height = m_html5CanvasElement.height;
	}

	const m_webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, true, true, [
		"OES_texture_float"
	]);
	const m_webGLContextWrapper = WebGL.WebGLContextWrapper.factory(m_html5CanvasElement, m_webGLContextWrapperParam);
	const m_webGLState = WebGL.WebGLState.factory(m_webGLContextWrapper);
	const m_resourceManager = Core.ResourceManager.factory({
		"model" : Asset.factoryModel,
		"model_texture" : Asset.factoryTexture,
	});

	const m_viewportWidthHeightWidthhalfHeighthalf = Core.Vector4.factoryFloat32(m_width, m_height, m_width / 2.0, m_height / 2.0);
	const m_cameraAt = Core.Vector3.factoryFloat32(0.0, 1.0, 0.0);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.0, 0.0, 1.0);
	const m_cameraLeft = Core.Vector3.factoryFloat32(-1.0, 0.0, 0.0);
	const m_cameraPos = Core.Vector3.factoryFloat32(0.0, -1.0, 0.0);
	const m_cameraFovhFovvFar = Core.Vector3.factoryFloat32(120.0, 120.0, 10.0);
	var m_timeDelta = 0.0;
	var m_textureNewPos = m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper);

	const m_dataServer = {
		"getCameraPos" : function(){
			return m_cameraPos;
		},
		"getCameraAt" : function(){
			return m_cameraAt;
		},
		"getCameraLeft" : function(){
			return m_cameraLeft;
		},
		"getCameraUp" : function(){
			return m_cameraUp;
		},
		"getCameraFovhFovvFar" : function(){
			return m_cameraFovhFovvFar;
		},
		"getViewportWidthHeightWidthhalfHeighthalf" : function(){
			return m_viewportWidthHeightWidthhalfHeighthalf;
		},
		"getTimeDelta" : function(){
			return m_timeDelta;
		},
		"getTextureNewPos" : function(){
			return m_textureNewPos;
		}
	};

	const m_stageGetForceSum = StageGetForceSum.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stageResolveForceSumVrsCollision = StageResolveForceSumVrsCollision.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stageConstuctNewPos = StageConstuctNewPos.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stagePresent = StagePresent.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stagePrepNextLoop = StagePrepNextLoop.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);

	var m_prevTimeStamp = undefined;
	const m_clearColor = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 1.0);
	const animationFrameCallback = function(in_timestamp){
		m_fpsElement.update(in_timestamp);
		WebGL.WebGLContextWrapperHelper.clear(m_webGLContextWrapper, m_clearColor, 1.0);

		if (undefined !== m_prevTimeStamp){
			m_timeDelta = in_timestamp - m_prevTimeStamp;
		}
		m_prevTimeStamp = in_timestamp;

		m_stageGetForceSum.run();
		m_stageResolveForceSumVrsCollision.run(); 
		m_stageConstuctNewPos.run();
		m_stagePresent.run();
		m_stagePrepNextLoop.run();

		m_gridComponent.draw(m_webGLContextWrapper, m_webGLState);
		m_requestId = requestAnimationFrame(animationFrameCallback);
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	ManipulateDom.Format.addSimpleBr(document, document.body);
	ManipulateDom.Button.addSimpleButton(document, document.body, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_requestId = undefined;
		console.log("end");
		return;
	});
	const m_fpsElement = ManipulateDom.ComponentFps.factory(document);
	document.body.appendChild(m_fpsElement.getElement());

	const m_dragCamera = ManipulateDom.ComponentClickDragCamera.factory(m_html5CanvasElement, m_dataServer);
	const m_gridComponent = WebGL.ComponentWorldGrid.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer, 0.25, 8);

	return;
}


window.addEventListener("load", onPageLoad, true);
