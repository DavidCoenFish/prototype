/*
test pbr defered renderer
*/
import canvasFactory from './../../dom/canvasfactory.js'
import webGLAPIFactory from './../../webgl/apifactory.js'
import inputFactory from './../../dom/inputfactory.js'

import { factoryDagNodeValue, factoryDagNodeCalculate, linkIndex, link, unlink } from './../../core/dagnode.js'
import { sInt, sFloat } from './../../webgl/shaderuniformtype.js'
import {Base64ToFloat32Array} from './../../core/base64.js';

const s_logDagCalls = false;

/*
prep a defered render texture set
- depth
- normal [x,y,dx,dy?]
- colour mul [r,g,b, emittance factor]
- light reflectance values (mirror image arount 45deg incedence to define hotspt and edge lighting
	[ tight focus amount, tight falloff, soft focus amount, soft falloff]
	or
	[ tight amount 1, tight amount 2, tight amount 3 ]
	[ soft amount 1, soft amount 2, soft amount 3 ]

*/

const dagCallbackCanvasRenderTargetFactory = function(in_webglApi){
	const result = Object.create({
		"activate" : function(){
			in_webglApi.clear(0.0, 0.0, 1.0, 0.0);
		},
		"getTexture" : function(){
			return undefined;
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		return result;
	}
}

const dagCallbackDisplayList = function(in_calculatedValue, in_inputIndexArray, in_inputArray){
	var renderTarget = in_inputIndexArray[0];
	renderTarget.activate();
	in_inputArray.forEach(function(item){
		item.draw();
	});
	return renderTarget;
}


export default function () {
	const html5CanvasWebGLWrapper = canvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	document.body.appendChild(html5CanvasWebGLWrapper.getElement());
	html5CanvasWebGLWrapper.onResize();
	var webGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), [
"OES_texture_float",
"OES_texture_float_linear",
"EXT_shader_texture_lod"
	], false);

	const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(webGLApi));
	const dagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
	linkIndex(dagNodeCanvasRenderTarget, dagNodeDisplayList, 0);



	return;
}	