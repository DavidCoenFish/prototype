import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {factoryAppendElement as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import {factoryAppend as buttonFactory}  from './../manipulatedom/button.js';
import {factoryAppend as selectFactory} from "./../manipulatedom/select.js";
import {factoryFloat32 as Vector2factoryFloat32} from "./../core/vector2.js";
import ComponentEditVector2Factory from "./../manipulatedom/component-editvec2";
import {factory as ComponentEditFloatFactory} from "./../manipulatedom/component-editfloat.js";
import Task from './task.js';
import fullScreenButton from './../manipulatedom/fullscreen-button.js';
import { autoSnapShot } from './../manipulatedom/autodownload.js';
import {factoryAppend as divFactory}  from './../manipulatedom/div.js';

/*
 */
export default function () {

	var m_div = divFactory(document, document.body, {
		"position": "relative",
		"width" : "512px",
		"height" : "384px",
		// "width" : "100vw",
		// "height" : "100vh",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0"
	});
	const m_canvaseElementWrapper = componentCanvasFactory(document, m_div, {
		// "width" : "100vw",
		// "height" : "100vh",
		"width" : "512px",
		"height" : "384px",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const m_canvasElement = m_canvaseElementWrapper.getElement();
	var m_task = Task;

	var m_previousTimeStamp = undefined;
	var m_keepGoing = true;

	const callback = function(in_timestamp){
		if (undefined === m_task){
			if (undefined !== m_scene){
				m_scene.destroy();
				m_scene = undefined;
			}
			m_webGLState = undefined;
			return false;
		}

		var timeDelta = 0.0;
		if (undefined !== m_previousTimeStamp){
			timeDelta = (in_timestamp - m_previousTimeStamp) / 1000.0;
		}
		m_previousTimeStamp = in_timestamp;
		m_task = m_task(m_task, m_div, m_webGLState, timeDelta, m_keepGoing);
		return true;
	}

	var m_scene = ComponentWebGLSceneSimpleFactory(
		callback, 
		m_canvasElement, 
		false, 
		true, 
		true, 
		[], 
		true );
	var m_webGLState = m_scene.getWebGLState();

	buttonFactory(document, m_div, "stop", function(){
		console.log("stop");
		m_keepGoing = false;
	}, {
		"position": "absolute",
		"left": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	fullScreenButton(document, m_canvasElement, m_div, {
		"position": "absolute",
		"right": "46px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	buttonFactory(document, m_div, "save", function(){
		var rightNow = new Date();
		rightNow.setMinutes(rightNow.getMinutes() - rightNow.getTimezoneOffset()); 
		var fileName = rightNow.toISOString().slice(0,10) + "_convexhull01.png"
		autoSnapShot(document, m_canvasElement, fileName);
	}, {
		"position": "absolute",
		"right": "82px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	return;
}