import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {applyStyleFullscreenDefault} from './../manipulatedom/style.js';
import { factoryAppendBody as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import taskRenderGamefield from './task-render-gamefield.js';
import fullScreenButton from './../manipulatedom/fullscreen-button.js';
import { factoryAppendBody as divFactory}  from './../manipulatedom/div.js';
export default function () {
	//applyStyleFullscreenDefault(document.documentElement);
	//applyStyleFullscreenDefault(document.body);

	const style = {
		"position": "relative",
		"width" : "640px",
		"height" : "455px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0"
	};
	var div = divFactory(document, style);
	const m_canvaseElementWrapper = componentCanvasFactory(document, style);
	const m_canvasElement = m_canvaseElementWrapper.getElement();
	div.appendChild(m_canvasElement);
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
		m_task = m_task(m_task, m_canvasElement, m_webGLState, in_timeDelta);
		return true;
	}

	var m_scene = ComponentWebGLSceneSimpleFactory(callback, m_canvasElement, false, false, false, [], true );
	var m_webGLState = m_scene.getWebGLState();

	window.addEventListener('resize', function() {
		m_canvaseElementWrapper.onResize();
	});

	fullScreenButton(document, m_canvasElement, div, {
		"position": "absolute",
		"right": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	return;
}