/*
input => game logic => game state => render

game state as snapshot, but not full information~ command context...

history of input from last update (button clicked, mouse dragged)
game state

snapshot 
	paramaters ready for the renderer, but the render decides how to pack
	would snapshot have the name of the static world geometry 
		(upstream has job of getting the resource ready though?)
	param for skybox
	example data, but we dont want to create each frame.... so interface to the data?
	{
		stage : [ 
			{ "type" : "loading", "weight" : 0.4},
			{ "type" : "lastworld", "weight" : 0.6},
			{ "type" : "world", "weight" : ...}
		]
	}
	other types "gamestage", "washcolour"

render

m_gameResourceManager
	requestLevel
	is level loaded
	getlevelRenderModelXXX [ConvexHull,Sphere,Cylinder]x[ObjectId,Decorative]
	getLevelBaseObjectID

so what would happen if we where loading new world, a loading render? or is it a different snapshot
and then how to mix.


InputFactory
		destroy
		update(timeDelta)
GameStateFactory
		destroy
		update(m_gameStateSnapshot, in_timeDelta, m_input, m_gameResourceManager)
GameStateSnapshotFactory
		destroy
		beginNewSnapshot(timeDelta)
RenderFactory
		destroy
		update(m_gameStateSnapshot, m_gameResourceManager)
GameResourceManagerFactory
		destroy
		requestLevel
		isLevelLoaded
		getLocalisedString(in_key)


or let go of snapshot state and just decouple
state can do whatever, and we keep an eye out for loading request


state select new character
state in game
state inventory
loading

taskSelectCharacter();
taskGame();
taskLoading();

 */

import TaskLoadingFactory from "./taskloading.js";
import GameResourceManagerFactory from "./gameresourcemanager.js";

export default function(in_callback, in_div, in_webGLState, in_timeDelta, in_keepGoing){
	var m_gameResourceManager = GameResourceManagerFactory(in_webGLState);
	var m_taskLoading = TaskLoadingFactory(in_webGLState, in_div, m_gameResourceManager);
	var m_gameState = {};

	return function(in_callback, in_div, in_webGLState, in_timeDelta, in_keepGoing){
		if (false === in_keepGoing){
			m_gameResourceManager.destroy();
			m_taskLoading.destroy();
			return undefined;
		}

		m_taskLoading.update(in_timeDelta, 1.0);

		return in_callback;
	}
}
