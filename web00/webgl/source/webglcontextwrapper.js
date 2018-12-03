/*
wrap the webgl context out of a html5 canvas dom element
manage context lost and restored
manage creation and destruction of resources (which may need context lost and restored)
 */
const Core = require("core");
//const ShaderWrapper = require("./shaderwrapper.js");

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

	return webGLContext;
}

const makeParamObject = function(in_alphaOrUndefined, in_depthOrUndefined, in_antialiasOrUndefined, in_extentionsOrUndefined){
	return {
		"alpha" : in_alphaOrUndefined,
		"depth" : in_depthOrUndefined,
		"antialias" : in_antialiasOrUndefined,
		//premultipliedAlpha : false,
		"extentions" : in_extentionsOrUndefined
		};
}

const sTokenWebglContextLost = "webglcontextlost";
const sTokenWebglContextRestored = "webglcontextrestored";

const factory = function(in_html5CanvasElement, in_paramObjectOrUndefined, in_callbackContextRestoredOrUndefined){
	var m_webGLContext = getWebGLContext(in_html5CanvasElement, in_paramObjectOrUndefined);

	//public methods ==========================
	const result = Object.create({
		"getParameter" : function(in_enum){
			if (undefined === m_webGLContext){
				return undefined;
			}
			const parameter = m_webGLContext.getParameter(in_enum);
			getError();
			return parameter;
		},
		
		"getSupportedExtensions" : function(){
			if (undefined === m_webGLContext){
				return undefined;
			}
			const supportedExtensions = m_webGLContext.getSupportedExtensions();
			getError();
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
				const param = Array.prototype.slice.call(arguments, 1);
				const method = m_webGLContext[in_functionName];
				output = method.apply(m_webGLContext, param);
				getError();
			}
			return output;
		},

		"addResourceContextCallbacks" : function(in_contextLostCallback, in_contextRestoredCallback){
			result.addEventListener(sTokenWebglContextLost, in_contextLostCallback);
			result.addEventListener(sTokenWebglContextRestored, in_contextRestoredCallback);
			in_contextRestoredCallback(result);
		},

		"removeResourceContextCallbacks" : function(in_contextLostCallback, in_contextRestoredCallback){
			in_contextLostCallback(result);
			result.removeEventListener(sTokenWebglContextLost, in_contextLostCallback);
			result.removeEventListener(sTokenWebglContextRestored, in_contextRestoredCallback);
		}
	});

	Core.EventDispatcherDecorate(result);

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
		result.triggerEvent(sTokenWebglContextLost, result);
	};
	const contextRestoredCallback = function(in_event){
		m_webGLContext = undefined;
		m_webGLContext = getWebGLContext(in_html5CanvasElement, in_paramObjectOrUndefined);
		result.triggerEvent(sTokenWebglContextRestored, result);
		if (undefined !== in_callbackContextRestoredOrUndefined)
		{
			in_callbackContextRestoredOrUndefined(result);
		}
	};

	//these event names are matching the webgl canvas contract, internally we just use sTokenWebglContextLost...
	in_html5CanvasElement.addEventListener("webglcontextlost", contextLostCallback, false);
	in_html5CanvasElement.addEventListener("webglcontextrestored", contextRestoredCallback, false);
	
	return result;
}

module.exports = {
	"makeParamObject" : makeParamObject,
	"factory" : factory
};
