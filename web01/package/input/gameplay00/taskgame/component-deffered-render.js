/*
input [camera ray texture] 
output [rgba buffer, depth buffer]
 rgba <rgb & a as neg float emiitance, pos float refectivity?)
 
 */

import ComponentRenderTargetFactory from "./../../webgl/component-render-target.js";
import { RenderTargetDataFactoryAttachment0ByteRGBA, RenderTargetDataFactoryDepthInt } from "./../../webgl/component-render-target-data-factory.js";
import ComponentConvexHullRgbaFactory from './../rendercommon/component-convexhull-rgba.js';
//import ComponentSphereRgbaFactory from './component-sphere-rgba.js';
//import ComponentCylinderRgbaFactory from './component-cylinder-rgba.js';
import ComponentCylinderRgbaDynamicFactory from './../rendercommon/component-cylinder-rgba-dynamic.js';
import {factoryFloat32 as Colour4FactoryFloat32} from "./../../core/colour4.js";
import ModelFactory from "./modelhullobjectid.js"

export default function(
	in_resourceManager, 
	in_webGLState, 
	in_width, 
	in_height, 
	in_state, 
	in_cameraRayTexture
	){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA,
		RenderTargetDataFactoryDepthInt
	], in_width, in_height);
	const m_background = Colour4FactoryFloat32(0.0, 0.0, 0.0, 1.0);
	var m_componentConvexHullRgba = ComponentConvexHullRgbaFactory(in_resourceManager, in_webGLState, in_state, in_cameraRayTexture, ModelFactory);
	//var m_componentSphereRgba = ComponentSphereRgbaFactory(in_resourceManager, in_webGLState, in_state, in_cameraRayTexture);
	//var m_componentCylinderRgba = ComponentCylinderRgbaFactory(in_resourceManager, in_webGLState, in_state, in_cameraRayTexture);
	var m_componentCylinderRgbaDynamic = ComponentCylinderRgbaDynamicFactory(in_resourceManager, in_webGLState, in_state, in_cameraRayTexture);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight, in_cameraRayTexture){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
			}

			in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());
			in_webGLState.clear(m_background, 1.0);

			m_componentConvexHullRgba.update(in_cameraRayTexture);
			//m_componentSphereRgba.update(in_cameraRayTexture);
			//m_componentCylinderRgba.update(in_cameraRayTexture);
			m_componentCylinderRgbaDynamic.update(in_cameraRayTexture);

			return;
		},
		"getTextureAttachment0" : function(){
			return m_componentRenderTarget.getTexture(0);
		},
		"getTextureDepth" : function(){
			return m_componentRenderTarget.getTexture(1);
		},
		"destroy" : function(){
			m_componentRenderTarget.destroy();
			m_componentConvexHullRgba.destroy();
			//m_componentCylinderRgba.destroy();
			//m_componentSphereRgba.destroy();
			m_componentCylinderRgbaDynamic.destroy();
			return;
		}
	});

	return result;

}
