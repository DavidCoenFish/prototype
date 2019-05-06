import KnotColourFactory from './outline_32_32.js';
import KnotAlphaFactory from './outlinea_32_32.js';
import { runArray } from "./../../core/taskhelper.js";
import TaskDrawKnotFactory from './taskdrawknot.js';
import TaskCatchUpFactory from './taskcatchup.js';
import TaskDropShadowFactory from './taskdropshadow.js';
import TaskPresentFactory from './taskpresent.js';
import TaskPresent2Factory from './taskpresent2.js';

export default function(in_resourceManager, in_webGLState, in_stepWidth, in_stepHeight){
	in_resourceManager.addFactory("knotColour", KnotColourFactory);
	in_resourceManager.addFactory("knotAlpha", KnotAlphaFactory);

	const taskDrawKnot = TaskDrawKnotFactory(in_resourceManager, in_webGLState, in_stepWidth, in_stepHeight);
	const taskCatchUpFactory = TaskCatchUpFactory(in_resourceManager, in_webGLState);
	const taskDropShadow = TaskDropShadowFactory(in_resourceManager, in_webGLState);
	const taskPresent = TaskPresentFactory(in_resourceManager, in_webGLState);
	const taskPresent2 = TaskPresent2Factory(in_resourceManager, in_webGLState);
	const state = {};

	//public methods ==========================
	const that = Object.create({
		"draw" : function(in_timeDelta, in_dontWidth, in_dontHeight, in_weight){
			state["timeDelta"] = in_timeDelta;
			state["dontWidth"] = in_dontWidth; 
			state["dontHeight"] = in_dontHeight; 
			state["weight"] = in_weight; 

			runArray([taskDrawKnot, taskCatchUpFactory, taskDropShadow, taskPresent, taskPresent2], state);

			return;
		},
	});

	return that;
}