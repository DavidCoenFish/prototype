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

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);

	const resourceManager = Core.ResourceManager.factory({
		"model" : Model.factory,
		"shader" : Shader.factory,
		"material" : Material.factory
	});

	const m_viewportWidthHeightWidthhalfHeighthalf = Core.Vector4.factoryFloat32(m_width, m_height, m_width / 2.0, m_height / 2.0);
	var m_sphereRadius = 0.1;
	const m_cameraAt = Core.Vector3.factoryFloat32(0.0, 1.0, 0.0);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.0, 0.0, 1.0);
	const m_cameraRight = Core.Vector3.factoryFloat32(1.0, 0.0, 0.0);
	const m_cameraPos = Core.Vector3.factoryFloat32(0.0, -5.0, 0.0);
	const m_cameraFovhFovvFar = Core.Vector3.factoryFloat32(185.0, 185.0, 10.0);

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
			} else if (in_key === "u_cameraRight"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraRight.getRaw());
			} else if (in_key === "u_cameraPos"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraPos.getRaw());
			} else if (in_key === "u_cameraFovhFovvFar"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraFovhFovvFar.getRaw());
			}

			return;
		}
	};

	const m_shader = resourceManager.getCommonReference("shader", webGLContextWrapper, m_uniformServer);
	const m_material = resourceManager.getCommonReference("material", m_shader);
	const m_model = resourceManager.getCommonReference("model", webGLContextWrapper);

	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);
	const animationFrameCallback = function(in_timestamp){
		m_fpsElement.update(in_timestamp);

		m_material.apply(webGLContextWrapper, m_webGLState);
		m_model.draw(webGLContextWrapper, m_webGLState.getMapVertexAttribute());

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

	var m_float = 3.5;
	const m_editFloat = ManipulateDom.ComponentEditFloat.factory(
		document,
		"test", 
		function(){return m_float; }, 
		function(in_value){ m_float = in_value; return; }, 
		-180.0, 
		180.0
		);
	document.body.appendChild(m_editFloat.getElement());

	const m_editCameraPos = ManipulateDom.ComponentEditVec3.factory(
		document,
		"camera pos",
		function(){return m_cameraPos.getX(); }, 
		function(in_value){ m_cameraPos.setX(in_value); return; }, 
		function(){return m_cameraPos.getY(); }, 
		function(in_value){ m_cameraPos.setY(in_value); return; }, 
		function(){return m_cameraPos.getZ(); }, 
		function(in_value){ m_cameraPos.setZ(in_value); return; }, 
		undefined, 
		undefined,
		0.1
		);
	document.body.appendChild(m_editCameraPos.getElement());

	const m_editFovhFovvFar = ManipulateDom.ComponentEditVec3.factory(
		document,
		"fov h, fov v, far",
		function(){return m_cameraFovhFovvFar.getX(); }, 
		function(in_value){ m_cameraFovhFovvFar.setX(in_value); return; }, 
		function(){return m_cameraFovhFovvFar.getY(); }, 
		function(in_value){ m_cameraFovhFovvFar.setY(in_value); return; }, 
		function(){return m_cameraFovhFovvFar.getZ(); }, 
		function(in_value){ m_cameraFovhFovvFar.setZ(in_value); return; }, 
		undefined, 
		undefined,
		0.1
		);
	document.body.appendChild(m_editFovhFovvFar.getElement());

	var m_lat = 0.0;
	var m_long = 0.0;
	const m_editLatLong = ManipulateDom.ComponentEditVec2.factory(
		document,
		"lat long",
		function(){return m_lat; }, 
		function(in_value){ m_lat = in_value; return; }, 
		function(){return m_long; }, 
		function(in_value){ m_long = in_value; return; }, 
		-180.0, 
		180.0,
		0.1
		);
	document.body.appendChild(m_editFovhFovvFar.getElement());

	return;
}


window.addEventListener("load", onPageLoad, true);
