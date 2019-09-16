export const applyStyle = function(in_element, in_styleDictionaryOrUndefined){

	if ((undefined === in_styleDictionaryOrUndefined) ||
		(undefined === in_element)){
		return;
	}

	for (var key in in_styleDictionaryOrUndefined) {
		if (in_styleDictionaryOrUndefined.hasOwnProperty(key)) {
			in_element.style[key] = in_styleDictionaryOrUndefined[key];
		}
	}

	return;
}

export const applyStyleFullscreenDefault = function(in_element){
	applyStyle(in_element, {
		"width" : "100%",
		"height" : "100%",
		"margin" : "0",
		"padding" : "0"
		});
}
