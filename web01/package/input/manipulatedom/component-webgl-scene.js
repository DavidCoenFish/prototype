import { factoryAppendBody as componentCanvasFactory } from './component-canvas.js'
import { factoryAppendBody as componentFpsFactory } from './component-fps.js'
import { factoryAppendBody as brAppendBody } from './br.js'
import { factoryAppendBody as buttonAppendBody } from './button.js'
import { autoSnapShot } from './autodownload.js'
import webGLStateFactory from './../webgl/webglstate.js'


export default function(
	in_document,
	in_callbackUpdateOrUndefined, // = function(in_timeDeltaActual, in_timeDeltaAjusted)
	in_callbackStopOrUndefined, // = function()
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_extentionsOrUndefined,
	in_preserveDrawingBufferOrUndefined,
	in_stepModeOrUndefined, //if true, we start paused, and only advance on clicking the step button
	in_timeDeltaOverrideOrUndefined,
	in_frameCountOrUndefined,
	in_saveEachFrameFileNameOrUndefined
){
	const m_canvaseElementWrapper = componentCanvasFactory(in_document, 512, 512);
	const m_webGLState = webGLStateFactory(
		m_canvaseElementWrapper.getElement(), 
		in_alphaOrUndefined, 
		in_depthOrUndefined, 
		in_antialiasOrUndefined, 
		in_extentionsOrUndefined,
		in_preserveDrawingBufferOrUndefined
		);
	var m_stepMode = (undefined !== in_stepModeOrUndefined) ? in_stepModeOrUndefined : false;

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
		
		if (0.0 < timeDeltaActual){
			if (true === m_paused){
				timeDeltaAjusted = 0.0;
			} else {
				m_paused = (true === m_stepMode);
				timeDeltaAjusted = timeDeltaActual;
				if (undefined !== in_timeDeltaOverrideOrUndefined){
					timeDeltaAjusted = in_timeDeltaOverrideOrUndefined;
				}
			}
		}

		if (undefined !== in_callbackUpdateOrUndefined){
			in_callbackUpdateOrUndefined(timeDeltaActual, timeDeltaAjusted);
		}

		if (undefined !== in_saveEachFrameFileNameOrUndefined){
			autoSnapShot(in_document, m_canvaseElementWrapper.getElement(), in_saveEachFrameFileNameOrUndefined + m_frameIndex + ".png");
		}

		if (undefined !== in_frameCountOrUndefined){
			m_frameIndex += 1;
			if (in_frameCountOrUndefined <= m_frameIndex){
				if (undefined !== in_callbackStop){
					in_callbackStop();
				}
				return;
			}
		}

		m_requestId = requestAnimationFrame(animationFrameCallback);
		return;
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	brAppendBody(in_document);
	buttonAppendBody(in_document, "snapshot", function(in_event){
		autoSnapShot(in_document, m_canvaseElementWrapper.getElement(), "C:/development/snapshot.png");
	});
	buttonAppendBody(in_document, "stop", function(in_event){
		cancelAnimationFrame(m_requestId);
		m_requestId = undefined;
		if (undefined !== in_callbackStopOrUndefined){
			in_callbackStopOrUndefined();
		}
		m_webGLState.destroy();
		return;
	});
	if (true === m_stepMode){
		buttonAppendBody(in_document, "step", function(){
			m_paused = false;
			return;
		});
		buttonAppendBody(in_document, "toggle step mode", function(){
			m_stepMode = (1 === (m_stepMode ^ true));
			return;
		});
	}
	brAppendBody(in_document);
	const m_fpsElement = componentFpsFactory(in_document);

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
