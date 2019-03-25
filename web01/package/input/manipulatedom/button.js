
const addSimpleButton = function(in_document, in_elementToAppend, in_text, in_callback){
	const button = in_document.createElement("BUTTON");
	button.addEventListener("click", in_callback, false);

	const textNode = in_document.createTextNode(in_text);
	button.appendChild(textNode);

	//document.body.insertBefore(button, document.body.firstChild);
	in_elementToAppend.appendChild(button);

	return;
}

module.exports = {
	"addSimpleButton" : addSimpleButton
}