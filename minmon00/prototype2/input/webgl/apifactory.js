/*
the public interface intended to wrap a webgl context associated with a dom canvas element
 */

import ContextWrapperFactory from "./contextwrapperfactory.js"
import StateFactory from "./state.js"
import ShaderFactory from "./shader.js"
import {ShaderDataUniformFactory, ShaderDataUniformNormaliseFactory} from "./shaderdata.js"
import ModelFactory from "./model.js"
import ModelAttributeFactory from "./modelattribute.js"
import RenderTargetFactory from "./rendertarget.js"
import RenderBufferFactory from "./renderbuffer.js"
import TextureFactory from "./texture.js"
import RenderTargetDataRenderBuffer from "./rendertargetdatarenderbuffer.js"
import RenderTargetDataTexture from "./rendertargetdatatexture.js"

export default function(
	in_html5CanvasElement,
	in_extentionsOrUndefined,
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_preserveDrawingBufferOrUndefined
){
	var m_webGLContextWrapper = ContextWrapperFactory(
		in_html5CanvasElement, 
		in_extentionsOrUndefined,
		in_alphaOrUndefined, 
		in_depthOrUndefined, 
		in_antialiasOrUndefined, 
		in_preserveDrawingBufferOrUndefined
		);

	var m_webGLState = StateFactory(m_webGLContextWrapper);

	const that = Object.create({
		"createRenderTarget" : function(
			in_x,
			in_y,
			in_width,
			in_height,
			in_renderTargetDataArray
		){
			return RenderTargetFactory(
				m_webGLContextWrapper,
				m_webGLState,
				in_x,
				in_y,
				in_width,
				in_height,
				in_renderTargetDataArray
				);
		},

		//render buffer is a like a texture but without the expectation to read from it, like a depth texture
		"createRenderBuffer" : function(
			in_targetEnumName, 
			in_internalFormatEnumName,
			in_width, 
			in_height
			){
			return RenderBufferFactory(
				m_webGLContextWrapper,
				in_targetEnumName, 
				in_internalFormatEnumName,
				in_width, 
				in_height
				);
		},
		"createTexture" : function(
			in_width, 
			in_height,
			in_internalFormatEnumName,
			in_formatEnumName,
			in_typeEnumName,
			in_dataOrUndefined, 
			in_flipOrUndefined,
			in_magFilterEnumNameOrUndefined,
			in_minFilterEnumNameOrUndefined,
			in_wrapSEnumNameOrUndefined,
			in_wrapTEnumNameOrUndefined
		){
			return TextureFactory(
				m_webGLContextWrapper,
				in_width, 
				in_height,
				in_internalFormatEnumName,
				in_formatEnumName,
				in_typeEnumName,
				in_dataOrUndefined, 
				in_flipOrUndefined,
				in_magFilterEnumNameOrUndefined,
				in_minFilterEnumNameOrUndefined,
				in_wrapSEnumNameOrUndefined,
				in_wrapTEnumNameOrUndefined
			);
		},

		"createRenderTargetDataRenderBuffer" : function(
			in_renderBuffer,
			in_targetEnumName,
			in_attachmentEnumName
		){
			return RenderTargetDataRenderBuffer(
				m_webGLContextWrapper,
				in_renderBuffer,
				in_targetEnumName,
				in_attachmentEnumName
				);
		},

		"createRenderTargetDataTexture" : function(
			in_texture,
			in_targetEnumName,
			in_attachmentEnumName,
			in_texTargetEnumName
		){
			return RenderTargetDataTexture(
				m_webGLContextWrapper,
				in_texture,
				in_targetEnumName,
				in_attachmentEnumName,
				in_texTargetEnumName
				);
		},

		"setRenderTarget" : function(in_renderTargetOrUndefined){
			if (undefined === in_renderTargetOrUndefined){
				const targetEnum = m_webGLContextWrapper.getEnum("FRAMEBUFFER");
				m_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, null);
				m_webGLState.set("viewport", [0, 0, that.getCanvasWidth(), that.getCanvasHeight()]);
			} else {
				in_renderTargetOrUndefined.apply();
			}
		},

		//if value is undefined, we do not clear that channel
		"clear" : function(in_colourRedOrUndefined, in_colourGreenOrUndefined, in_colourBlueOrUndefined, in_colourAlphaOrUndefined, in_colourStecilOrUndefined, in_colourDepthOrUndefined){
			var clearFlag = 0;
			if ((undefined !== in_colourRedOrUndefined) ||
				(undefined !== in_colourGreenOrUndefined) ||
				(undefined !== in_colourBlueOrUndefined) ||
				(undefined !== in_colourAlphaOrUndefined)){
				clearFlag |= m_webGLContextWrapper.getEnum("COLOR_BUFFER_BIT");
				m_webGLState.set("colorMask", 
					[(undefined !== in_colourRedOrUndefined),
					(undefined !== in_colourGreenOrUndefined),
					(undefined !== in_colourBlueOrUndefined),
					(undefined !== in_colourAlphaOrUndefined)]
					);
				m_webGLState.set("clearColor", [in_colourRedOrUndefined, in_colourGreenOrUndefined, in_colourBlueOrUndefined, in_colourAlphaOrUndefined]);
			}

			if (undefined !== in_colourStecilOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("STENCIL_BUFFER_BIT");
				m_webGLState.set("stencilMask", true);
				m_webGLState.set("clearStencil", in_colourStecilOrUndefined);
			}

			if (undefined !== in_colourDepthOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("DEPTH_BUFFER_BIT");
				m_webGLState.set("depthMask", true);
				m_webGLState.set("clearDepth", in_colourDepthOrUndefined);
			}

			if (0 !== clearFlag){
				m_webGLContextWrapper.callMethod("clear", clearFlag);
			}

		},

		"createShader" : function(
			in_vertexShaderSource, 
			in_fragmentShaderSource, 
			in_vertexAttributeNameArrayOrUndefined, 
			in_shaderDataArrayOrUndefined //[{"getName", "apply":function(in_uniformLocation, in_value)},...]
		){
			return ShaderFactory( 
				m_webGLContextWrapper, 
				in_vertexShaderSource, 
				in_fragmentShaderSource, 
				in_vertexAttributeNameArrayOrUndefined, 
				in_shaderDataArrayOrUndefined
				);
		},

		"createShaderDataUniform" : function(
			in_name,
			in_typeName
		){
			return ShaderDataUniformFactory(
				m_webGLContextWrapper,
				in_name,
				in_typeName
			);
		},

		"createShaderDataUniformNormalise" : function(
			in_name,
			in_typeName,
			in_normalise
		){
			return ShaderDataUniformNormaliseFactory(
				m_webGLContextWrapper,
				in_name,
				in_typeName,
				in_normalise
			);
		},

		"createModel" : function(
			in_modeName,
			in_elementCount,
			in_mapModelAttribute,
			in_elementIndexOrUndefined
		){
			return ModelFactory(
				m_webGLContextWrapper,
				in_modeName,
				in_elementCount,
				in_mapModelAttribute,
				in_elementIndexOrUndefined
				);
		},

		"createModelAttribute" : function(
			in_typeName, //string
			in_elementsPerVertex, //int
			in_arrayData,
			in_usageName, //string //STATIC_DRAW, 
			in_normalise //bool
		){
			return ModelAttributeFactory(
				m_webGLContextWrapper,
				in_typeName, //string
				in_elementsPerVertex, //int
				in_arrayData,
				in_usageName, //string //STATIC_DRAW, 
				in_normalise //bool
				);
		},

		/*
		we don't put the shader in one dag node and the model draw in another to ensure the shader is actually applied
		*/
		"draw" : function(
			in_shader, 
			in_uniforValueArrayOrUndefined, 
			in_textureArrayOrUndefined, 
			in_model, 
			in_firstOrUndefined, 
			in_countOrUndefined, 
			in_drawStateOrUndefined
			){
			//applyDrawState(in_drawStateOrUndefined);
			m_webGLState.applayDrawState(in_drawStateOrUndefined);
			in_shader.apply(in_uniforValueArrayOrUndefined, in_textureArrayOrUndefined);
			in_model.draw(in_shader.getMapVertexAttribute(), in_firstOrUndefined, in_countOrUndefined);
			return;
		},
		
		"getCanvasWidth" : function(){
			return m_webGLContextWrapper.getCanvasWidth();
		},

		"getCanvasHeight" : function(){
			return m_webGLContextWrapper.getCanvasHeight();
		},

		"destroy" : function(){
			m_webGLState.destroy();
		},

	});

	return that;
}

