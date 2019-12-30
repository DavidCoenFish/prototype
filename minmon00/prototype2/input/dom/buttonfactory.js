import applyStyle from './applystyle.js';

export default function(in_document, in_styleOrUndefined, in_callback, in_text){
	const m_element = in_document.createElement("BUTTON");
	applyStyle(m_element, in_styleOrUndefined);
	if (undefined !== in_callback){
		m_element.addEventListener("click", in_callback, false);
	}

	const textNode = in_document.createTextNode(in_text);
	m_element.appendChild(textNode);

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
	});

	return that;
}
