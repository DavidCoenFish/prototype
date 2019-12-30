import applyStyle from './applystyle.js';

export default function(in_document, in_elementType, in_styleDictionaryOrUndefined){
	var m_element = in_document.createElement(in_elementType);

	applyStyle(m_element, in_styleDictionaryOrUndefined);

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
	});

	return that;
}
