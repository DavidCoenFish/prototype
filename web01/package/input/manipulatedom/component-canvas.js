export const factory = function(in_document, in_canvasStyleDictionaryOrUndefined){
	var m_element = in_document.createElement("CANVAS");

	if (undefined !== in_canvasStyleDictionaryOrUndefined){
		for (var key in in_canvasStyleDictionaryOrUndefined) {
			if (in_canvasStyleDictionaryOrUndefined.hasOwnProperty(key)) {
				m_element.style[key] = in_canvasStyleDictionaryOrUndefined[key];
			}
		}
	}

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
	});

	return that;
}

export const factoryAppendBody = function(in_document, in_canvasStyleDictionaryOrUndefined){
	var result = factory(in_document, in_canvasStyleDictionaryOrUndefined);
	var element = result.getElement();
	in_document.body.appendChild(element);
	element.width = element.offsetWidth;
	element.height = element.offsetHeight;
	return result;
}
