/*
<select name="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>

object.onchange = function(){myScript};
object.addEventListener("change", myScript);
*/

import applyStyle from './applystyle.js';

const addComboBoxItems = function(in_document, in_element, in_arrayText){
	while (in_element.lastChild) {
		in_element.removeChild(in_element.lastChild);
	}
	for (var index = 0; index < in_arrayText.length; ++index){
		var option = in_document.createElement("OPTION");
		option.value = index;

		const textNode = in_document.createTextNode(in_arrayText[index]);
		option.appendChild(textNode);
		in_element.appendChild(option);
	}

	return;
}


export default function(in_document, in_styleOrUndefined, in_callback, in_arrayText, in_selectedOrUndefined){
	const m_element = in_document.createElement("SELECT");
	var m_arrayText = in_arrayText;
	applyStyle(m_element, in_styleOrUndefined);
	if (undefined !== in_callback){
		m_element.addEventListener("change", function(in_event){
			var index = in_event.target.selectedIndex;
			in_callback(index, m_arrayText[index]);
		}, false);
	}

	addComboBoxItems(in_document, m_element, in_arrayText)

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		},
		"setArrayText" : function(in_arrayText){
			m_arrayText = in_arrayText;
			addComboBoxItems(in_document, m_element, in_arrayText);
			return;
		}
	});

	return that;
}
