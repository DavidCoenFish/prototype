import ComponentCameraRayFactory from "./../rendercommon/component-camera-ray.js";
import ComponentDefferedRenderFactory from "./component-deffered-render.js";
import ComponentPresentFactory from "./component-present";

/*
 */

export default function(in_webGLState, in_gameResourceManager, in_gameState, in_callbackRequestLoading, in_fovHRadian){
	var m_state = in_gameState;
	var m_componentCameraRay = ComponentCameraRayFactory(
		in_gameResourceManager.getResourceManager(), 
		in_webGLState, 
		in_fovHRadian, 
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
