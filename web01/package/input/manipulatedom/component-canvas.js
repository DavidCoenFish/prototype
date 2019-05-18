import { applyStyle } from './style.js';

export const factory = function(in_document, in_canvasStyleDictionaryOrUndefined){
	var m_element = in_document.createElement("CANVAS");

	applyStyle(m_element, in_canvasStyleDictionaryOrUndefined);

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		},
		"onResize" : function(){
			//console.log("onResize:" + m_element.offsetWidth + " " + m_element.offsetHeight);
			m_element.width = m_element.offsetWidth;
			m_element.height = m_element.offsetHeight;
			return;
		}
	});

	return that;
}

export const factoryAppendElement = function(in_document, in_parent, in_canvasStyleDictionaryOrUndefined){
	var result = factory(in_document, in_canvasStyleDictionaryOrUndefined);
	var element = result.getElement();
	in_parent.appendChild(element);
	result.onResize();
	return result;
}
