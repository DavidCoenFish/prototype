/*
 */

import TaskLoadingFactory from "./taskloading/taskloading.js";
import TaskSelectCharacterFactory from "./taskselectcharacter/taskselectcharacter.js";
import TaskGameFactory from "./taskgame/taskgame.js";
import GameResourceManagerFactory from "./gameresourcemanager.js";

export default function(in_callback, in_div, in_webGLState, in_timeDelta, in_keepGoing){
	var m_gameResourceManager = GameResourceManagerFactory(in_webGLState);
	var m_taskLoading = TaskLoadingFactory(in_webGLState, in_div, m_gameResourceManager, 1.0);
	var m_activeTask = undefined;
	var m_localKeepGoing = true;
	var m_taskFactoryDictonary = {
		"SelectCharacter" : TaskSelectCharacterFactory,
		"Game" : TaskGameFactory,
		"Quit" : function(){ m_localKeepGoing = false; return undefined; }
	};
	const RequestLoading = function(){
		m_taskLoading.requestLoading();
		return;
	}
	const SetActiveGameTask = function(in_taskFactoryName){
		ReleaseActiveTask();
		m_activeTask = m_taskFactoryDictonary[in_taskFactoryName](in_webGLState, in_div, m_gameResourceManager, m_gameState, SetActiveGameTask, RequestLoading);
		return;
	}
	const ReleaseActiveTask = function(){
		if (undefined !== m_activeTask){
			m_activeTask.destroy();
			m_activeTask = undefined;
		}
		return;
	}
	var m_gameState = {
		"race" : "fae",
		"gender" : "male",
		"experence" : 0,
		"spent.strength" : 0,
	};

	SetActiveGameTask("SelectCharacter");

	return function(in_callback, in_div, in_webGLState, in_timeDelta, in_keepGoing){
		if ((false === in_keepGoing) || (false === m_localKeepGoing)){
			m_gameResourceManager.destroy();
			m_taskLoading.destroy();
			ReleaseActiveTask();
			return undefined;
		}

		if (undefined !== m_activeTask){
			m_activeTask.update(in_timeDelta);
		}

		m_taskLoading.update(in_timeDelta);

		return in_callback;
	}
}
