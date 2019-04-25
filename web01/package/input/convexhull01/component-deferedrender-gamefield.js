/*
input [camera ray texture] 
output [rgba buffer, depth buffer]
 rgba <rgb & a as neg float emiitance, pos float refectivity?)
 
 */

import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import ComponentConvexHullRgbaFactory from './component-convexhull-rgba.js';
import ComponentSphereRgbaFactory from './component-sphere-rgba.js';
import ComponentCylinderRgbaFactory from './component-cylinder-rgba.js';
import ComponentCylinderRgbaDynamicFactory from './component-cylinder-rgba-dynamic.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA, RenderTargetDataFactoryDepthInt } from './../webgl/component-render-target-data-factory.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_state, in_texture){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA,
		RenderTargetDataFactoryDepthInt
	], in_width, in_height);
	const m_background = Colour4FactoryFloat32(0.0, 0.0, 0.0, 1.0);
	var m_componentConvexHullRgba = ComponentConvexHullRgbaFactory(in_resourceManager, in_webGLState, in_state, in_texture);
	var m_componentSphereRgba = ComponentSphereRgbaFactory(in_resourceManager, in_webGLState, in_state, in_texture);
	var m_componentCylinderRgba = ComponentCylinderRgbaFactory(in_resourceManager, in_webGLState, in_state, in_texture);
	var m_componentCylinderRgbaDynamic = ComponentCylinderRgbaDynamicFactory(in_resourceManager, in_webGLState, in_state, in_texture);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
			}

			in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());
			in_webGLState.clear(m_background, 1.0);
			m_componentConvexHullRgba.draw();
			m_componentSphereRgba.draw();
			m_componentCylinderRgba.draw();
			m_componentCylinderRgbaDynamic.draw();

			return;
		},
		"setTexture" : function(in_texture){
			m_componentConvexHullRgba.setTexture(in_texture);
			m_componentSphereRgba.setTexture(in_texture);
			m_componentCylinderRgba.setTexture(in_texture);
			m_componentCylinderRgbaDynamic.setTexture(in_texture);
			return;
		},
		"getTextureAttachment0" : function(){
			return m_componentRenderTarget.getTexture(0);
		},
		"getTextureDepth" : function(){
			return m_componentRenderTarget.getTexture(1);
		},
		"destroy" : function(){
			if (undefined !== m_componentRenderTarget){
				m_componentRenderTarget.destroy();
				m_componentRenderTarget = undefined;
			}
			if (undefined !== m_componentConvexHullRgba){
				m_componentConvexHullRgba.destroy();
				m_componentConvexHullRgba = undefined;
			}
			if (undefined !== m_componentCylinderRgba){
				m_componentCylinderRgba.destroy();
				m_componentCylinderRgba = undefined;
			}
			if (undefined !== m_componentSphereRgba){
				m_componentSphereRgba.destroy();
				m_componentSphereRgba = undefined;
			}
			if (undefined !== m_componentCylinderRgbaDynamic){
				m_componentCylinderRgbaDynamic.destroy();
				m_componentCylinderRgbaDynamic = undefined;
			}
			return;
		}
	});

	return result;

}
