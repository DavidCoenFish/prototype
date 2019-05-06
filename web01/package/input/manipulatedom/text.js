export const factory = function(in_document, in_text){
	const textNode = in_document.createTextNode(in_text);
	return textNode;
}

export const appendFactory = function(in_document, in_elementToAppend, in_text){
	const textNode = factory(in_document, in_text);
	in_elementToAppend.appendChild(textNode);

	return;
}

 