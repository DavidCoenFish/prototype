import ComponentWebGLSceneFactory from './../manipulatedom/component-webgl-scene.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import CelticKnotComponentFactory from './celticknotcomponent.js';

export default function () {
	document.documentElement.style.width = "100%";
	document.documentElement.style.height = "100%";
	document.documentElement.style.margin = "0";
	document.documentElement.style.padding = "0";
	//width:100%; height:100%;margin:0; padding:0;

	//console.log(JSON.stringify(document.body.style));
	document.body.style.width = "100%";
	document.body.style.height = "100%";
	document.body.style.margin = "0";
	document.body.style.padding = "0";

	// var m_canvasElement = document.createElement("CANVAS");

	// m_canvasElement.style.width="100vw";
	// m_canvasElement.style.height="100vh";
	// m_canvasElement.style.backgroundColor = "#FFFFFF"
	// m_canvasElement.style.margin = "0";
	// m_canvasElement.style.padding = "0";
	// m_canvasElement.style.display = "block";
	// document.body.appendChild(m_canvasElement);
	// m_canvasElement.width = m_canvasElement.offsetWidth;
	// m_canvasElement.height = m_canvasElement.offsetHeight;

	// console.log(m_canvasElement.offsetWidth);
	// console.log(m_canvasElement.offsetHeight);

	window.addEventListener('resize', function() {
		canvasElement.width = canvasElement.offsetWidth;
		canvasElement.height = canvasElement.offsetHeight;
		// console.log("resize");
		// console.log(m_canvasElement.offsetWidth);
		// console.log(m_canvasElement.offsetHeight);
	});

	const sceneUpdateCallback = function(in_timeDeltaActual, in_timeDeltaAjusted){
		celticknotcomponent.draw(in_timeDeltaAjusted);
		return;
	};

	const componentScene = ComponentWebGLSceneFactory(document, false, sceneUpdateCallback, undefined, {
		"width" : "100vw",
		"height" : "100vh",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
		}, false, undefined, undefined, undefined, true);
	const webGLState = componentScene.getWebGLState();
	const canvasElement = componentScene.getCanvasElement();
	canvasElement.onclick = function(){
		//console.log("canvasElement.onClick");
		//componentScene.stop();
		if (0 == m_fullScreen){
			openFullscreen();
		} else {
			closeFullscreen();
		}
		m_fullScreen ^= 1;
	}

	const resourceManager = ResourceManagerFactory();

	const celticknotcomponent = CelticKnotComponentFactory(resourceManager, webGLState, 32, 32);


	/* View in fullscreen */
	var m_fullScreen = 0;
	function openFullscreen() {
		if (canvasElement.requestFullscreen) {
			canvasElement.requestFullscreen();
		} else if (canvasElement.mozRequestFullScreen) { /* Firefox */
			canvasElement.mozRequestFullScreen();
		} else if (canvasElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			canvasElement.webkitRequestFullscreen();
		} else if (canvasElement.msRequestFullscreen) { /* IE/Edge */
			canvasElement.msRequestFullscreen();
		}
	}

	/* Close fullscreen */
	function closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) { /* Firefox */
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE/Edge */
			document.msExitFullscreen();
		}
	}

	return;
}