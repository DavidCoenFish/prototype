import ComponentCameraRayFactory from './component-camera-ray.js';
import ComponentDeferedrenderGamefield from './component-deferedrender-gamefield.js';
import ComponentDeferedrenderLight from './component-deferedrender-light.js';
import ComponentSelectionrenderGamefield from './component-selectionrender-gamefield.js';
import ComponentPresentFactory from './component-present.js';

import ComponentScreenTextureArrayFactory from './../webgl/component-screen-texture-array.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import {fromDegrees} from './../core/radians.js';
import {factoryFloat32 as Vector2FactoryFloat32} from './../core/vector2.js';
import ComponentCameraFactory from './../manipulatedom/component-mouse-keyboard-camera.js';
import ComponentMouseTrackerFactory from './../manipulatedom/component-mouse-tracker.js';
//import ComponentWorldGridFactory from './../webgl/component-world-grid3.js';

export default function(in_currentTaskFunction, in_topLevelElement, in_webGLState, in_timeDelta){
	const m_mouseTracker = ComponentMouseTrackerFactory(in_topLevelElement, []);
	const m_resourceManager = ResourceManagerFactory();
	var m_canvasWidth = in_webGLState.getCanvasWidth();
	var m_canvasHeight = in_webGLState.getCanvasHeight();
	const m_viewport = Vector2FactoryFloat32(m_canvasWidth, m_canvasHeight);
	const m_fovhradian = fromDegrees(120.0);
	const m_componentCameraRay = ComponentCameraRayFactory(m_resourceManager, in_webGLState, m_fovhradian, m_canvasWidth, m_canvasHeight); 
	const m_state = {
		"u_fovhradian" : m_fovhradian,
		"u_viewportWidthHeight" : m_viewport.getRaw(),
		"u_cameraFar" : 100.0,

		"u_cameraPos" : [-3.60740327835083, 0.2688673138618469, 4.575437545776367],
		"u_cameraAt" : [0.7741137742996216, 0.08544383198022842, -0.6272537112236023],
		"u_cameraLeft" : [-0.03716240078210831, 0.9952741861343384, 0.08971188217401505],
		"u_cameraUp" : [0.6319547891616821, -0.046136945486068726, 0.7736307382583618]
	};
	const m_componentCamera = ComponentCameraFactory( in_topLevelElement, m_state );
	const m_componentDeferedrenderGamefield = ComponentDeferedrenderGamefield(m_resourceManager, in_webGLState, m_canvasWidth, m_canvasHeight, m_state, m_componentCameraRay.getTexture());
	const m_componentDefferedLight = ComponentDeferedrenderLight(m_resourceManager, in_webGLState, m_canvasWidth, m_canvasHeight, m_componentCameraRay.getTexture(), m_componentDeferedrenderGamefield.getTextureAttachment0(), m_componentDeferedrenderGamefield.getTextureDepth());
	const m_componentSelectionrenderGamefield = ComponentSelectionrenderGamefield(m_resourceManager, in_webGLState, m_canvasWidth, m_canvasHeight, m_state, m_componentCameraRay.getTexture(), m_mouseTracker);
	const m_componentPresent = ComponentPresentFactory(m_resourceManager, in_webGLState, m_state, m_componentCameraRay.getTexture(), m_componentDefferedLight.getTexture(), m_componentDeferedrenderGamefield.getTextureDepth(), m_componentSelectionrenderGamefield.getTextureSelectionOverlay());

	const m_componentScreenTextureArray = ComponentScreenTextureArrayFactory(m_resourceManager, in_webGLState, [
		m_componentDeferedrenderGamefield.getTextureDepth(),
		m_componentDeferedrenderGamefield.getTextureAttachment0(),
		m_componentSelectionrenderGamefield.getTextureSelectionOverlay()
		], 4);

	return function(in_currentTaskFunction, in_topLevelElement, in_webGLState, in_timeDelta, in_keepGoing){
		if (true !== in_keepGoing){
			var message = "";
			message += `		"u_cameraPos" : [${m_state.u_cameraPos[0]}, ${m_state.u_cameraPos[1]}, ${m_state.u_cameraPos[2]}],\n`;
			message += `		"u_cameraAt" : [${m_state.u_cameraAt[0]}, ${m_state.u_cameraAt[1]}, ${m_state.u_cameraAt[2]}],\n`;
			message += `		"u_cameraLeft" : [${m_state.u_cameraLeft[0]}, ${m_state.u_cameraLeft[1]}, ${m_state.u_cameraLeft[2]}],\n`;
			message += `		"u_cameraUp" : [${m_state.u_cameraUp[0]}, ${m_state.u_cameraUp[1]}, ${m_state.u_cameraUp[2]}],\n`;
			console.log(message);

			m_mouseTracker.destroy();
			m_componentCameraRay.destroy();
			m_componentCamera.destroy();
			m_componentDeferedrenderGamefield.destroy();
			m_componentDefferedLight.destroy();
			m_componentSelectionrenderGamefield.destroy();
			m_componentPresent.destroy();
			m_componentScreenTextureArray.destroy();

			return undefined;
		}

		m_canvasWidth = in_webGLState.getCanvasWidth();
		m_canvasHeight = in_webGLState.getCanvasHeight();
		m_viewport.setX(m_canvasWidth);
		m_viewport.setY(m_canvasHeight);

		m_componentCameraRay.update(m_canvasWidth, m_canvasHeight);
		m_componentCamera.update(in_timeDelta);

		m_componentDeferedrenderGamefield.setTexture(m_componentCameraRay.getTexture());
		m_componentDeferedrenderGamefield.update(m_canvasWidth, m_canvasHeight);
		m_componentDefferedLight.setTexture(m_componentCameraRay.getTexture(), m_componentDeferedrenderGamefield.getTextureAttachment0(), m_componentDeferedrenderGamefield.getTextureDepth());
		m_componentDefferedLight.update(m_canvasWidth, m_canvasHeight);

		m_componentSelectionrenderGamefield.setTexture(m_componentCameraRay.getTexture());
		m_componentSelectionrenderGamefield.update(m_canvasWidth, m_canvasHeight);

		m_componentPresent.setTextureCameraRay(m_componentCameraRay.getTexture());
		m_componentPresent.setTextureDeferedrender(m_componentDefferedLight.getTexture(), m_componentDeferedrenderGamefield.getTextureDepth());
		m_componentPresent.setTextureOverlay(m_componentSelectionrenderGamefield.getTextureSelectionOverlay());

		in_webGLState.applyRenderTarget();
		m_componentPresent.draw();

		//debug draw texture array
		m_componentScreenTextureArray.setTexture(0, m_componentDeferedrenderGamefield.getTextureDepth());
		m_componentScreenTextureArray.setTexture(1, m_componentDeferedrenderGamefield.getTextureAttachment0());
		m_componentScreenTextureArray.setTexture(2, m_componentSelectionrenderGamefield.getTextureSelectionOverlay());
		m_componentScreenTextureArray.draw();

		return in_currentTaskFunction;
	}
}
 