import applyStyle from './applystyle.js';

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
export default function(in_document, in_styleOrUndefined, in_callback, in_value){
	const m_element = in_document.createElement("TEXTAREA");
	applyStyle(m_element, in_styleOrUndefined);
	m_element.value = (undefined !== in_value) ? in_value : "";
	if (undefined !== in_callback){
		m_element.addEventListener("input", function(in_event){
			in_callback(in_event.target.value);
		}, false);
	}

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
		//get set value
	});

	return that;
}
