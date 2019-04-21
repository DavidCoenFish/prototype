/*
input [camera ray texture] 
output [selection rbga]
 rgba <rg : objectID>
 
 */

import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import ComponentConvexHullSelectionFactory from './component-convexhull-selection.js';
import ComponentSelectionGrowFactory from './component-selection-grow.js';
import ComponentSelectionOverlayFactory from './component-selection-overlay.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA, RenderTargetDataFactoryDepthInt } from './../webgl/component-render-target-data-factory.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_state, in_texture, in_mouseTracker){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA,
		RenderTargetDataFactoryDepthInt
		//RenderTargetRenderBufferFactoryDepthStencil
	], in_width, in_height);
	const m_background = Colour4FactoryFloat32(0.0, 0.0, 0.0, 1.0);
	var m_componentConvexHullSelection = ComponentConvexHullSelectionFactory(in_resourceManager, in_webGLState, in_state, in_texture);
	var m_componentSelectionGrow = ComponentSelectionGrowFactory(in_resourceManager, in_webGLState, in_width, in_height,
		m_componentRenderTarget.getTexture(0),
		m_componentRenderTarget.getTexture(1)
		);
	var m_componentSelectionOverlay = ComponentSelectionOverlayFactory(in_resourceManager, in_webGLState, in_width, in_height, m_componentRenderTarget.getTexture(0), m_componentSelectionGrow.getTexture(), in_mouseTracker);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
			}

			in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());
			in_webGLState.clear(m_background, 1.0);
			m_componentConvexHullSelection.draw();

			m_componentSelectionGrow.setTexture(
				m_componentRenderTarget.getTexture(0),
				m_componentRenderTarget.getTexture(1)
				);
			m_componentSelectionGrow.update(in_newWidth, in_newHeight);

			m_componentSelectionOverlay.setTexture(
				m_componentRenderTarget.getTexture(0),
				m_componentSelectionGrow.getTexture()
				);
			m_componentSelectionOverlay.update(in_newWidth, in_newHeight);

			return;
		},
		"setTexture" : function(in_texture){
			m_componentConvexHullSelection.setTexture(in_texture);
			return;
		},
		"getTextureAttachment0" : function(){
			return m_componentRenderTarget.getTexture(0);
		},
		"getTextureSelectionOverlay" : function(){
			return m_componentSelectionOverlay.getTexture();
		},		
		"destroy" : function(){
			if (undefined !== m_componentRenderTarget){
				m_componentRenderTarget.destroy();
				m_componentRenderTarget = undefined;
			}
			if (undefined !== m_componentConvexHullSelection){
				m_componentConvexHullSelection.destroy();
				m_componentConvexHullSelection = undefined;
			}
			if (undefined !== m_componentSelectionGrow){
				m_componentSelectionGrow.destroy();
				m_componentSelectionGrow = undefined;
			}
			return;
		}
	});

	return result;

}
