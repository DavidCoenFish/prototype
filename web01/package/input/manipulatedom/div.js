import { applyStyle } from './style.js';

export const factory = function(in_document, in_styleOrUndefined){
	const div = in_document.createElement("DIV");
	applyStyle(div, in_styleOrUndefined);

	return div;
}

export const factoryAppend = function(in_document, in_elementToAppend, in_styleOrUndefined){
	var div = factory(in_document, in_styleOrUndefined);
	in_elementToAppend.appendChild(div);
	return div;
}

