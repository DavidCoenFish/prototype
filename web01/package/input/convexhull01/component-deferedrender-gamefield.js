/*
input [camera ray texture] 
output [rgba buffer, depth buffer]
 rgba <rgb & a as neg float emiitance, pos float refectivity?)
 
 */

import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import ComponentConvexHullRgbaFactory from './component-convexhull-rgba.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA, RenderTargetDataFactoryDepthInt } from './../webgl/component-render-target-data-factory.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_state, in_texture){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA,
		RenderTargetDataFactoryDepthInt
	], in_width, in_height);
	const m_background = Colour4FactoryFloat32(0.0, 0.0, 0.0, 1.0);
	var m_componentConvexHullRgba = ComponentConvexHullRgbaFactory(in_resourceManager, in_webGLState, in_state, in_texture);

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

			return;
		},
		"setTexture" : function(in_texture){
			m_componentConvexHullRgba.setTexture(in_texture);
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
			return;
		}
	});

	return result;

}
