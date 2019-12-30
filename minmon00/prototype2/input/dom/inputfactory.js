import applyStyle from './applystyle.js';

/*
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
<input id="number" type="number" value="42">
in_type
	range, number, text, ...
*/
export default function(in_document, in_styleOrUndefined, in_callback, in_type, in_value){
	const m_element = in_document.createElement("INPUT");
	applyStyle(m_element, in_styleOrUndefined);
	if (undefined !== in_callback){
		m_element.addEventListener("change", function(in_event){
			var value = 0;
			try{
				value = parseInt(in_event.target.value, 10); 
			} catch(in_error) {
				if (DEVELOPMENT) { console.log("assert input number change:", in_error); }
				value = 0;
			}
			in_callback(value);
		}, false);
	}
	m_element.type = in_type;
	m_element.value = in_value;

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
		//set value
		//get value? we have a onchenge callback...
	});

	return that;
}
