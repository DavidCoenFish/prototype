const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

const factory = function(
	in_callbackPresent, // = function()
	in_callbackStep, // = function(in_timeDeltaActual, in_timeDeltaAjusted)
	in_callbackStopUpdate, // = function()
	in_webGLContextParamObject,
	in_document,
	in_stepModeOrUndefined, //if true, we start paused, and only advance on clicking the step button
	in_timeDeltaOverrideOrUndefined,
	in_frameCountOrUndefined,
	in_saveEachFrameFileNameOrUndefined
){
	const m_canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(in_document, 512, 512);
	const m_webGLState = WebGL.WebGLState.factory(m_canvaseElementWrapper.getElement(), in_webGLContextParamObject);
	const m_stepMode = (undefined === in_stepModeOrUndefined) ? in_stepModeOrUndefined : false;

	var m_paused = (true === m_stepMode);
	var m_prevTimeStamp = undefined;
	var m_frameIndex = 0;

	const animationFrameCallback = function(in_timestamp){
		m_fpsElement.update(in_timestamp);
		var timeDeltaActual = 0.0;
		var timeDeltaAjusted = 0.0;

		if (undefined !== m_prevTimeStamp){
			timeDeltaActual = (in_timestamp - m_prevTimeStamp) / 1000.0;
			timeDeltaAjusted = timeDeltaActual;
		}
		m_prevTimeStamp = in_timestamp;
		
		if (undefined !== in_timeDeltaOverrideOrUndefined){
			timeDeltaAjusted = in_timeDeltaOverrideOrUndefined;
		}

		if (false === m_paused){
			if (0.0 < timeDeltaActual){
				if (undefined !== in_callbackStep){
					in_callbackStep(timeDeltaActual, timeDeltaAjusted);
				}
				m_paused = (true === m_stepMode);
			}
		}

		if (undefined !== in_callbackPresent){
			in_callbackPresent();
		}

		if (undefined !== in_saveEachFrameFileNameOrUndefined){
			ManipulateDom.AutoDownload.autoSnapShot(in_document, m_html5CanvasElement, in_saveEachFrameFileNameOrUndefined + m_frameIndex + ".png");
		}

		if (undefined !== in_frameCountOrUndefined){
			m_frameIndex += 1;
			if (in_frameCountOrUndefined <= m_frameIndex){
				if (undefined !== in_callbackStopUpdate){
					in_callbackStopUpdate();
				}
				return;
			}
		}

		m_requestId = requestAnimationFrame(animationFrameCallback);
		return;
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	ManipulateDom.Format.addSimpleBr(in_document, in_document.body);
	ManipulateDom.Button.addSimpleButton(in_document, in_document.body, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_requestId = undefined;
		if (undefined !== in_callbackStopUpdate){
			in_callbackStopUpdate();
		}
		m_webGLState.destroy();
		return;
	});
	if (true === m_stepMode){
		ManipulateDom.Button.addSimpleButton(in_document, in_document.body, "step", function(){
			m_paused = false;
			return;
		});
	}
	const m_fpsElement = ManipulateDom.ComponentFps.factory(in_document);
	in_document.body.appendChild(m_fpsElement.getElement());

	const that = Object.create({
		"getCanvasElement" : function(){
			return m_canvaseElementWrapper.getElement();
		},
		"getWebGLState" : function(){
			return m_webGLState;
		},
	});

	return that;
}

module.exports = {
	"factory" : factory
}