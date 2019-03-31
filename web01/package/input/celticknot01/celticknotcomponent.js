import KnotColourFactory from './outline_32_32.js';
import KnotAlphaFactory from './outlinea_32_32.js';
import { runArray } from './../core/taskhelper.js';
import TaskDrawKnotFactory from './taskdrawknot.js';

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_stepWidth, in_stepHeight){
	in_resourceManager.addFactory("knotColour", KnotColourFactory);
	in_resourceManager.addFactory("knotAlpha", KnotAlphaFactory);

	const taskDrawKnot = TaskDrawKnotFactory(in_resourceManager, in_webGLState, in_width, in_height, in_stepWidth, in_stepHeight);
	const state = {};

	//public methods ==========================
	const that = Object.create({
		"draw" : function(in_timeDelta){
			state["timeDelta"] = in_timeDelta;
			state["width"] = in_webGLState.getCanvasWidth(); 
			state["height"] = in_webGLState.getCanvasHeight();
			state["dontWidth"] = 0; 
			state["dontHeight"] = 0; 

			runArray([taskDrawKnot], state);

			return;
		},
	});

	return that;
}