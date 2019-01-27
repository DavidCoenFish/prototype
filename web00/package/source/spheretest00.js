const Core = require("core");
const WebGL = require("webgl");
const ManipulateDom = require("manipulatedom");
const Model = require("./spheretest00/model.js");
const Shader = require("./spheretest00/shader.js");
const Material = require("./spheretest00/material.js");


const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById("html5CanvasElement") : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	var m_width;
	var m_height;
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
		m_width = html5CanvasElement.width;
		m_height = html5CanvasElement.height;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, true, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);

	const resourceManager = Core.ResourceManager.factory({
		"model" : Model.factory,
		"shader" : Shader.factory,
		"material" : Material.factory,
	});

	const m_mapValues = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : function(localWebGLContextWrapper, in_position){
			WebGL.WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, m_viewportWidthHeightWidthhalfHeighthalf.getRaw());
		},
		"u_cameraAt" : function(localWebGLContextWrapper, in_position){
			WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraAt.getRaw());
		},
		"u_cameraUp" : function(localWebGLContextWrapper, in_position){
			WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraUp.getRaw());
		},
		"u_cameraLeft" : function(localWebGLContextWrapper, in_position){
			WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraLeft.getRaw());
		},
		"u_cameraPos" : function(localWebGLContextWrapper, in_position){
			WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraPos.getRaw());
		},
		"u_cameraFovhFovvFar" : function(localWebGLContextWrapper, in_position){
			WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraFovhFovvFar.getRaw());
		},
	};
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key in m_mapValues){
				m_mapValues[in_key](localWebGLContextWrapper, in_position);
			}
		}
	}

	const m_shader = resourceManager.getCommonReference("shader", webGLContextWrapper, m_uniformServer);
	const m_material = resourceManager.getCommonReference("material", m_shader);
	const m_model = resourceManager.getCommonReference("model", webGLContextWrapper);


	var m_timestamp;
	const m_clearColor = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 0.0);
	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);
	const animationFrameCallback = function(in_timestamp){
		var tick = 0.0; 
		if (undefined !== m_timestamp){
			tick = in_timestamp - m_timestamp;
		}
		m_timestamp = in_timestamp;
		m_fpsElement.update(in_timestamp);

		WebGL.WebGLContextWrapperHelper.clear(webGLContextWrapper, m_clearColor, 1.0);

		m_material.apply(webGLContextWrapper, m_webGLState);
		m_model.draw(webGLContextWrapper, m_webGLState.getMapVertexAttribute());

		m_gridComponent.draw(webGLContextWrapper, m_webGLState);

		m_requestId = requestAnimationFrame(animationFrameCallback);
	}
	var m_requestId = requestAnimationFrame(animationFrameCallback);

	ManipulateDom.Format.addSimpleBr(document, document.body);
	ManipulateDom.Button.addSimpleButton(document, document.body, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_requestId = undefined;
		m_dragCamera.destroy();
		m_gridComponent.destroy();
		console.log("end");
		return;
	});
	const m_fpsElement = ManipulateDom.ComponentFps.factory(document);
	document.body.appendChild(m_fpsElement.getElement());

	const m_cameraOrigin = Core.Vector3.factoryFloat32(0.0, 0.0, 0.0);
	var m_cameraZoom = 1.0;
	const m_cameraPos = Core.Vector3.factoryFloat32(0.0, 0.0, 0.0);
	const m_cameraAt = Core.Vector3.factoryFloat32(0.0, 1.0, 0.0);
	const m_cameraLeft = Core.Vector3.factoryFloat32(-1.0, 0.0, 0.0);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.0, 0.0, 1.0);
	const m_cameraFovhFovvFar = Core.Vector3.factoryFloat32(120.0, 120.0, 100.0);
	const m_viewportWidthHeightWidthhalfHeighthalf = Core.Vector4.factoryFloat32(m_width, m_height, m_width / 2.0, m_height / 2.0);
	const m_dataServer = {
		"getCameraOrigin" : function(){
			return m_cameraOrigin;
		},
		"getCameraZoom" : function(){
			return m_cameraZoom;
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
		"setCameraZoom" : function(in_value){
			m_cameraZoom = in_value;
			return;
		},
	};

	const m_dragCamera = ManipulateDom.ComponentClickDragCamera.factory(html5CanvasElement, m_dataServer);
	const m_gridComponent = WebGL.ComponentWorldGrid.factory(resourceManager, webGLContextWrapper, m_dataServer, 0.25, 8);

	return;
}


window.addEventListener("load", onPageLoad, true);
