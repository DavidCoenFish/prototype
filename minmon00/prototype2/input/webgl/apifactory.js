/*
the public interface intended to wrap a webgl context associated with a dom canvas element
 */

import ContextWrapperFactory from "./contextwrapperfactory.js"
import StateFactory from "./state.js"

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

