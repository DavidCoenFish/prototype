export default function(in_currentTaskFunction, in_canvasElement, in_webGLState, in_timeDelta){

	var clickHappened = false;
	const clickHandler = function(){
		console.log("on click");
		clickHappened = true;
		in_canvasElement.removeEventListener('click', clickHandler, false);
	};
	in_canvasElement.addEventListener('click', clickHandler, false); 

	return function(in_currentTaskFunction, in_canvasElement, in_webGLState, in_timeDelta){
		//console.log(in_timeDelta);
		if (true === clickHappened){
			return undefined;
		}
		return in_currentTaskFunction;
	}
}
 