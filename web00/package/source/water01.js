const Core = require("core");
const WebGL = require("webgl");
const ModelScreenQuad = require("./water01/modelscreenquad.js");
const Shader0 = require("./water01/shader0.js");
const Shader1 = require("./water01/shader1.js");
const ShaderEnvMap = require("./water01/shaderenvmap.js");
const Stage0 = require("./water01/stage0.js");
const Stage1 = require("./water01/stage1.js");
const StageEnvMap = require("./water01/stageenvmap.js");

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);

	const resourceManager = Core.ResourceManager.factory({
		"modelScreenQuad" : ModelScreenQuad.factory,
		"shader0" : Shader0.factory,
		"shader1" : Shader1.factory,
		"shaderEnvMap" : ShaderEnvMap.factory
	});

	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);
	const m_stage0 = Stage0.factory(webGLContextWrapper, resourceManager);
	const m_stageEnvMap = StageEnvMap.factory(webGLContextWrapper, resourceManager);
	m_stageEnvMap.draw(webGLContextWrapper, m_webGLState);
	const m_stage1 = Stage1.factory(webGLContextWrapper, resourceManager, m_stage0.getTexture(), m_stageEnvMap.getTexture());

	const pad = function(num, size) {
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
		document.body.removeChild(element);
	}

	var frameTrace = 0;
	var frameMax = 10000;
	var fps = 30; 
	var targetTimePerFrame = 1000.0 / fps;
	var m_startTime = undefined;
	var m_lastDraw = undefined;
	const animationFrameCallback = function(in_timestamp){
		if (undefined === m_startTime){
			m_startTime = in_timestamp;
		} 
		if (undefined === m_lastDraw){
			m_lastDraw = in_timestamp;
		} else {
			var sinceLastDraw = in_timestamp - m_lastDraw;
			if (sinceLastDraw < targetTimePerFrame){
				m_requestId = requestAnimationFrame(animationFrameCallback);
				return;
			}
			m_lastDraw = in_timestamp - (sinceLastDraw - targetTimePerFrame);
		}

		m_stage0.draw(webGLContextWrapper, m_webGLState, frameTrace);
		m_stage1.draw(webGLContextWrapper, m_webGLState);

		//const capturedImage = html5CanvasElement.toDataURL("image/png");
		//saveFile(capturedImage, frameTrace);

		frameTrace += 1;
		if (frameTrace <= frameMax){
			m_requestId = requestAnimationFrame(animationFrameCallback);
		} else {
			const duration = in_timestamp - m_startTime;
			const avr = duration / (frameMax + 1);
			console.log("average:" + avr);
		}
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	return;
}


window.addEventListener('load', onPageLoad, true);
