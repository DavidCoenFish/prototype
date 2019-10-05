import {factoryAppendElement as canvasFactory} from './../manipulatedom/component-canvas.js'
import {factoryAppendElement as divFactory} from './../manipulatedom/div.js'
import {factoryAppendElement as buttonFactory} from './../manipulatedom/button.js';
import {factoryAppendElement as fpsFactory} from './../manipulatedom/component-fps.js';
import animationFrameHelper from './../core/component-animation-frame-helper.js';
import webGLStateFactory from './../webgl/webglstate.js';
import Task from './ui00task.js';

export default function () {
	const m_parentDiv = divFactory(document, document.body, {
		"width" : "512px",
		"height" : "512px",
		"position": "relative",
	});

	const m_canvaseElementWrapper = canvasFactory(document, m_parentDiv, {
		"width" : "100%",
		"height" : "100%",
		"backgroundColor" : "#00FF00",
		"position" : "absolute"
	});
	var m_webglState = webGLStateFactory(m_canvaseElementWrapper.getElement());

	// divFactory(document, m_parentDiv, {
	// 	"width" : "100%",
	// 	"height" : "100%",
	// 	"backgroundColor" : "#0000FF",
	// 	"position" : "absolute"
	// });

	buttonFactory(document, document.body, "stop", function(){
		console.log("stop");
		m_keepGoing = false;
	});
	var m_fps = fpsFactory(document, document.body);


	var m_task = Task;
	var m_animationFrameHelper = undefined;
	var m_keepGoing = true;
	var m_dataState = {
		"document" : document,
		"m_parentDiv" : m_parentDiv
	};
	const callback = function(in_timestamp, in_timeDelta){
		if (undefined === m_task){
			m_webglState.destroy();
			m_webglState = undefined;
			m_animationFrameHelper.destroy();
			m_animationFrameHelper = undefined;
			return false;
		}

		m_fps.update(in_timestamp);
		m_task = m_task(m_task, m_webglState, m_dataState, in_timeDelta, m_keepGoing);
		return true;
	}

	var m_animationFrameHelper = animationFrameHelper(callback);

	return;
}