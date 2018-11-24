/*
wrap the webgl context out of a html5 canvas dom element
manage context lost and restored
manage creation and destruction of resources (which may need context lost and restored)
 */
const Core = require("core");

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
			const supportedExtensions = m_webGLContext.getSupportedExtensions();
			getError();
			return supportedExtensions;
		},

		"getEnum" : function(in_keySoftBind){
			const value = m_webGLContext[in_keySoftBind];
			getError();
			return value;
		},

		"clear" : function(in_colourOrUndefined, in_depthOrUndefined, in_stencilOrUndefined){
			var clearFlag = 0;

			if ((undefined !== in_colourOrUndefined) &&
				(undefined !== m_webGLContext)){
				clearFlag |= m_webGLContext.COLOR_BUFFER_BIT;
				m_webGLContext.clearColor(
					in_colourOrUndefined.getRed(),
					in_colourOrUndefined.getGreen(),
					in_colourOrUndefined.getBlue(),
					in_colourOrUndefined.getAlpha()
					);
				getError();
			}

			if ((undefined !== in_depthOrUndefined) &&
				(undefined !== m_webGLContext)){
				clearFlag |= m_webGLContext.DEPTH_BUFFER_BIT;
				m_webGLContext.clearDepth(in_depthOrUndefined);
				getError();
			}

			if ((undefined !== in_stencilOrUndefined) &&
				(undefined !== m_webGLContext)){
				clearFlag |= m_webGLContext.STENCIL_BUFFER_BIT;
				m_webGLContext.clearStencil(in_stencilOrUndefined);
				getError();
			}

			if (undefined !== m_webGLContext){
				m_webGLContext.clear(clearFlag);
				getError();
			}

			return;
		},

		"createShader" : function(in_vertexShader, in_fragmentShader, in_uniformContainer){
		},
		"destroyShader" : function(in_shader){
		},
		"createTexture" : function(in_width, in_height, in_dataOrUndefined){
		},
		"destroyTexture" : function(in_texture){
		},
		"createMaterial" : function(){
		},
		"setMaterial" : function(in_material){
		},
		"destroyMaterial" : function(in_material){
		},
		"createRenderTarget" : function(){
		},
		"setRenderTarget" : function(in_renderTarget){
		},
		"destroyRenderTarget" : function(in_renderTarget){
		},
		"createModel" : function(){
		},
		"drawModel" : function(in_model){
		},
		"destroyModel" : function(in_model){
		},

		"sTokenWebglContextLost" : sTokenWebglContextLost,
		"sTokenWebglContextRestored" : sTokenWebglContextRestored,

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

	const getWebGLContext = function(){
		return m_webGLContext;
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