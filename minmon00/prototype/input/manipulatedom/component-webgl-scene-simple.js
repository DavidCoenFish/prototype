import webGLStateFactory from './../webgl/webglstate.js'

export default function(
	in_callbackUpdateOrUndefined, // = function(in_timeDelta), return bool continue
	in_canvasElement,
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_extentionsOrUndefined,
	in_preserveDrawingBufferOrUndefined
){
	var m_webGLState = webGLStateFactory(
		in_canvasElement, 
		in_alphaOrUndefined, 
		in_depthOrUndefined, 
		in_antialiasOrUndefined, 
		in_extentionsOrUndefined,
		in_preserveDrawingBufferOrUndefined
		);

	const animationFrameCallback = function(in_timestamp){
		if (undefined !== in_callbackUpdateOrUndefined){
			if (false === in_callbackUpdateOrUndefined(in_timestamp)){
				return;
			}
		}

		m_requestId = requestAnimationFrame(animationFrameCallback);
		return;
	}

	var m_requestId = requestAnimationFrame(animationFrameCallback);

	const that = Object.create({
		"getCanvasElement" : function(){
			return in_canvasElement;
		},
		"getWebGLState" : function(){
			return m_webGLState;
		},
		"destroy" : function(){
			cancelAnimationFrame(m_requestId);
			m_requestId = undefined;
			m_webGLState.destroy();
			m_webGLState = undefined;
		}
	});

	return that;
}
