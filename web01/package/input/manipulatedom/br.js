
export const factory = function(in_document, in_elementToAppend){
	const br = in_document.createElement("BR");
	in_elementToAppend.appendChild(br);

	return;
}

export const factoryAppendBody = function(in_document){
	factory(in_document, in_document.body);
	return;
}

