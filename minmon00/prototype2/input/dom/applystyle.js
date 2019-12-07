export default function(in_element, in_styleDictionaryOrUndefined){

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
