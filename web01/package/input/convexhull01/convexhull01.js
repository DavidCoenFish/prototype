import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {applyStyleFullscreenDefault} from './../manipulatedom/style.js';
import { factoryAppendBody as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import taskRenderGamefield from './task-render-gamefield.js';
import fullScreenButton from './../manipulatedom/fullscreen-button.js';
import { factoryAppendBody as divFactory}  from './../manipulatedom/div.js';
import { factory as buttonFactory}  from './../manipulatedom/button.js';
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

	const callback = function(in_timeDelta){
		if (undefined === m_task){
			if (undefined !== m_scene){
				m_scene.destroy();
				m_scene = undefined;
			}
			m_webGLState = undefined;
			return false;
		}
		m_task = m_task(m_task, m_div, m_webGLState, in_timeDelta);
		return true;
	}

	var m_scene = ComponentWebGLSceneSimpleFactory(callback, m_canvasElement, false, false, false, [], true );
	var m_webGLState = m_scene.getWebGLState();

	window.addEventListener("resize", function() {
		console.log("resize");
		m_canvaseElementWrapper.onResize();
	});

	buttonFactory(document, m_div, "stop", function(){
		console.log("stop");
		if (undefined !== m_scene){
			m_scene.destroy();
			m_scene = undefined;
		}
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

	return;
}