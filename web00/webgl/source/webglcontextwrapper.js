/*
wrap the webgl context out of a html5 canvas dom element
manage context lost and restored
manage creation and destruction of resources (which may need context lost and restored)
 */

const getWebGLContext = function(in_html5CanvasElement, in_paramObjectOrUndefined){
	var webGL = undefined;

	if (!window.WebGLRenderingContext) {
		throw(" Webgl not supported");
	} 

	webGL = in_html5CanvasElement.getContext("webgl", in_paramObjectOrUndefined);

	if (undefined == webGL) {
		webGL = in_html5CanvasElement.getContext("experimental-webgl", in_paramObjectOrUndefined);
	}

	if (undefined == webGL) {
		throw(" Unable to get webgl Context");
	}

	return webGL;
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

const factory = function(in_html5CanvasElement, in_paramObjectOrUndefined){
	var webGLContext = getWebGLContext(in_html5CanvasElement, in_paramObjectOrUndefined);
	const result = Object.create({
		"ContextLostCallback" : function(in_event){
		},
		"ContextRestoredCallback" : function(in_event){
		}
	});

	//Object.assign(result, Vector.eventDispatcher);

	in_html5CanvasElement.addEventListener("webglcontextlost", function(in_event){ result.ContextLostCallback(in_event); }, false);
	in_html5CanvasElement.addEventListener("webglcontextrestored", function(in_event){ result.ContextRestoredCallback(in_event); }, false);
	
	return result;
}

module.exports = {
	"makeParamObject" : makeParamObject,
	"factory" : factory
};