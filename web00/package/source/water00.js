const Core = require("core");
const WebGL = require("webgl");
const ModelScreenQuad = require("./water00/modelscreenquad.js");
const ShaderWater = require("./water00/shaderwater.js");

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
		"shaderWater" : ShaderWater.factory
	});

	const m_sunLatLong = Core.Vector2.factoryFloat32(0.5, 0.5);
	var m_ratio = 0.0;
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key === "u_sunLatLong"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat2(localWebGLContextWrapper, in_position, m_sunLatLong.getRaw());
			} else if (in_key === "u_ratio"){
				WebGL.WebGLContextWrapperHelper.setUniformFloat(localWebGLContextWrapper, in_position, m_ratio);
			}
			return;
		}
	};
	const m_shaderWater = resourceManager.getCommonReference("shaderWater", webGLContextWrapper, m_uniformServer);
	const m_materialWater = WebGL.MaterialWrapper.factoryDefault(m_shaderWater, []);
	const m_model = resourceManager.getCommonReference("modelScreenQuad", webGLContextWrapper);

	const m_webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

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

	const advanceParam = function(in_frameTrace){
		m_ratio = in_frameTrace / 50.0;
	}

	var frameTrace = 0;
	var frameMax = 200;
	var m_startTime = undefined;
	const animationFrameCallback = function(in_timestamp){
		if (undefined === m_startTime){
			m_startTime = in_timestamp;
		} 
		m_materialWater.apply(webGLContextWrapper, m_webGLState);
		m_model.draw(webGLContextWrapper, m_webGLState.getMapVertexAttribute());

		//const capturedImage = html5CanvasElement.toDataURL("image/png");
		//saveFile(capturedImage, frameTrace);

		frameTrace += 1;
		advanceParam(frameTrace);

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
