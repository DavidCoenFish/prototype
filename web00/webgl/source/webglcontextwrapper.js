/*
wrap the webgl context out of a html5 canvas dom element
manage context lost and restored
manage creation and destruction of resources (which may need context lost and restored)
 */
const Core = require("core");

const getWebGLContext = function(in_html5CanvasElement, in_paramObjectOrUndefined){
	var webGL = undefined;

	if (undefined === in_html5CanvasElement) {
		throw("Canvas element not found");
	} 

	if (!window.WebGLRenderingContext) {
		throw("Webgl not supported");
	} 

	webGLContext = in_html5CanvasElement.getContext("webgl", in_paramObjectOrUndefined);

	if (undefined === webGLContext) {
		webGLContext = in_html5CanvasElement.getContext("experimental-webgl", in_paramObjectOrUndefined);
	}

	if (undefined === webGLContext) {
		throw("Unable to get webgl Context");
	}

	return webGLContext;
}

	
//var _paramObject = {
//	alpha : false,
//	depth : true,
//	antialias : true,
//	//premultipliedAlpha : false,
//	extentions : ["", ""...]
//};
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

const factory = function(in_html5CanvasElement, in_paramObjectOrUndefined){
	var webGLContext = getWebGLContext(in_html5CanvasElement, in_paramObjectOrUndefined);
	const result = Object.create({
		"contextLostCallback" : function(in_event){
			webGLContext = undefined;
			this.triggerEvent(sTokenWebglContextLost, this);
		},
		"contextRestoredCallback" : function(in_event){
			webGLContext = undefined;
			in_event.preventDefault();
			webGLContext = getWebGLContext(in_html5CanvasElement, in_paramObjectOrUndefined);
			this.triggerEvent(sTokenWebglContextRestored, this);
		},
		"getError" : function(){
			if (undefined === webGLContext){
				return;
			}
			var error = webGLContext.getError();
			var message;
			switch (error){
			default:
				message = "WebGLContetWrapper.GetError:unknown:" + error;
				break;
			case webGLContext.NO_ERROR: // 0: //NO_ERROR:
				return;
			case webGLContext.INVALID_ENUM: // 0x0500: //INVALID_ENUM:
				message = "WebGLContetWrapper.GetError:INVALID_ENUM";
				break;
			case webGLContext.INVALID_VALUE: // 0x0501: //INVALID_VALUE:
				message = "WebGLContetWrapper.GetError:INVALID_VALUE";
				break;
			case webGLContext.INVALID_OPERATION: //0x0502: //INVALID_OPERATION:
				message = "WebGLContetWrapper.GetError:INVALID_OPERATION";
				break;
			case webGLContext.OUT_OF_MEMORY: //0x0505: //OUT_OF_MEMORY:
				message = "WebGLContetWrapper.GetError:OUT_OF_MEMORY";
				break;
			case webGLContext.CONTEXT_LOST_WEBGL:// 0x9242: //CONTEXT_LOST_WEBGL:
				webGLContext = undefined;
				console.info("WebGLContetWrapper.GetError:CONTEXT_LOST_WEBGL");
				return;
			}
			webGLContext = undefined;
			console.info(message);
			alert(message);
			return;
		},
		"clear" : function(in_colourOrUndefined, in_depthOrUndefined, in_stencilOrUndefined){
			var clearFlag = 0;

			if ((undefined !== in_colourOrUndefined) &&
				(undefined !== webGLContext)){
				clearFlag |= webGLContext.COLOR_BUFFER_BIT;
				webGLContext.clearColor(
					in_colourOrUndefined.getRed(),
					in_colourOrUndefined.getGreen(),
					in_colourOrUndefined.getBlue(),
					in_colourOrUndefined.getAlpha()
					);
				this.getError();
			}

			if ((undefined !== in_depthOrUndefined) &&
				(undefined !== webGLContext)){
				clearFlag |= webGLContext.DEPTH_BUFFER_BIT;
				webGLContext.clearDepth(in_depthOrUndefined);
				this.getError();
			}

			if ((undefined !== in_stencilOrUndefined) &&
				(undefined !== webGLContext)){
				clearFlag |= webGLContext.STENCIL_BUFFER_BIT;
				webGLContext.clearStencil(in_stencilOrUndefined);
				this.getError();
			}

			if (undefined !== webGLContext){
				webGLContext.clear(clearFlag);
				this.getError();
			}

			return;
		},

		//create/destroy shader
		//create/destroy teture
		//create/destroy/activate material
		//create/destroy/activate render target
		//create/destroy/draw model
	});

	Core.EventDispatcherDecorate(result);

	in_html5CanvasElement.addEventListener("webglcontextlost", function(in_event){ result.contextLostCallback(in_event); }, false);
	in_html5CanvasElement.addEventListener("webglcontextrestored", function(in_event){ result.contextRestoredCallback(in_event); }, false);
	
	return result;
}

module.exports = {
	"makeParamObject" : makeParamObject,
	"factory" : factory
};