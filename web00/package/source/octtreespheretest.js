const Core = require("core");
const WebGL = require("webgl");
const ModelScreenQuad = require("./octtreespheretest/modelscreenquad.js");
/**
const ShaderOctTreeDepth = require("./octtreespheretest/shaderocttreedepth01.js");
const TestData = require("./octtreespheretest/testdata01.js");
// depth 1: avg: 17.7
// depth 2: avg: 18.0
// depth 3: avg: 38.0
// depth 4: avg: 293.1
/** */
/** */
const ShaderOctTreeDepth = require("./octtreespheretest/shaderocttreedepth02.js");
const TestData = require("./octtreespheretest/testdata02.js");
// depth 1: avg: 
// depth 2: avg: 
// depth 3: avg: 
// depth 4: avg: 155.1
/** */
const gDepth = 4;

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, [
		"OES_texture_float"
	]);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);

	const resourceManager = Core.ResourceManager.factory({
		"modelScreenQuad" : ModelScreenQuad.factory,
		"shaderOctTreeDepth" : ShaderOctTreeDepth.factory,
		"testData" : TestData.factory,
	});

	const m_testData = resourceManager.getCommonReference("testData", webGLContextWrapper, gDepth);

	//const m_fovNormScaleXY = Core.Vector2.factoryFloat32(0.70710678118654752440084436210485, 0.70710678118654752440084436210485);
	const m_fovNormScaleXY = Core.Vector2.factoryFloat32(0.5, 0.5);
	var m_cameraAt = Core.Vector3.factoryFloat32(0.0, 0.0, 1.0);
	var m_cameraUp = Core.Vector3.factoryFloat32(0.0, 1.0, 0.0);
	var m_cameraRight = Core.Vector3.factoryFloat32(1.0, 0.0, 0.0);
	var m_cameraPos = Core.Vector3.factoryFloat32(0.0, 0.0, -2.0);
	const m_textureDim = Core.Vector2.factoryFloat32(m_testData.getWidth(), m_testData.getHeight());
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_samplerOctTreeData"){
				WebGL.WebGLContextWrapperHelper.setUniformInteger(localWebGLContextWrapper, in_position, 0);
			} else if (in_key === "u_fovNormScaleXY"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_fovNormScaleXY.getRaw());
			} else if (in_key === "u_cameraAt"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraAt.getRaw());
			} else if (in_key === "u_cameraUp"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraUp.getRaw());
			} else if (in_key === "u_cameraRight"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraRight.getRaw());
			} else if (in_key === "u_cameraPos"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, m_cameraPos.getRaw());
			} else if (in_key === "u_textureDim"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_textureDim.getRaw());
			}
			return;
		}
	};
	const m_shaderOctTreeDepth1 = resourceManager.getCommonReference("shaderOctTreeDepth", webGLContextWrapper, m_uniformServer);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shaderOctTreeDepth1, [m_testData]);
	const m_model = resourceManager.getCommonReference("modelScreenQuad", webGLContextWrapper);

	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	var m_requestId;
	var frameTrace = 0;
	var frameMax = 50;
	var m_startTime = undefined;

	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}

	const saveFile = function(in_urlEncodedData, in_trace){
		var element = document.createElement('a');
		element.setAttribute('href', in_urlEncodedData);
		const fileName = "img_" + pad(in_trace, 3) + ".png";
		element.setAttribute('download', fileName);
		element.innerText = fileName;

		document.body.appendChild(element);

		element.click();
	}

	const advanceParam = function(in_ratio){
		m_cameraPos.setZ(((1.0 - in_ratio) * -2.0) + (in_ratio * -2.0));
		m_cameraPos.setX(((1.0 - in_ratio) * 0.0) + (in_ratio * -2.0));
		m_cameraAt = Core.Vector3.factoryFloat32(
			((1.0 - in_ratio) * 0.0) + (in_ratio * -0.7071),
			((1.0 - in_ratio) * 0.0) + (in_ratio * 0),
			((1.0 - in_ratio) * 1.0) + (in_ratio * 0.7071),
		);
		m_cameraAt.normaliseSelf();
		m_cameraRight = Core.Vector3.factoryFloat32(
			((1.0 - in_ratio) * 1.0) + (in_ratio * 0.7071),
			((1.0 - in_ratio) * 0.0) + (in_ratio * 0),
			((1.0 - in_ratio) * 0.0) + (in_ratio * 0.7071),
		);
		m_cameraRight.normaliseSelf();
	}


	document.body.appendChild(document.createElement("br"));

	const animationFrameCallback = function(in_timestamp){
		if (undefined === m_startTime){
			m_startTime = in_timestamp;
		} 
		m_material.apply(webGLContextWrapper, m_webGLState);
		m_model.draw(webGLContextWrapper, m_webGLState.getMapVertexAttribute());

		const capturedImage = html5CanvasElement.toDataURL("image/png");
		saveFile(capturedImage, frameTrace);

		frameTrace += 1;
		advanceParam(frameTrace / frameMax);

		if (frameTrace < frameMax){
			m_requestId = requestAnimationFrame(animationFrameCallback);
		} else {
			//const duration = in_timestamp - m_startTime;
			//const avr = duration / frameMax;
			//console.log("average:" + avr);
		}
	}

	m_requestId = requestAnimationFrame(animationFrameCallback);


	return;
}


window.addEventListener('load', onPageLoad, true);
