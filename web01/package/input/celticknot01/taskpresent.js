import ComponentFactory from './../webgl/component-screen-texture-quad.js'
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js'

export default function (in_resourceManager, in_webGLState) {
	const m_component = ComponentFactory(
		in_resourceManager, 
		in_webGLState,
		Vector2FactoryFloat32(-1.0, -1.0), 
		Vector2FactoryFloat32(1.0, 1.0));
		
	const that = Object.create({
		"run" : function(in_state){
			in_webGLState.applyRenderTarget();
			m_component.setTexture(in_state["texture"]);
			m_component.draw();

			return in_state;
		},
		"destroy" : function(){
			m_component.destroy();
			return;
		}
	});

	return that;
}