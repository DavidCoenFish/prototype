const Core = require("core");
const WebGL = require("webgl");
const ComponentTestScene = require("component-test-scene.js");
const Asset = require("./physicstest02/asset.js");

const StageForceSum0 = require("./physicstest02/stageforcesum0.js");
const StageForceSum1 = require("./physicstest02/stageforcesum1.js");
const StagePresent = require("./physicstest02/stagepresent.js");
const StageConstuctNewPos = require("./physicstest02/stageconstuctnewpos.js");
const StagePrepNextLoop = require("./physicstest02/stageprepnextloop.js");

/*

//get force sum (velocity, gravity, collision, volume, dampen)
force sum 0 (velocity, gravity, collision)
	input sphere pos -2
	input sphere pos -1
	output force texture 0
force sum 1 (volume spring, dampen)
	input force texture 0
	input sphere pos -1
	input volume data 0,1,2,3,4
	output force texture 1

construct new pos
	input force texture 0
	input sphere pos -1
	output sphere pos

 */


const onPageLoad = function(){
	console.info("onPageLoad");

	const m_resourceManager = Core.ResourceManager.factory({
		"model" : Asset.factoryModel,
		"model_texture" : Asset.factoryTexSpherePos,
		"textureVolume0" : Asset.factoryTexVolume0,
		"textureVolume1" : Asset.factoryTexVolume1,
		"textureVolume2" : Asset.factoryTexVolume2,
		"textureVolume3" : Asset.factoryTexVolume3,
		"textureVolume4" : Asset.factoryTexVolume4,
	});
	const m_viewportWidthHeightWidthhalfHeighthalf = Core.Vector4.factoryFloat32(m_width, m_height, m_width / 2.0, m_height / 2.0);
	const m_cameraFovhFovvFar = Core.Vector3.factoryFloat32(120.0, 120.0, 10.0);
	const m_cameraAt = Core.Vector3.factoryFloat32(0.1436004489660263, 0.9684985876083374, -0.20344571769237518);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.04715469852089882, 0.19864559173583984, 0.9789367318153381);
	const m_cameraLeft = Core.Vector3.factoryFloat32(-0.9885119199752808, 0.15016987919807434, 0.017143500968813896);
	const m_cameraPos = Core.Vector3.factoryFloat32(-0.036003030836582184, -0.08070522546768188, 0.06495426595211029);

	const stateObject = {
		"getResourceManager" : function(){
			return m_resourceManager;
		},
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
	};
	ComponentTestScene.factory(
		stateObject,
		callbackPresent,
		callbackStep,
		callbackStopUpdate,
		WebGL.WebGLContextWrapper.makeParamObject(false, true, true, ["OES_texture_float"]),
		document,
		undefined, //in_timeDeltaOverrideOrUndefined,
		false, //in_stepMode, //if true, we start paused, and only advance on clicking the step button
		undefined, //in_frameCountOrUndefined,
		undefined //in_saveEachFrameFileNameOrUndefined
		);

	const callbackPresent = function(){
	// 	m_stagePresent.run();
	}
	const callbackStep = function(in_timeDelta){
	// 	m_stagePrepNextLoop.run();
	// 	m_stageForceSum0.run();
	// 	m_stageForceSum1.run();
	// 	m_stageConstuctNewPos.run();
	}
	const callbackStopUpdate = function(){
		console.log("end");
		console.log(`	const m_cameraAt = Core.Vector3.factoryFloat32(${m_cameraAt.getX()}, ${m_cameraAt.getY()}, ${m_cameraAt.getZ()});
	const m_cameraUp = Core.Vector3.factoryFloat32(${m_cameraUp.getX()}, ${m_cameraUp.getY()}, ${m_cameraUp.getZ()});
	const m_cameraLeft = Core.Vector3.factoryFloat32(${m_cameraLeft.getX()}, ${m_cameraLeft.getY()}, ${m_cameraLeft.getZ()});
	const m_cameraPos = Core.Vector3.factoryFloat32(${m_cameraPos.getX()}, ${m_cameraPos.getY()}, ${m_cameraPos.getZ()});
	`);
	}

	return;
}

window.addEventListener("load", onPageLoad, true);

	// var m_timeDelta = 0.0;
	// const m_textureArray = [];
	// m_textureArray.push(m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper));
	// m_textureArray.push(m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper));
	// m_textureArray.push(m_resourceManager.getUniqueReference("model_texture", m_webGLContextWrapper));
	// const m_textureWidth = m_textureArray[0].getWidth();
	// const m_textureHeight = m_textureArray[0].getHeight();
	// const m_textureForceSum0 = WebGL.TextureWrapper.factoryFloatRGB(m_webGLContextWrapper, m_textureWidth, m_textureHeight);
	// const m_textureForceSum1 = WebGL.TextureWrapper.factoryFloatRGB(m_webGLContextWrapper, m_textureWidth, m_textureHeight);
	// const m_textureVolumeData0 = m_resourceManager.getUniqueReference("textureVolume0", m_webGLContextWrapper);
	// const m_textureVolumeData1 = m_resourceManager.getUniqueReference("textureVolume1", m_webGLContextWrapper);
	// const m_textureVolumeData2 = m_resourceManager.getUniqueReference("textureVolume2", m_webGLContextWrapper);
	// const m_textureVolumeData3 = m_resourceManager.getUniqueReference("textureVolume3", m_webGLContextWrapper);
	// const m_textureVolumeData4 = m_resourceManager.getUniqueReference("textureVolume4", m_webGLContextWrapper);

	// const m_renderTargetArray = [];
	// m_renderTargetArray.push(WebGL.RenderTargetWrapper.factory(
	// 	m_webGLContextWrapper, m_textureWidth, m_textureHeight,
	// 	[ WebGL.RenderTargetData.factory(m_textureArray[0], "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	// ));
	// m_renderTargetArray.push(WebGL.RenderTargetWrapper.factory(
	// 	m_webGLContextWrapper, m_textureWidth, m_textureHeight,
	// 	[ WebGL.RenderTargetData.factory(m_textureArray[1], "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	// ));
	// m_renderTargetArray.push(WebGL.RenderTargetWrapper.factory(
	// 	m_webGLContextWrapper, m_textureWidth, m_textureHeight,
	// 	[ WebGL.RenderTargetData.factory(m_textureArray[2], "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D") ]
	// ));

	//var m_renderTargetIndex = 0;

	// const m_dataServer = {
	// 	"getTimeDelta" : function(){
	// 		return m_timeDelta;
	// 	},
	// 	"getTextureNewPos" : function(){
	// 		return m_textureArray[(m_renderTargetIndex + 2) % 3];
	// 	},
	// 	"getTexturePrevPos" : function(){
	// 		return m_textureArray[(m_renderTargetIndex + 1) % 3];
	// 	},
	// 	"getTexturePrevPrevPos" : function(){
	// 		return m_textureArray[(m_renderTargetIndex + 0) % 3];
	// 	},

	// 	"getTextureForceSum0" : function(){
	// 		return m_textureForceSum0;
	// 	},
	// 	"getTextureForceSum1" : function(){
	// 		return m_textureForceSum1;
	// 	},
	// 	"getTextureVolumeData0" : function(){
	// 		return m_textureVolumeData0;
	// 	},
	// 	"getTextureVolumeData1" : function(){
	// 		return m_textureVolumeData1;
	// 	},
	// 	"getTextureVolumeData2" : function(){
	// 		return m_textureVolumeData2;
	// 	},
	// 	"getTextureVolumeData3" : function(){
	// 		return m_textureVolumeData3;
	// 	},
	// 	"getTextureVolumeData4" : function(){
	// 		return m_textureVolumeData4;
	// 	},

	// 	"getRenderTargetNewPos" : function(){
	// 		return m_renderTargetArray[(m_renderTargetIndex + 2) % 3];
	// 	},
	// 	"getRenderTargetPrevPos" : function(){
	// 		return m_renderTargetArray[(m_renderTargetIndex + 1) % 3];
	// 	},
	// 	"getRenderTargetPrevPrevPos" : function(){
	// 		return m_renderTargetArray[(m_renderTargetIndex + 0) % 3];
	// 	},

	// 	"cycleTextures" : function(){
	// 		m_renderTargetIndex = (m_renderTargetIndex + 1) % 3;
	// 		return;
	// 	},
	// };

	// const m_stagePresent = StagePresent.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	// const m_stageConstuctNewPos = StageConstuctNewPos.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	// const m_stagePrepNextLoop = StagePrepNextLoop.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	// const m_stageForceSum0 = StageForceSum0.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);
	// const m_stageForceSum1 = StageForceSum1.factory(m_resourceManager, m_webGLContextWrapper, m_webGLState, m_dataServer);

	// const m_quad0 = WebGL.ComponentScreenTextureQuad.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer.getTextureNewPos(), Core.Vector2.factoryFloat32(-1.0, 0.0), Core.Vector2.factoryFloat32(0.0, 1.0));
	// const m_quad1 = WebGL.ComponentScreenTextureQuad.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer.getTexturePrevPos(), Core.Vector2.factoryFloat32(-1.0, -1.0), Core.Vector2.factoryFloat32(0.0, 0.0));


	//var m_frameCount = 350;
	// const m_clearColor = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 1.0);
	// WebGL.WebGLContextWrapperHelper.clear(m_webGLContextWrapper, m_clearColor, 1.0);
	// m_camera.tick(m_timeDelta);
	// m_gridComponent.draw(m_webGLContextWrapper, m_webGLState);
	// m_quad0.setTexture(m_dataServer.getTextureNewPos());
	// m_quad0.draw(m_webGLContextWrapper, m_webGLState);
	// m_quad1.setTexture(m_dataServer.getTexturePrevPos());
	// m_quad1.draw(m_webGLContextWrapper, m_webGLState);

	// 	m_stagePrepNextLoop.run();
	// 	m_stageForceSum0.run();
	// 	m_stageForceSum1.run();
	// 	m_stageConstuctNewPos.run();

	// 	m_stagePresent.run();
	// 	m_requestId = requestAnimationFrame(animationFrameCallback);

	// const m_camera = ManipulateDom.ComponentMouseKeyboardCamera.factory(m_html5CanvasElement, m_dataServer);
	// const m_gridComponent = WebGL.ComponentWorldGrid.factory(m_resourceManager, m_webGLContextWrapper, m_dataServer, 0.25, 8);

