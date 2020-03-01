/*
this is an unsorded display list inside a dag node
it is told a render target, and given an array of objects to call draw on
it returns

in_inputIndexArray:
	0: object that implements "activate","getTexture"
		ie. rendertargetcanvas.js (rendertargettexturefloat.js, rendertargettexturecolordepth.js

in_inputArray:
	each item will be visited, and a "draw" method invoked

returns:
	object implementing "getTexture"
*/
import { factoryDagNodeCalculate } from './../../core/dagnode.js'


const dagCallbackDisplayList = function(in_calculatedValue, in_inputIndexArray, in_inputArray){
	var renderTarget = in_inputIndexArray[0];
	renderTarget.activate();
	in_inputArray.forEach(function(item){
		item.draw();
	});
	return renderTarget;
}

export default function(){
	return factoryDagNodeCalculate(dagCallbackDisplayList);
}
