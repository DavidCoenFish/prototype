import {factoryFloat32 as Vector4FactoryFloat} from "./../core/vector4.js";
import ComponentTerrainFactory from "./component-terrain.js";

export default function(in_callback, in_div, in_webGLState, in_timeDelta, in_keepGoing){
	var m_cameraPanZoomAspect = Vector4FactoryFloat(0.0, 0.0, 0.0);
	var m_state = {
		"u_cameraPanZoomAspect" : m_cameraPanZoomAspect.getRaw(),
		"u_timeAccumulation" : 0.0
	};
	var m_componentTerain = ComponentTerrainFactory(in_webGLState, m_state);

	var m_oldX;
	var m_oldY;
	const mouseMoveCallback = function(in_event){
		const rect = in_div.getBoundingClientRect();
		const x = in_event.clientX - rect.left;
		const y = in_event.clientY - rect.top;

		const deltaX = (undefined !== m_oldX) ? x - m_oldX : 0.0;
		const deltaY = (undefined !== m_oldY) ? y - m_oldY : 0.0;
		m_oldX = x;
		m_oldY = y;

		const lmb = (0 !== (in_event.buttons & 1));

		if (true === lmb){
			m_cameraPanZoomAspect.setX(m_cameraPanZoomAspect.getX() - (deltaX / in_webGLState.getCanvasWidth()));
			m_cameraPanZoomAspect.setY(m_cameraPanZoomAspect.getY() + (deltaY / in_webGLState.getCanvasHeight()));
		}

		return;
	}

	const wheelCallback = function(in_event){
		var zoom = m_cameraPanZoomAspect.getZ() - ((in_event.wheelDelta) / 120.0);
		zoom = Math.max(0.0, Math.min(1.0, zoom));
		m_cameraPanZoomAspect.setZ(zoom);
	}

	in_div.addEventListener("mousemove", mouseMoveCallback);
	in_div.addEventListener("wheel", wheelCallback);

	return function(in_callback, in_div, in_webGLState, in_timeDelta, in_keepGoing){
		if (false === in_keepGoing){
			in_div.removeEventListener("mousemove", mouseMoveCallback);
			in_div.removeEventListener("wheel", wheelCallback);
			m_componentTerain.destroy();

			return undefined;
		}
		m_cameraPanZoomAspect.setW(in_webGLState.getCanvasWidth() / in_webGLState.getCanvasHeight()); 
		m_state.u_timeAccumulation += in_timeDelta;

		m_componentTerain.run();

		return in_callback;
	};
}
