import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import {factoryFloat32 as Vector4FactoryFloat32} from './../core/vector4.js';
import ComponentScreenQuadFactory from './../webgl/component-screen-texture-quad.js';
import ComponentVignetteFactory from './../webgl/component-render-vignette.js';
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';

export default function (in_resourceManager, in_webGLState) {
	const m_component = ComponentScreenQuadFactory(
		in_resourceManager, 
		in_webGLState,
		Vector2FactoryFloat32(-1.0, -1.0), 
		Vector2FactoryFloat32(1.0, 1.0));
	const m_vignetteData = Vector4FactoryFloat32(in_webGLState.getCanvasWidth(), in_webGLState.getCanvasHeight(), 128, 128);
	const m_vignette = ComponentVignetteFactory(in_resourceManager, in_webGLState, Colour4FactoryFloat32(0.0, 0.0, 0.0, 0.25), m_vignetteData);
	//const m_background = Colour4FactoryFloat32(1.0, 1.0, 1.0, 1.0);
	const that = Object.create({
		"run" : function(in_state){
			m_vignetteData.setX(in_webGLState.getCanvasWidth());
			m_vignetteData.setY(in_webGLState.getCanvasHeight());

			in_webGLState.applyRenderTarget();
			//in_webGLState.clear(m_background);
			m_component.setTexture(in_state["texture"]);
			m_component.draw();
			m_vignette.draw();

			return in_state;
		},
		"destroy" : function(){
			m_component.destroy();
			return;
		}
	});

	return that;
}