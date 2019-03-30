
export const factory = function(in_document, in_elementToAppend, in_text, in_callback){
	const button = in_document.createElement("BUTTON");
	button.addEventListener("click", in_callback, false);

	const textNode = in_document.createTextNode(in_text);
	button.appendChild(textNode);

	in_elementToAppend.appendChild(button);

	return;
}

export const factoryAppendBody = function(in_document, in_text, in_callback){
	factory(in_document, in_document.body, in_text, in_callback);
	return;
}

