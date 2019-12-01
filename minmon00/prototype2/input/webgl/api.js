/*
the public interface intended to wrap a webgl context associated with a dom canvas element
 */

import ContextWrapperFactory from "./contextwrapper.js"
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
		//if value is undefined, we do not chear that channel
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

			if (undefined !== in_stencilOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("STENCIL_BUFFER_BIT");
				m_webGLState.set("stencilMask", true);
				m_webGLState.set("clearStencil", in_stencilOrUndefined);
			}

			if (undefined !== in_depthOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("DEPTH_BUFFER_BIT");
				m_webGLState.set("depthMask", true);
				m_webGLState.set("clearDepth", in_depthOrUndefined);
			}

			if (0 !== clearFlag){
				m_webGLContextWrapper.callMethod("clear", clearFlag);
			}

		}
	});

	return that;
}

