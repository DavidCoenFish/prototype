import { applyStyle } from './style.js';

export const factory = function(in_document, in_elementToAppend, in_styleOrUndefined){
	const div = in_document.createElement("DIV");
	applyStyle(div, in_styleOrUndefined);
	in_elementToAppend.appendChild(div);

	return div;
}

export const factoryAppendBody = function(in_document, in_styleOrUndefined){
	return factory(in_document, in_document.body, in_styleOrUndefined);
}

