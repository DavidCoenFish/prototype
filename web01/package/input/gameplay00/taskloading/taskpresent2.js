import ComponentRenderFadeTexture from "./../../webgl/component-render-fade-texture.js"
//import {factoryFloat32} from "./../../core/colour4.js";

export default function (in_resourceManager, in_webGLState) {
	var m_component = ComponentRenderFadeTexture(in_resourceManager, in_webGLState, undefined);

	const that = Object.create({
		"run" : function(in_state){
			
			in_webGLState.applyRenderTarget();
			//in_webGLState.clear(factoryFloat32(1.0, 0.0, 0.0, 1.0));

			m_component.setTexture(in_state["texture"]);
			m_component.setAlpha(in_state["weight"], 0.0);

			m_component.draw();

			return in_state;
		},
		"destroy" : function(){
			m_component.destroy();
			m_renderTargetWrapper.destroy();
			return;
		}
	});

	return that;
}