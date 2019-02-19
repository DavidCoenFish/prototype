const ManipulateDom = require("manipulatedom");

const factory = function(
	in_targetObject,
	in_callbackPresent,
	in_callbackStep,
	in_callbackStopUpdate,
	in_webGLContextParamObject,
	in_document,
	in_timeDeltaOverrideOrUndefined,
	in_stepMode, //if true, we start paused, and only advance on clicking the step button
	in_frameCountOrUndefined,
	in_saveEachFrameFileNameOrUndefined
){
	const m_html5CanvasElement = (undefined !== in_document) ? in_document.getElementById("html5CanvasElement") : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== m_html5CanvasElement){
		m_html5CanvasElement.width = m_html5CanvasElement.clientWidth;
		m_html5CanvasElement.height = m_html5CanvasElement.clientHeight;
	}

	const m_webGLContextWrapper = WebGL.WebGLContextWrapper.factory(m_html5CanvasElement, in_webGLContextParamObject);
	const m_webGLState = WebGL.WebGLState.factory(m_webGLContextWrapper);

	var m_timeDelta = 0.0;
	var m_paused = (true === in_stepMode);
	var m_prevTimeStamp = undefined;
	var m_frameIndex = 0;

	const animationFrameCallback = function(in_timestamp){
		m_fpsElement.update(in_timestamp);

		if (undefined !== m_prevTimeStamp){
			m_timeDelta = (in_timestamp - m_prevTimeStamp) / 1000.0;
		}
		m_prevTimeStamp = in_timestamp;
		
		if (undefined !== in_timeDeltaOverrideOrUndefined){
			m_timeDelta = in_timeDeltaOverrideOrUndefined;
		}

		if (false === m_paused){
			if (0.0 < m_timeDelta){
				if (undefined !== in_callbackStep){
					in_callbackStep(m_timeDelta);
				}
				m_paused = (true === in_stepMode);
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
		return;
	});
	if (true === in_stepMode){
		ManipulateDom.Button.addSimpleButton(in_document, in_document.body, "step", function(){
			m_paused = false;
			return;
		});
	}
	const m_fpsElement = ManipulateDom.ComponentFps.factory(in_document);
	in_document.body.appendChild(m_fpsElement.getElement());

	Object.assign(in_targetObject, {
		"getCanvasElement" : function(){
			return m_html5CanvasElement;
		},
		"getWebGLContextWrapper" : function(){
			return m_webGLContextWrapper;
		},
		"getWebGLState" : function(){
			return m_webGLState;
		},
	});

	return;
}

module.exports = {
	"factory" : factory
}