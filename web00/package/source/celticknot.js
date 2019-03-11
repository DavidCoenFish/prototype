const Core = require("core");
const WebGL = require("webgl");
const DrawCelticKnot = require("./celticknot/drawcelticknot.js");
const ComponentTestScene = require("./component-test-scene.js");

/* 
generate tile data

goal - 
	have a pattern of celtic knots, hold for 1.5 sec, then over 0.5 transition to a new 
	pattern of celtic knots. ripple in background?

tile data
	3 variations [1000, 1100, 1111] as rgb 8bit

drawcelticknot
	draw to the current/input render target a set of celtic knot tiles

*/
const onPageLoad = function(){
	console.info("onPageLoad");

	const callbackPresent = function(){
	}
	const callbackStep = function(in_timeDeltaActual, in_timeDeltaAjusted){
		if (0.0 < in_timeDeltaAjusted){
			m_drawCelticKnot.draw();
		}
	}
	const callbackStopUpdate = function(){
	}

	const m_componentTestScene = ComponentTestScene.factory(
		callbackPresent, 
		callbackStep, 
		callbackStopUpdate, 
		WebGL.WebGLState.makeParam(false, true, true, ["OES_texture_float"]), 
		document, 
		true,
		//0.016666, //undefined//0.01
		);
	const m_webGLState = m_componentTestScene.getWebGLState();
	const m_resourceManager = Core.ResourceManager.factory();

	var m_drawCelticKnot = DrawCelticKnot.factory(m_webGLState, m_resourceManager, 512, 512, 64, 64);

	return;
}

window.addEventListener('load', onPageLoad, true);
