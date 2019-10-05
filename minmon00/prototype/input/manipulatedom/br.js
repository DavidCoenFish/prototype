
export const factoryAppendElement = function(in_document, in_elementToAppend){
	const br = in_document.createElement("BR");
	in_elementToAppend.appendChild(br);

	return;
}
