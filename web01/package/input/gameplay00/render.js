import RenderLoadingFactory from "./renderloading/renderloading.js";

export default function(in_webGLState, in_div, in_gameResourceManager){
	const m_renderLoading = RenderLoadingFactory(in_webGLState, in_div, in_gameResourceManager);
	const that = Object.create({
		"destroy" : function(){
			m_renderLoading.destroy();
		},
		"update" : function(in_gameStateSnapshot, in_gameResourceManager){
			//m_renderWorld.update(in_gameStateSnapshot.getWorld());
			m_renderLoading.update(in_gameStateSnapshot.getTimeDelta(), in_gameStateSnapshot.getLoading());
		},
	});

	return that;
}
