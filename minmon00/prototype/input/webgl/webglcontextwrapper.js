/*
wrap the webgl context out of a html5 canvas dom element
manage context lost and restored
manage creation and destruction of resources (which may need context lost and restored)
 */

import EventDispatcherDecorate from "./../core/eventdispatcherdecorate.js"

const getWebGLContext = function(in_html5CanvasElement, in_paramObjectOrUndefined){
	if (undefined === in_html5CanvasElement) {
		throw("Canvas element not found");
	} 

	if (!window.WebGLRenderingContext) {
		throw("Webgl not supported");
	} 

	var webGLContext = in_html5CanvasElement.getContext("webgl", in_paramObjectOrUndefined);

	if (undefined === webGLContext) {
		webGLContext = in_html5CanvasElement.getContext("experimental-webgl", in_paramObjectOrUndefined);
	}

	if (undefined === webGLContext) {
		throw("Unable to get webgl Context");
	}

	if (undefined === webGLContext) {
		throw("Unable to get webgl Context");
	}

	if ((undefined !== in_paramObjectOrUndefined) && (undefined !== in_paramObjectOrUndefined.extentions)){
		for (var index = 0; index < in_paramObjectOrUndefined.extentions.length; index++) { 
			const extentionName = in_paramObjectOrUndefined.extentions[index];
			var extention = webGLContext.getExtension(extentionName);
			if (null === extention){
				throw("failed to get extention:" + extentionName);
			}
		}
	}

	return webGLContext;
}

const sTokenWebglContextLost = "webglcontextlost";
const sTokenWebglContextRestored = "webglcontextrestored";

const makeParam = function(
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_extentionsOrUndefined,
	in_preserveDrawingBufferOrUndefined
	){
	var param = undefined;
	if (undefined !== in_alphaOrUndefined){
		if (undefined === param){
			param = {};
		}
		param["alpha"] = in_alphaOrUndefined;
	}
	if (undefined !== in_depthOrUndefined){
		if (undefined === param){
			param = {};
		}
		param["depth"] = in_depthOrUndefined;
	}
	if (undefined !== in_antialiasOrUndefined){
		if (undefined === param){
			param = {};
		}
		param["antialias"] = in_antialiasOrUndefined;
	}
	if (undefined !== in_extentionsOrUndefined){
		if (undefined === param){
			param = {};
		}
		param["extentions"] = in_extentionsOrUndefined;
	}
	if (undefined !== in_preserveDrawingBufferOrUndefined){
		if (undefined === param){
			param = {};
		}
		param["preserveDrawingBuffer"] = in_preserveDrawingBufferOrUndefined;
	}
	return param;
}

export default function(
	in_html5CanvasElement,
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_extentionsOrUndefined,
	in_preserveDrawingBufferOrUndefined
	){
	//private members ==========================
	var m_webGLContext = getWebGLContext(in_html5CanvasElement, makeParam(
		in_alphaOrUndefined, 
		in_depthOrUndefined, 
		in_antialiasOrUndefined, 
		in_extentionsOrUndefined,
		in_preserveDrawingBufferOrUndefined
		));

	//private methods ==========================
	const getError = function(){
		if (undefined === m_webGLContext){
			return;
		}
		var error = m_webGLContext.getError();
		var assert = true;
		var message;

		switch (error){
		default:
			message = "WebGLContetWrapper.GetError:unknown:" + error;
			break;
		case m_webGLContext.NO_ERROR: // 0: //NO_ERROR:
			return;
		case m_webGLContext.INVALID_ENUM: // 0x0500: //INVALID_ENUM:
			message = "WebGLContetWrapper.GetError:INVALID_ENUM";
			break;
		case m_webGLContext.INVALID_VALUE: // 0x0501: //INVALID_VALUE:
			message = "WebGLContetWrapper.GetError:INVALID_VALUE";
			break;
		case m_webGLContext.INVALID_OPERATION: //0x0502: //INVALID_OPERATION:
			message = "WebGLContetWrapper.GetError:INVALID_OPERATION";
			break;
		case m_webGLContext.OUT_OF_MEMORY: //0x0505: //OUT_OF_MEMORY:
			message = "WebGLContetWrapper.GetError:OUT_OF_MEMORY";
			break;
			//0x0506: //1286
		case m_webGLContext.CONTEXT_LOST_WEBGL:// 0x9242: //CONTEXT_LOST_WEBGL:
			assert = false;
			message = "WebGLContetWrapper.GetError:CONTEXT_LOST_WEBGL";
			return;
		}
		m_webGLContext = undefined;
		console.info(message);
		if (true === assert){
			alert(message);
		}
		return;
	};
	const contextLostCallback = function(in_event){
		in_event.preventDefault();
		m_webGLContext = undefined;
		that.triggerEvent(sTokenWebglContextLost, that);
	};
	const contextRestoredCallback = function(in_event){
		m_webGLContext = undefined;
		m_webGLContext = getWebGLContext(in_html5CanvasElement, in_param);
		that.triggerEvent(sTokenWebglContextRestored, that);
	};

	//public methods ==========================
	const that = Object.create({
		"getParameter" : function(in_enum){
			if (undefined === m_webGLContext){
				return undefined;
			}
			const parameter = m_webGLContext.getParameter(in_enum);
			if (DEVELOPMENT) getError();
			return parameter;
		},
		
		"getSupportedExtensions" : function(){
			if (undefined === m_webGLContext){
				return undefined;
			}
			const supportedExtensions = m_webGLContext.getSupportedExtensions();
			if (DEVELOPMENT) getError();
			return supportedExtensions;
		},

		"getEnum" : function(in_keySoftBind){
			if (undefined === m_webGLContext){
				return undefined;
			}
			const value = m_webGLContext[in_keySoftBind];
			return value;
		},

		"callMethod" : function(in_functionName){
			var output = undefined;
			if (undefined !== m_webGLContext){
				const method = m_webGLContext[in_functionName];
				if (undefined === method){
					console.log("callMethod failed to find:" + in_functionName);
					return output;
				}
				const param = Array.prototype.slice.call(arguments, 1);
				//console.log("callMethod:" + in_functionName + " param:" + param);
				output = method.apply(m_webGLContext, param);
				//if (undefined !== output){
				//	console.log("output:" + output);
				//}
				if (DEVELOPMENT) getError();
			}
			return output;
		},

		"addResourceContextCallbacks" : function(in_contextRestoredCallback, in_contextLostCallback){
			that.addEventListener(sTokenWebglContextLost, in_contextLostCallback);
			that.addEventListener(sTokenWebglContextRestored, in_contextRestoredCallback);
			if (m_webGLContext !== undefined){
				in_contextRestoredCallback(that);
			}
		},

		"removeResourceContextCallbacks" : function(in_contextRestoredCallback, in_contextLostCallback){
			if (m_webGLContext === undefined){
				in_contextLostCallback(that);
			}
			that.removeEventListener(sTokenWebglContextLost, in_contextLostCallback);
			that.removeEventListener(sTokenWebglContextRestored, in_contextRestoredCallback);
		},

		"getCanvasWidth" : function(){
			return in_html5CanvasElement.width;
		},

		"getCanvasHeight" : function(){
			return in_html5CanvasElement.height;
		},

	});

	EventDispatcherDecorate(that);

	//these event names are matching the webgl canvas contract, internally we just use sTokenWebglContextLost...
	in_html5CanvasElement["addEventListener"]("webglcontextlost", contextLostCallback, false);
	in_html5CanvasElement["addEventListener"]("webglcontextrestored", contextRestoredCallback, false);
	
	return that;
}

