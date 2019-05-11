import {factoryAppend as buttonFactory}  from './../../manipulatedom/button.js';
import {factoryFloat32 as Vector3FactoryFloat32} from "./../../core/vector3.js";
import {factoryFloat32 as Vector4FactoryFloat32} from "./../../core/vector4.js";
import RenderFactory from "./render.js";
import CameraComponentFactory from "./component-camera.js";

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


	//in_gameState
	var m_viewTarget = Vector3FactoryFloat32(0.0, 0.0, 3.0);
	var m_cameraComponent = CameraComponentFactory(
		m_viewTarget,
		in_div,
		in_webGLState
	);

	var m_dynamicCylinderArray = [];
	m_dynamicCylinderArray.push({
			"m_sphere" : Vector4FactoryFloat32(0.0, 0.0, 3.0, 0.65),
			"m_cylinder" : Vector4FactoryFloat32(0.0, 0.0, 1.0, 0.6),
			"m_colour" : Vector4FactoryFloat32(0.25, 0.25, 0.25, 0.5)
	});
	var m_state = {
		"u_camera" : m_cameraComponent.getCamera().getRaw(), //m_camera.getRaw(),
		"m_dynamicCylinderArray" : m_dynamicCylinderArray
	}

	var m_render = RenderFactory(in_webGLState, in_gameResourceManager, m_state, in_callbackRequestLoading, m_cameraComponent.getFovHRadian());

	const that = Object.create({
		"destroy" : function(){
			in_div.removeChild(m_button);
			m_render.destroy();
			m_cameraComponent.destroy();
		},
		"update" : function(in_timeDelta){
			//draw game world
			m_cameraComponent.update(in_timeDelta);
			m_render.update(in_timeDelta);
			// input click drag camera, click on things in world (move, attack, talk) and status buttons
		},
	});

	return that;
}