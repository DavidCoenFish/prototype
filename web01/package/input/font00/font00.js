import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {factoryAppendBody as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import {factoryAppend as buttonFactory}  from './../manipulatedom/button.js';
import {factoryFloat32 as Vector2factoryFloat32} from "./../core/vector2.js";
import ComponentEditVector2Factory from "./../manipulatedom/component-editvec2.js";
import Task from './task.js';

export default function () {

	const m_canvaseElementWrapper = componentCanvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const m_canvasElement = m_canvaseElementWrapper.getElement();
	document.body.appendChild(m_canvasElement);
	var m_task = Task;

	/*
	p0 0.36 0.5
	p1 1.62 0.95
	p2 -0.04 0.49
	d 0.05
	*/
	var m_previousTimeStamp = undefined;
	var m_keepGoing = true;
	var m_mat0 = Matrix4factoryFloat32();
	var m_mat1 = Matrix4factoryFloat32();
	var m_dataState = {
		"u_p0" : m_p0.getRaw(),
		"u_p1" : m_p1.getRaw(),
		"u_p2" : m_p2.getRaw(),
		"u_d" : 0.05
	};
	const callback = function(in_timestamp){
		if (undefined === m_task){
			if (undefined !== m_scene){
				m_scene.destroy();
				m_scene = undefined;
			}
			m_webGLState = undefined;
			return false;
		}
		//m_fps.update(in_timestamp);
		var timeDelta = 0.0;
		if (undefined !== m_previousTimeStamp){
			timeDelta = (in_timestamp - m_previousTimeStamp) / 1000.0;
		}
		m_previousTimeStamp = in_timestamp;
		m_task = m_task(m_task, m_webGLState, m_dataState, timeDelta, m_keepGoing);
		return true;
	}

	var m_scene = ComponentWebGLSceneSimpleFactory(
		callback, 
		m_canvasElement, 
		false, 
		false, 
		false, 
		[], 
		true );
	var m_webGLState = m_scene.getWebGLState();

	buttonFactory(document, document.body, "stop", function(){
		console.log("stop");
		m_keepGoing = false;
	}, {
		"position": "absolute",
		"left": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	var m_componentEditP0 = ComponentEditVector2Factory(document, "p0", m_p0, -1.0, 2.0, 0.01);
	document.body.appendChild(m_componentEditP0.getElement());

	var m_componentEditP1 = ComponentEditVector2Factory(document, "p1", m_p1, -1.0, 2.0, 0.01);
	document.body.appendChild(m_componentEditP1.getElement());

	var m_componentEditP2 = ComponentEditVector2Factory(document, "p2", m_p2, -1.0, 2.0, 0.01);
	document.body.appendChild(m_componentEditP2.getElement());

	return;
}