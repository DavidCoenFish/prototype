//import Task from './task.js';

export default function () {
	const m_canvasElement = m_canvaseElementWrapper.getElement();
	m_div.appendChild(m_canvasElement);
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
	}, {
		"position": "absolute",
		"right": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});
	fullScreenButton(document, m_div, m_div, {
		"position": "absolute",
		"right": "46px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

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