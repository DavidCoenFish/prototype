import {factoryFloat32 as Vector3FactoryFloat32, crossProduct as Vector3CrossProduct } from "./../../core/vector3.js";
import {factoryFloat32 as Matrix44FactoryFloat32} from "./../../core/matrix44.js";
import { factoryQuaternion as Matrix33FactoryQuaternion, transformVector3 as Matrix33TransformVector3 } from './../../core/matrix33.js'
import { 
	factoryYawPitchRoll as QuaternionFactoryYawPitchRoll,
	} from './../../core/quaternion.js'


export default function(
		in_viewTarget,
		in_div,
		in_webGLState
	){

	const m_fovHRadian = 120.0 * (Math.PI/180.0);
	const m_far = 100.0;

	var m_yaw = 0.0;
	var m_pitch = 0.0;

	var m_cameraAt = Vector3FactoryFloat32(1.0, 0.0, 0.0);
	var m_cameraLeft = Vector3FactoryFloat32(0.0, 1.0, 0.0);
	var m_cameraUp = Vector3FactoryFloat32(0.0, 0.0, 1.0);
	var m_dolly = 5.0;
	var m_cameraPos = Vector3FactoryFloat32(0.0, 0.0, 0.0);
	const updateCameraPos = function(){
		m_cameraPos.set(
			in_viewTarget.getX() - (m_cameraAt.getX() * m_dolly),
			in_viewTarget.getY() - (m_cameraAt.getY() * m_dolly),
			in_viewTarget.getZ() - (m_cameraAt.getZ() * m_dolly)
		);
	};
	updateCameraPos();

	var m_camera = Matrix44FactoryFloat32();

	const updateCamera = function(){
		m_camera.set00(m_cameraAt.getX());
		m_camera.set10(m_cameraAt.getY());
		m_camera.set20(m_cameraAt.getZ());
		m_camera.set30(m_fovHRadian);
		m_camera.set01(m_cameraLeft.getX());
		m_camera.set11(m_cameraLeft.getY());
		m_camera.set21(m_cameraLeft.getZ());
		m_camera.set31(in_webGLState.getCanvasWidth());
		m_camera.set02(m_cameraUp.getX());
		m_camera.set12(m_cameraUp.getY());
		m_camera.set22(m_cameraUp.getZ());
		m_camera.set32(in_webGLState.getCanvasHeight());
		m_camera.set03(m_cameraPos.getX());
		m_camera.set13(m_cameraPos.getY());
		m_camera.set23(m_cameraPos.getZ());
		m_camera.set33(m_far);
	}
	updateCamera();

	const applyChange = function(in_yawDelta, in_pitchDelta){
		//console.log("in_yawDelta:" + in_yawDelta + " in_pitchDelta:" + in_pitchDelta);
		m_yaw += in_yawDelta;
		m_pitch += in_pitchDelta;

		m_pitch = Math.min(Math.PI * 0.4, m_pitch);
		m_pitch = Math.max(-Math.PI * 0.1, m_pitch);

		var rotation = QuaternionFactoryYawPitchRoll(
			m_yaw,
			m_pitch,
			0.0
			);

		const matrix = Matrix33FactoryQuaternion(rotation);
		m_cameraAt.set(matrix.get00(), matrix.get10(), matrix.get20());
		m_cameraLeft.set(matrix.get01(), matrix.get11(), matrix.get21());
		m_cameraUp.set(matrix.get02(), matrix.get12(), matrix.get22());

		return;
	}

	var m_oldX = undefined;
	var m_oldY = undefined;
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
			var scale = (m_fovHRadian / (rect.right - rect.left)) * 2.0;
			applyChange(deltaX * scale, -deltaY * scale);
		}

		return;
	}

	const wheelCallback = function(in_event){
		m_dolly += (-in_event.wheelDelta) / 120.0;
		m_dolly = Math.min(m_dolly, 10.0);
		m_dolly = Math.max(m_dolly, 1.0);
	}



	//public methods ==========================
	const result = Object.create({
		"update" : function(in_timeDelta){
			updateCameraPos();
			updateCamera();
		},
		"getCamera" : function(){
			return m_camera;
		},
		"getFovHRadian" : function(){
			return m_fovHRadian;
		},
		"destroy" : function(){
			in_div.removeEventListener("mousemove", mouseMoveCallback);
			in_div.removeEventListener("wheel", wheelCallback);

			return;
		}
	});

	in_div.addEventListener("mousemove", mouseMoveCallback);
	in_div.addEventListener("wheel", wheelCallback);

	return result;

}
