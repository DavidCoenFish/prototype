import applyStyle from './applystyle.js';

export default function(in_document, in_canvasStyleDictionaryOrUndefined){
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
