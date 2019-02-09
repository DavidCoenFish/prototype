const Core = require("core");
const WebGL = require("webgl");
const ManipulateDom = require("manipulatedom");
const Asset = require("./physicstest02/asset.js");

const StageGetForceSum = require("./physicstest02/stagegetforcesum.js");
const StageResolveForceSumVrsCollision = require("./physicstest02/stageresolveforcesumvrscollision.js");
const StageConstuctNewPos = require("./physicstest02/stageconstuctnewpos.js");
const StagePresent = require("./physicstest02/stagepresent.js");
const StagePrepNextLoop = require("./physicstest02/stageprepnextloop.js");

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

	const m_cameraAt = Core.Vector3.factoryFloat32(0.1436004489660263, 0.9684985876083374, -0.20344571769237518);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.04715469852089882, 0.19864559173583984, 0.9789367318153381);
	const m_cameraLeft = Core.Vector3.factoryFloat32(-0.9885119199752808, 0.15016987919807434, 0.017143500968813896);
	const m_cameraPos = Core.Vector3.factoryFloat32(-0.036003030836582184, -0.08070522546768188, 0.06495426595211029);

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

	//const m_stageConstuctNewPos = StageConstuctNewPos.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	const m_stagePresent = StagePresent.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	//const m_stagePrepNextLoop = StagePrepNextLoop.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);

	const m_quad0 = WebGL.ComponentScreenTextureQuad.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer.getTextureNewPos(), Core.Vector2.factoryFloat32(-1.0, 0.0), Core.Vector2.factoryFloat32(0.0, 1.0));
	const m_quad1 = WebGL.ComponentScreenTextureQuad.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer.getTexturePrevPos(), Core.Vector2.factoryFloat32(-1.0, -1.0), Core.Vector2.factoryFloat32(0.0, 0.0));

	//var m_frameCount = 350;
	var m_realTime = true;
	var m_step = (true === m_realTime);
	var m_prevTimeStamp = undefined;
	const m_clearColor = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 1.0);
	const animationFrameCallback = function(in_timestamp){
		m_fpsElement.update(in_timestamp);
		WebGL.WebGLContextWrapperHelper.clear(m_webGLContextWrapper, m_clearColor, 1.0);

		if (undefined !== m_prevTimeStamp){
			m_timeDelta = (in_timestamp - m_prevTimeStamp) / 1000.0;
		}
		m_camera.tick(m_timeDelta);

		m_prevTimeStamp = in_timestamp;
		
		m_timeDelta = 0.005;

		m_gridComponent.draw(m_webGLContextWrapper, m_webGLState);
		m_quad0.setTexture(m_dataServer.getTextureNewPos());
		m_quad0.draw(m_webGLContextWrapper, m_webGLState);
		m_quad1.setTexture(m_dataServer.getTexturePrevPos());
		m_quad1.draw(m_webGLContextWrapper, m_webGLState);

		//m_frameCount -= 1;
		//if (0 < m_frameCount){

		if(true === m_step){
			if (0.1 < m_timeDelta){
				m_timeDelta = 0.1;
			}
			if (0.0 < m_timeDelta){
				//m_stagePrepNextLoop.run();
				//m_stageGetForceSum.run();
				//m_stageResolveForceSumVrsCollision.run(); 
				//m_stageConstuctNewPos.run();
			}
			m_step = (true === m_realTime);
		}
		m_stagePresent.run();
		//ManipulateDom.AutoDownload.autoSnapShot(document, m_html5CanvasElement, "physics20190207_" + (350 - m_frameCount) + ".png");
		m_requestId = requestAnimationFrame(animationFrameCallback);

		//} //mframecount
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	ManipulateDom.Format.addSimpleBr(document, document.body);
	ManipulateDom.Button.addSimpleButton(document, document.body, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_camera.destroy();
		m_requestId = undefined;
		console.log("end");
		console.log(`	const m_cameraAt = Core.Vector3.factoryFloat32(${m_cameraAt.getX()}, ${m_cameraAt.getY()}, ${m_cameraAt.getZ()});
	const m_cameraUp = Core.Vector3.factoryFloat32(${m_cameraUp.getX()}, ${m_cameraUp.getY()}, ${m_cameraUp.getZ()});
	const m_cameraLeft = Core.Vector3.factoryFloat32(${m_cameraLeft.getX()}, ${m_cameraLeft.getY()}, ${m_cameraLeft.getZ()});
	const m_cameraPos = Core.Vector3.factoryFloat32(${m_cameraPos.getX()}, ${m_cameraPos.getY()}, ${m_cameraPos.getZ()});
	`);

		return;
	});
	ManipulateDom.Button.addSimpleButton(document, document.body, "step", function(in_event){
		m_step = true;
	});

	const m_fpsElement = ManipulateDom.ComponentFps.factory(document);
	document.body.appendChild(m_fpsElement.getElement());

	const m_camera = ManipulateDom.ComponentMouseKeyboardCamera.factory(m_html5CanvasElement, m_dataServer);
	const m_gridComponent = WebGL.ComponentWorldGrid.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer, 0.25, 8);

	return;
}


window.addEventListener("load", onPageLoad, true);
