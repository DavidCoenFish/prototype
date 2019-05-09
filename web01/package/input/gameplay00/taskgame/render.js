import ComponentCameraRayFactory from "./../rendercommon/component-camera-ray.js";
import ComponentDefferedRenderFactory from "./component-deffered-render.js";
import ComponentPresentFactory from "./component-present";
import {factoryFloat32 as Vector3FactoryFloat32} from "./../../core/vector3.js";
import {factoryFloat32 as Matrix44FactoryFloat32} from "./../../core/matrix44.js";

/*
 */

export default function(in_webGLState, in_gameResourceManager, in_gameState, in_callbackSetActiveGameTask, in_callbackRequestLoading){
	const m_fovHRadian = 120.0 * (Math.PI/180.0);
	const m_far = 100.0;

	var m_cameraAt = Vector3FactoryFloat32(1.0, 0.0, 0.0);
	var m_cameraLeft = Vector3FactoryFloat32(0.0, 1.0, 0.0);
	var m_cameraUp = Vector3FactoryFloat32(0.0, 0.0, 1.0);
	var m_cameraPos = Vector3FactoryFloat32();
	var m_camera = Matrix44FactoryFloat32();

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

	var m_state = {
		"u_camera" : m_camera.getRaw(),
		"m_dynamicCylinderArray" : []
	};
	var m_componentCameraRay = ComponentCameraRayFactory(in_gameResourceManager.getResourceManager(), in_webGLState, m_fovHRadian, 
		in_webGLState.getCanvasWidth(),
		in_webGLState.getCanvasHeight()
		);
	var m_componentDefferedRender = ComponentDefferedRenderFactory(
		in_gameResourceManager.getResourceManager(), 
		in_webGLState, 
		in_webGLState.getCanvasWidth(),
		in_webGLState.getCanvasHeight(),
		m_state, 
		m_componentCameraRay.getTexture()
		);
	var m_componentPresent = ComponentPresentFactory(
		in_gameResourceManager.getResourceManager(), 
		in_webGLState, 
		m_state, 
		m_componentCameraRay.getTexture(),
		m_componentDefferedRender.getTextureAttachment0(),
		m_componentDefferedRender.getTextureDepth()
		);

	const that = Object.create({
		"destroy" : function(){
			m_componentCameraRay.destroy();
			m_componentDefferedRender.destroy();
			m_componentPresent.destroy();
		},
		"update" : function(in_timeDelta){
			m_componentCameraRay.update(
				in_webGLState.getCanvasWidth(),
				in_webGLState.getCanvasHeight()
			);

			//in_newWidth, in_newHeight, in_cameraRayTexture
			m_componentDefferedRender.update(
				in_webGLState.getCanvasWidth(),
				in_webGLState.getCanvasHeight(),
				m_componentCameraRay.getTexture());

			m_componentPresent.update(
				m_componentCameraRay.getTexture(),
				m_componentDefferedRender.getTextureAttachment0(),
				m_componentDefferedRender.getTextureDepth()
				);

		},
	});

	return that;
}
