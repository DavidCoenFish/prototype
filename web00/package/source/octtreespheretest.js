const Core = require("core");
const WebGL = require("webgl");
const ModelScreenQuad = require("./octtreespheretest/modelscreenquad.js");
const ShaderOctTreeDepth1 = require("./octtreespheretest/shaderocttreedepth1.js");
const TestData = require("./octtreespheretest/testdata.js");

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
		"shaderOctTreeDepth1" : ShaderOctTreeDepth1.factory,
		"testData" : TestData.factory,
	});

	const m_testData = resourceManager.getCommonReference("testData", webGLContextWrapper);

	//"", "u_fovNormScaleXY", "u_cameraAt", "u_cameraUp", "u_cameraRight", "u_cameraPos"];
	const m_fovNormScaleXY = Core.Vector2.factoryFloat32(0.70710678118654752440084436210485, 0.70710678118654752440084436210485);
	const m_cameraAt = Core.Vector3.factoryFloat32(0.0, 1.0, 0.0);
	const m_cameraUp = Core.Vector3.factoryFloat32(0.0, 0.0, 1.0);
	const m_cameraRight = Core.Vector3.factoryFloat32(1.0, 0.0, 0.0);
	const m_cameraPos = Core.Vector3.factoryFloat32(0.0, 0.0, -1.5);
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
			}
			return;
		}
	};
	const m_shaderOctTreeDepth1 = resourceManager.getCommonReference("shaderOctTreeDepth1", webGLContextWrapper, m_uniformServer);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shaderOctTreeDepth1, [m_testData]);
	const m_model = resourceManager.getCommonReference("modelScreenQuad", webGLContextWrapper);

	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	var m_requestId;
	var frameTrace = 0;
	var frameMax = 100;
	const animationFrameCallback = function(in_timestamp){
		m_material.apply(webGLContextWrapper, m_webGLState);
		console.time('draw');
		m_model.draw(webGLContextWrapper, m_webGLState.getMapVertexAttribute());
		console.timeEnd('draw');

		frameTrace += 1;
		if (frameTrace < frameMax){
			m_requestId = requestAnimationFrame(animationFrameCallback);
		}
	}

	m_requestId = requestAnimationFrame(animationFrameCallback);


	return;
}


window.addEventListener('load', onPageLoad, true);
