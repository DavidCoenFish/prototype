/*
input [camera ray texture, rgba<rgb, a{0...0.5 emitance, 0.5...1 reflectivity], depth] 
output [rgb buffer]
 */

import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import ComponentScreenSpaceShadowFactory from './component-screenspace-shadow.js';
import ComponentLightFactory from './component-light.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA } from './../webgl/component-render-target-data-factory.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth){
	var m_componentRenderTarget = ComponentRenderTargetFactory(in_webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA
	], in_width, in_height);
	var m_componentLight = ComponentLightFactory(in_resourceManager, in_webGLState, in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth);
	var m_componentScreenSpaceShadow = ComponentScreenSpaceShadowFactory(in_resourceManager, in_webGLState, in_textureDepth);
	var m_background = Colour4FactoryFloat32(0.0, 0.0, 0.0, 1.0);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_newWidth, in_newHeight){
			if (true === m_componentRenderTarget.setWidthHeight(in_newWidth, in_newHeight)){
				in_width = in_newWidth;
				in_height = in_newHeight;
			}

			in_webGLState.applyRenderTarget(m_componentRenderTarget.getRenderTarget());
			in_webGLState.clear(m_background);
			m_componentLight.draw();
			m_componentScreenSpaceShadow.draw(in_newWidth, in_newHeight);

			return;
		},
		"setTexture" : function(in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth){
			m_componentLight.setTexture(in_textureCameraRay, in_textureDeferedRGBA, in_textureDepth);
			m_componentScreenSpaceShadow.setTexture(in_textureDepth);
			return;
		},
		"getTexture" : function(){
			return m_componentRenderTarget.getTexture(0);
		},
		"getTextureShadow" : function(){
			
		},
		"destroy" : function(){
			if (undefined !== m_componentRenderTarget){
				m_componentRenderTarget.destroy();
				m_componentRenderTarget = undefined;
			}
			return;
		}
	});

	return result;

}
