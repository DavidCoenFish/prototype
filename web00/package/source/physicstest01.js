const Core = require("core");
const WebGL = require("webgl");
const ManipulateDom = require("manipulatedom");
//const Asset = require("./physicstest01/asset.js");
const Asset = require("./physicstest01/assetdebug.js");
//const Asset = require("./physicstest01/assetdebug2.js");
//const Asset = require("./physicstest01/assetdebug3.js");

const StageGetForceSum = require("./physicstest01/stagegetforcesum.js");
const StageResolveForceSumVrsCollision = require("./physicstest01/stageresolveforcesumvrscollision.js");
const StageConstuctNewPos = require("./physicstest01/stageconstuctnewpos.js");
const StagePresent = require("./physicstest01/stagepresent.js");
const StagePrepNextLoop = require("./physicstest01/stageprepnextloop.js");

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
		"OES_texture_float"//,
		//"EXT_color_buffer_float"
	]);
	const m_webGLContextWrapper = WebGL.WebGLContextWrapper.factory(m_html5CanvasElement, m_webGLContextWrapperParam);
	const m_webGLState = WebGL.WebGLState.factory(m_webGLContextWrapper);
	const m_resourceManager = Core.ResourceManager.factory({
		"model" : Asset.factoryModel,
		"model_texture" : Asset.factoryTexture,
	});

	const m_viewportWidthHeightWidthhalfHeighthalf = Core.Vector4.factoryFloat32(m_width, m_height, m_width / 2.0, m_height / 2.0);
	const m_cameraAt = Core.Vector3.factoryFloat32(-0.17204129695892334, 0.9847173094749451, -0.027092771604657173);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.04971622675657272, 0.03614601865410805, 0.9981092810630798);
	const m_cameraLeft = Core.Vector3.factoryFloat32(-0.9838346838951111, -0.17036838829517365, 0.05517512187361717);
	const m_cameraPos = Core.Vector3.factoryFloat32(-0.5217249393463135, -1.4198795557022095, 1.0516513586044312);

	const m_cameraFovhFovvFar = Core.Vector3.factoryFloat32(120.0, 120.0, 10.0);

	var m_timeDelta = 0.0;
	const m_textureArray = [];
	m_textureArray.push(m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper));
	m_textureArray.push(m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper));
	m_textureArray.push(m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper));
	const m_textureWidth = m_textureArray[0].getWidth();
	const m_textureHeight = m_textureArray[0].getHeight();

	const m_renderTargetArray = [];
	m_renderTargetArray.push(WebGL.RenderTargetWrapper.factory(
		m_webGLContextWrapper, m_textureWidth, m_textureHeight,
		[ WebGL.RenderTargetData.factory(m_textureArray[0], "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	));
	m_renderTargetArray.push(WebGL.RenderTargetWrapper.factory(
		m_webGLContextWrapper, m_textureWidth, m_textureHeight,
		[ WebGL.RenderTargetData.factory(m_textureArray[1], "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	));
	m_renderTargetArray.push(WebGL.RenderTargetWrapper.factory(
		m_webGLContextWrapper, m_textureWidth, m_textureHeight,
		[ WebGL.RenderTargetData.factory(m_textureArray[2], "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	));

	var m_renderTargetIndex = 0;

	var m_textureForceSum = WebGL.TextureWrapper.factoryFloatRGB(m_webGLContextWrapper, m_textureWidth, m_textureHeight);
	var m_textureCollisionResolvedForceSum = WebGL.TextureWrapper.factoryFloatRGB(m_webGLContextWrapper, m_textureWidth, m_textureHeight);

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
			return m_textureArray[(m_renderTargetIndex + 2) % 3];
		},
		"getTexturePrevPos" : function(){
			return m_textureArray[(m_renderTargetIndex + 1) % 3];
		},
		"getTexturePrevPrevPos" : function(){
			return m_textureArray[(m_renderTargetIndex + 0) % 3];
		},
		"getTextureForceSum" : function(){
			return m_textureForceSum;
		},
		"getTextureCollisionResolvedForceSum" : function(){
			return m_textureCollisionResolvedForceSum;
		},

		"getRenderTargetNewPos" : function(){
			return m_renderTargetArray[(m_renderTargetIndex + 2) % 3];
		},
		"getRenderTargetPrevPos" : function(){
			return m_renderTargetArray[(m_renderTargetIndex + 1) % 3];
		},
		"getRenderTargetPrevPrevPos" : function(){
			return m_renderTargetArray[(m_renderTargetIndex + 0) % 3];
		},

		"cycleTextures" : function(){
			m_renderTargetIndex = (m_renderTargetIndex + 1) % 3;
			return;
		},
	};

	const m_stageGetForceSum = StageGetForceSum.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stageResolveForceSumVrsCollision = StageResolveForceSumVrsCollision.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stageConstuctNewPos = StageConstuctNewPos.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stagePresent = StagePresent.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stagePrepNextLoop = StagePrepNextLoop.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);

	const m_quad0 = WebGL.ComponentScreenTextureQuad.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer.getTextureForceSum(), Core.Vector2.factoryFloat32(-1.0, 0.0), Core.Vector2.factoryFloat32(0.0, 1.0));
	const m_quad1 = WebGL.ComponentScreenTextureQuad.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer.getTextureCollisionResolvedForceSum(), Core.Vector2.factoryFloat32(-1.0, -1.0), Core.Vector2.factoryFloat32(0.0, 0.0));

	//var m_frameCount = 100;
	var m_useTimeStep = false;
	var m_step = (false === m_useTimeStep);
	var m_prevTimeStamp = undefined;
	const m_clearColor = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 1.0);
	const animationFrameCallback = function(in_timestamp){
		m_fpsElement.update(in_timestamp);
		WebGL.WebGLContextWrapperHelper.clear(m_webGLContextWrapper, m_clearColor, 1.0);

		if (undefined !== m_prevTimeStamp){
			m_timeDelta = (in_timestamp - m_prevTimeStamp) / 1000.0;
		}
		m_prevTimeStamp = in_timestamp;

		m_timeDelta = 0.015;

		m_gridComponent.draw(m_webGLContextWrapper, m_webGLState);
		m_quad0.setTexture(m_dataServer.getTexturePrevPos());
		m_quad0.draw(m_webGLContextWrapper, m_webGLState);
		m_quad1.setTexture(m_dataServer.getTextureNewPos());
		m_quad1.draw(m_webGLContextWrapper, m_webGLState);

		//m_frameCount -= 1;
		//if (0 < m_frameCount){

		if(true === m_step){
			if (0.1 < m_timeDelta){
				m_timeDelta = 0.1;
			}
			if (0.0 < m_timeDelta){
				m_stagePrepNextLoop.run();
				m_stageGetForceSum.run();
				m_stageResolveForceSumVrsCollision.run(); 
				m_stageConstuctNewPos.run();
			}
			m_step = (false === m_useTimeStep);
		}
		m_stagePresent.run();
		//ManipulateDom.AutoDownload.autoSnapShot(document, m_html5CanvasElement, "physics20190202_" + (100 - m_frameCount) + ".png");
		m_requestId = requestAnimationFrame(animationFrameCallback);

		//} //mframecount
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	ManipulateDom.Format.addSimpleBr(document, document.body);
	ManipulateDom.Button.addSimpleButton(document, document.body, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_requestId = undefined;
		console.log("end");
		console.log("	const m_cameraAt = Core.Vector3.factoryFloat32(" + m_cameraAt.getX() + ", " + m_cameraAt.getY() + ", " + m_cameraAt.getZ() + ");//");
		console.log("	const m_cameraUp = Core.Vector3.factoryFloat32(" + m_cameraUp.getX() + ", " + m_cameraUp.getY() + ", " + m_cameraUp.getZ() + ");//");
		console.log("	const m_cameraLeft = Core.Vector3.factoryFloat32(" + m_cameraLeft.getX() + ", " + m_cameraLeft.getY() + ", " + m_cameraLeft.getZ() + ");//");
		console.log("	const m_cameraPos = Core.Vector3.factoryFloat32(" + m_cameraPos.getX() + ", " + m_cameraPos.getY() + ", " + m_cameraPos.getZ() + ");//");

		return;
	});
	ManipulateDom.Button.addSimpleButton(document, document.body, "step", function(in_event){
		m_step = true;
	});

	const m_fpsElement = ManipulateDom.ComponentFps.factory(document);
	document.body.appendChild(m_fpsElement.getElement());

	const m_dragCamera = ManipulateDom.ComponentClickDragCamera.factory(m_html5CanvasElement, m_dataServer);
	const m_gridComponent = WebGL.ComponentWorldGrid.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer, 0.25, 8);

	return;
}


window.addEventListener("load", onPageLoad, true);
