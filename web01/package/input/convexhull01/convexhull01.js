import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {applyStyleFullscreenDefault} from './../manipulatedom/style.js';
import {factory as ComponentFpsFactory} from './../manipulatedom/component-fps';
import {factoryAppendBody as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import taskRenderGamefield from './task-render-gamefield.js';
import fullScreenButton from './../manipulatedom/fullscreen-button.js';
import {factoryAppendBody as divFactory}  from './../manipulatedom/div.js';
import {factory as buttonFactory}  from './../manipulatedom/button.js';
import { autoSnapShot } from './../manipulatedom/autodownload.js';

export default function () {
	applyStyleFullscreenDefault(document.documentElement);
	applyStyleFullscreenDefault(document.body);

	var m_div = divFactory(document, {
		"position": "relative",
		"width" : "100vw",
		"height" : "100vh",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0"
	});
	const m_canvaseElementWrapper = componentCanvasFactory(document, {
		"width" : "100vw",
		"height" : "100vh",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const m_canvasElement = m_canvaseElementWrapper.getElement();
	m_div.appendChild(m_canvasElement);
	var m_task = taskRenderGamefield;

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
		//m_fps.update(in_timestamp);
		var timeDelta = 0.0;
		if (undefined !== m_previousTimeStamp){
			timeDelta = (in_timestamp - m_previousTimeStamp) / 1000.0;
		}
		m_previousTimeStamp = in_timestamp;
		m_task = m_task(m_task, m_div, m_webGLState, timeDelta, m_keepGoing);
		return true;
	}

	var m_scene = ComponentWebGLSceneSimpleFactory(callback, m_canvasElement, false, false, false, [
		"OES_texture_float",
		"EXT_frag_depth",
		"WEBGL_depth_texture"
	], true );
	var m_webGLState = m_scene.getWebGLState();

	window.addEventListener("resize", function() {
		console.log("resize");
		m_canvaseElementWrapper.onResize();
	});

	buttonFactory(document, m_div, "stop", function(){
		console.log("stop");
		m_keepGoing = false;
		// if (undefined !== m_scene){
		// 	m_scene.destroy();
		// 	m_scene = undefined;
		// }
	}, {
		"position": "absolute",
		"right": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	})
	fullScreenButton(document, m_div, m_div, {
		"position": "absolute",
		"right": "46px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});
	// const m_fps = ComponentFpsFactory(document, {
	// 	"position": "absolute",
	// 	"left": "10px",
	// 	"top": "10px",
	// 	"width": "64px", 
	// 	"height": "16px"
	// });
	// m_div.appendChild(m_fps.getElement());

	const snapshotCallback = function(){
		var rightNow = new Date();
		rightNow.setMinutes(rightNow.getMinutes() - rightNow.getTimezoneOffset()); 
		var fileName = rightNow.toISOString().slice(0,10) + "_convexhull01.png"
		autoSnapShot(document, m_canvasElement, fileName);
	}
	buttonFactory(document, m_div, "save", function(){
		setTimeout(snapshotCallback, 3000);
	}, {
		"position": "absolute",
		"right": "82px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	return;
}