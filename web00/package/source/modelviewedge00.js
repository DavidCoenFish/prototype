const Core = require("core");
const WebGL = require("webgl");
const ManipulateDom = require("manipulatedom");
const ModelEdge = require("./modelviewedge00/model_edge.js");
const ShaderEdge = require("./modelviewedge00/shader_edge.js");
const MaterialEdge = require("./modelviewedge00/material_edge.js");

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById("html5CanvasElement") : undefined;
	html5CanvasElement.oncontextmenu = function(){ return false; }

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
		"modelEdge" : ModelEdge.factory,
		"shaderEdge" : ShaderEdge.factory,
		"materialEdge" : MaterialEdge.factory,
	});

	const m_viewportWidthHeightWidthhalfHeighthalf = Core.Vector4.factoryFloat32(m_width, m_height, m_width / 2.0, m_height / 2.0);
	var m_sphereRadius = 0.01;
	var m_zoom = 1.0;
	const m_cameraAt = Core.Vector3.factoryFloat32(0.0, 1.0, 0.0);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.0, 0.0, 1.0);
	const m_cameraLeft = Core.Vector3.factoryFloat32(1.0, 0.0, 0.0);
	const m_cameraPos = Core.Vector3.factoryFloat32(0.04571287365044965, -0.1294732246360698, -0.8690733764450884);
	const m_cameraFovhFovvFar = Core.Vector3.factoryFloat32(120.0, 120.0, 10.0);

	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_viewportWidthHeightWidthhalfHeighthalf"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, m_viewportWidthHeightWidthhalfHeighthalf.getRaw());
			} else if (in_key === "u_sphereRadius"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_sphereRadius);
			} else if (in_key === "u_cameraAt"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraAt.getRaw());
			} else if (in_key === "u_cameraUp"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraUp.getRaw());
			} else if (in_key === "u_cameraLeft"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraLeft.getRaw());
			} else if (in_key === "u_cameraPos"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraPos.getRaw());
			} else if (in_key === "u_cameraFovhFovvFar"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraFovhFovvFar.getRaw());
			}

			return;
		}
	};

	const m_shaderEdge = resourceManager.getCommonReference("shaderEdge", webGLContextWrapper, m_uniformServer);
	const m_materialEdge = resourceManager.getCommonReference("materialEdge", m_shaderEdge);
	const m_modelEdge = resourceManager.getCommonReference("modelEdge", webGLContextWrapper);

	var m_timestamp;
	const m_clearColor = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);
	const animationFrameCallback = function(in_timestamp){
		var tick = 0.0; 
		if (undefined !== m_timestamp){
			tick = in_timestamp - m_timestamp;
		}
		m_timestamp = in_timestamp;
		m_fpsElement.update(in_timestamp);

		//m_editCamera.orbit(tick);

		WebGL.WebGLContextWrapperHelper.clear(webGLContextWrapper, m_clearColor, 1.0);

		m_materialEdge.apply(webGLContextWrapper, m_webGLState);
		m_modelEdge.draw(webGLContextWrapper, m_webGLState.getMapVertexAttribute());

		m_requestId = requestAnimationFrame(animationFrameCallback);
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	ManipulateDom.Format.addSimpleBr(document, document.body);
	ManipulateDom.Button.addSimpleButton(document, document.body, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_requestId = undefined;
		m_dragCamera.destroy();
		console.log("end");
		return;
	});
	const m_fpsElement = ManipulateDom.ComponentFps.factory(document);
	document.body.appendChild(m_fpsElement.getElement());

	// const m_editCamera = ManipulateDom.ComponentEditOrbitalCamera.factoryDistancePosAtLeftUp(
	// 	document, 
	// 	5.0, 0.0, 10.0, 0.1, 
	// 	m_cameraPos,
	// 	m_cameraAt,
	// 	m_cameraLeft,
	// 	m_cameraUp,
	// 	undefined, undefined, 0.01
	// );
	// document.body.appendChild(m_editCamera.getElement());

	const m_dragCamera = ManipulateDom.ComponentClickDragCamera.factory(html5CanvasElement, {
		"getStartOrigin" : function() { return Core.Vector3.factoryFloat32(0.0, 0.0, 0.0); },
		"getZoom" : function() { return m_zoom; },
		"getPos" : function() { return m_cameraPos; },
		"getAt" : function() { return m_cameraAt; },
		"getLeft" : function() { return m_cameraLeft; },
		"getUp" : function() { return m_cameraUp; },
	});

	return;
}


window.addEventListener("load", onPageLoad, true);
