const createText = function(in_document, in_text){
	const div = in_document.createElement("DIV");
	const textNode = in_document.createTextNode(in_text);
	div.appendChild(textNode);
	return textNode;
}

const addSimpleText = function(in_document, in_elementToAppend, in_text){
	const div = createText(in_document, in_text);
	in_elementToAppend.appendChild(div);

	return;
}

module.exports = {
	"addSimpleText" : addSimpleText,
	"createText" : createText
}