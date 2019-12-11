/*
the public interface intended to wrap a webgl context associated with a dom canvas element
 */

import ContextWrapperFactory from "./contextwrapperfactory.js"
import StateFactory from "./state.js"
import ShaderFactory from "./shader.js"
import ModelFactory from "./model.js"
import ModelAttributeFactory from "./modelattribute.js"

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
		//if value is undefined, we do not clear that channel
		"clear" : function(in_colourRedOrUndefined, in_colourGreenOrUndefined, in_colourBlueOrUndefined, in_colourAlphaOrUndefined, in_colourStecilOrUndefined, in_colourDepthOrUndefined){
			var clearFlag = 0;
			if ((undefined !== in_colourRedOrUndefined) ||
				(undefined !== in_colourGreenOrUndefined) ||
				(undefined !== in_colourBlueOrUndefined) ||
				(undefined !== in_colourAlphaOrUndefined)){
				clearFlag |= m_webGLContextWrapper.getEnum("COLOR_BUFFER_BIT");
				m_webGLState.setParam4("colorMask", 
					(undefined !== in_colourRedOrUndefined),
					(undefined !== in_colourGreenOrUndefined),
					(undefined !== in_colourBlueOrUndefined),
					(undefined !== in_colourAlphaOrUndefined)
					);
				m_webGLState.setParam4("clearColor", in_colourRedOrUndefined, in_colourGreenOrUndefined, in_colourBlueOrUndefined, in_colourAlphaOrUndefined);
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
			in_uniformNameTypeMapOrUndefined
		){
			return ShaderFactory( 
				m_webGLContextWrapper, 
				in_vertexShaderSource, 
				in_fragmentShaderSource, 
				in_vertexAttributeNameArrayOrUndefined, 
				in_uniformNameTypeMapOrUndefined
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

		"draw" : function(in_model, in_shader, in_firstOrUndefined, in_countOrUndefined){
			in_shader.apply();
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

