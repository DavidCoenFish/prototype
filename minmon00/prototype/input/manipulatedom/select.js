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

import { applyStyle } from './style.js';

export const factory = function(in_document, in_arrayText, in_callback, in_styleOrUndefined){
	const select = in_document.createElement("SELECT");
	applyStyle(select, in_styleOrUndefined);
	if (undefined !== in_callback){
		select.addEventListener("change", function(in_event){
			var index = in_event.target.selectedIndex;
			in_callback(index, in_arrayText[index]);
		}, false);
	}

	for (var index = 0; index < in_arrayText.length; ++index){
		var option = in_document.createElement("OPTION");
		option.value = index;

		const textNode = in_document.createTextNode(in_arrayText[index]);
		option.appendChild(textNode);
		select.appendChild(option);
	}

	return select;
}

export const factoryAppend = function(in_document, in_elementToAttach, in_arrayText, in_callback, in_styleOrUndefined){
	var select = factory(in_document, in_arrayText, in_callback, in_styleOrUndefined);
	in_elementToAttach.appendChild(select);

	return select;
}

