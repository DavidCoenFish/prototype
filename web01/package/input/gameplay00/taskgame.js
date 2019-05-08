import {factoryAppend as buttonFactory}  from './../manipulatedom/button.js';
import {factoryFloat32 as Colour4FactoryFloat32} from "./../core/colour4.js";

/*
 */

export default function(in_webGLState, in_div, in_gameResourceManager, in_gameState, in_callbackSetActiveGameTask, in_callbackRequestLoading){
	var m_button = buttonFactory(document, in_div, "quit", function(){
		in_callbackSetActiveGameTask("Quit");
	},
	{
		"position": "absolute",
		"left": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	const that = Object.create({
		"destroy" : function(){
			in_div.removeChild(m_button);
		},
		"update" : function(in_timeDelta){
			in_webGLState.clear(Colour4FactoryFloat32(0.0,0.0,1.0,1.0));
			//draw game world
			// input click drag camera, click on things in world (move, attack, talk) and status buttons
		},
	});

	return that;
}
