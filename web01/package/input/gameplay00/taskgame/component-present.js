/**
 	var m_componentSkybox = ComponentSkyboxFactory(in_gameResourceManager.getResourceManager(), in_webGLState, m_state, m_componentCameraRay.getTexture());

 */
import ComponentSkyboxFactory from "./component-skybox.js";
import ComponentScreenspaceShadowFactory from "./component-screenspace-shadow.js";
import ComponentPresentColourTextureFactory from "./component-present-colour-texture.js";

export default function(
	in_resourceManager, 
	in_webGLState, 
	in_state, 
	in_cameraRayTexture, 
	in_colourTexture, 
	in_depthTexture
	){
	const m_componentSkybox = ComponentSkyboxFactory(in_resourceManager, in_webGLState, in_state, in_cameraRayTexture);
	const m_componentPresentColourTexture = ComponentPresentColourTextureFactory(
		in_resourceManager, 
		in_webGLState, 
		in_state, 
		in_colourTexture,
		in_depthTexture,
		m_componentSkybox.getFogTint()
		);
	const m_componentScreenSpaceShadow = ComponentScreenspaceShadowFactory(
			in_resourceManager, 
			in_webGLState, 				
			in_webGLState.getCanvasWidth(),
			in_webGLState.getCanvasHeight(),
			in_depthTexture
		);


	//public methods ==========================
	const that = Object.create({
		"update" : function(in_cameraRayTexture, in_colourTexture, in_depthTexture){
			in_webGLState.applyRenderTarget();
			m_componentSkybox.update(in_cameraRayTexture);
			m_componentPresentColourTexture.update(
				in_colourTexture, 
				in_depthTexture);
			m_componentScreenSpaceShadow.update(
				in_webGLState.getCanvasWidth(),
				in_webGLState.getCanvasHeight(),
				in_depthTexture);

			return;
		},
		"destroy" : function(){
			m_componentSkybox.destroy();
			m_componentPresentColourTexture.destroy();
			m_componentScreenSpaceShadow.destroy();
			return;
		}
	})

	return that;
}
