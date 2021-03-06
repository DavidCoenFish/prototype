import {factoryAppendElement as canvasFactory} from './../manipulatedom/component-canvas.js'
import {factoryAppendElement as buttonFactory} from './../manipulatedom/button.js';
import {factoryAppendElement as fpsFactory} from './../manipulatedom/component-fps.js';
import animationFrameHelper from './../core/component-animation-frame-helper.js';
import webGLStateFactory from './../webgl/webglstate.js';
import Task from './eye00task.js';

export default function () {

	const m_canvaseElementWrapper = canvasFactory(document, document.body, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	var m_webglState = webGLStateFactory(m_canvaseElementWrapper.getElement());

	var m_task = Task;
	buttonFactory(document, document.body, "stop", function(){
		console.log("stop");
		m_task = undefined;
	}, {
		"position": "absolute",
		"left": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});
	var m_fps = fpsFactory(document, document.body, 
	{
		"position": "absolute",
		"left": "10px",
		"top": "42px",
		"width": "32px", 
		"height": "16px"
	});

	var m_animationFrameHelper = undefined;
	var m_sharedData = { "webglState" : m_webglState };
	const callback = function(in_timestamp, in_timeDelta){
		if (undefined === m_task){
			m_animationFrameHelper.destroy();
			m_animationFrameHelper = undefined;
			m_webglState.destroy();
			m_webglState = undefined;
			return false;
		}

		m_fps.update(in_timestamp);
		m_task = m_task(m_task, in_timeDelta, m_sharedData);
		return true;
	}

	var m_animationFrameHelper = animationFrameHelper(callback);

	return;
}