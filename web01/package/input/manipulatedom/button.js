import { applyStyle } from './style.js';

export const factory = function(in_document, in_text, in_callback, in_styleOrUndefined){
	const button = in_document.createElement("BUTTON");
	applyStyle(button, in_styleOrUndefined);
	if (undefined !== in_callback){
		button.addEventListener("click", in_callback, false);
	}

	const textNode = in_document.createTextNode(in_text);
	button.appendChild(textNode);

	return button;
}

export const factoryAppend = function(in_document, in_elementToAttach, in_text, in_callback, in_styleOrUndefined){
	var button = factory(in_document, in_text, in_callback, in_styleOrUndefined);
	in_elementToAttach.appendChild(button);

	return button;
}

