import { factoryDagNodeCalculate } from './../../core/dagnode.js'

const dagCallbackCanvasRenderTargetFactory = function(in_webglApi){
	const result = Object.create({
		"activate" : function(){
			in_webglApi.setRenderTarget();
			in_webglApi.clear(0.0, 0.0, 0.0, 1.0);
		},
		"getTexture" : function(){
			return undefined;
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		return result;
	}
}

export default function(in_webglApi){
	return factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(in_webglApi));
}
