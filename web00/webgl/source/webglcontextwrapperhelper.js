/*
helper function for the webgl context wrapper
 */

const clear = function(in_webGLContextWrapper, in_colourOrUndefined, in_depthOrUndefined, in_stencilOrUndefined){
	var clearFlag = 0;

	if (undefined !== in_colourOrUndefined){
		clearFlag |= in_webGLContextWrapper.getEnum("COLOR_BUFFER_BIT");
		in_webGLContextWrapper.callMethod(
			"clearColor", 
			in_colourOrUndefined.getRed(),
			in_colourOrUndefined.getGreen(),
			in_colourOrUndefined.getBlue(),
			in_colourOrUndefined.getAlpha()
			);
	}

	if (undefined !== in_depthOrUndefined){
		clearFlag |= in_webGLContextWrapper.getEnum("DEPTH_BUFFER_BIT");
		in_webGLContextWrapper.callMethod("clearDepth", in_depthOrUndefined);
	}

	if (undefined !== in_stencilOrUndefined){
		clearFlag |= in_webGLContextWrapper.getEnum("STENCIL_BUFFER_BIT");
		in_webGLContextWrapper.callMethod("clearStencil", in_stencilOrUndefined);
	}

	if (0 !== clearFlag){
		in_webGLContextWrapper.callMethod("clear", clearFlag);
	}

	return;
}

const setMaterial = function(in_material){
}

const setRenderTarget = function(in_renderTarget){
}

const drawModel = function(in_model){
}

module.exports = {
	"clear" : clear,
	"setMaterial" : setMaterial,
	"setRenderTarget" : setRenderTarget,
	"drawModel" : drawModel
}
