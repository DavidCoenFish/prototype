import canvasFactory from './../dom/canvasfactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'

import { factoryDagNodeCalculate, linkIndex, link, unlink } from './../core/dagnode.js'
import {sRGBA, sUNSIGNED_BYTE} from './../webgl/texturetype'
import { sInt } from './../webgl/shaderuniformtype.js'

const s_logDagCalls = false;

export default function () {
	const html5CanvasWebGLWrapper = canvasFactory(document, {
		"width" : "256px",
		"height" : "256px",
		"backgroundColor" : "#000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	document.body.appendChild(html5CanvasWebGLWrapper.getElement());
	html5CanvasWebGLWrapper.onResize();
	var webGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), undefined, false);

	//gWebGLApi.clear(1.0, 1.0, 1.0, 1.0);

	// gDagNodeGlyphTexture = factoryDagNodeCalculate(dagCallbackGlyphTextureFactory(gWebGLApi));
	// const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(gWebGLApi));
	// gDagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
	// linkIndex(dagNodeCanvasRenderTarget, gDagNodeDisplayList, 0);
	// gDagNodeDisplayList.getValue();

	return;
}	