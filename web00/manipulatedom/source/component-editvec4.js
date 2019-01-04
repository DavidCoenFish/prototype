const ComponentEditFloat = require("./component-editfloat.js");

const factory = function(in_document, in_text, in_callbackGetX, in_callbackSetX, in_callbackGetY, in_callbackSetY, in_callbackGetZ, in_callbackSetZ, in_callbackGetW, in_callbackSetW, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var m_div = in_document.createElement("DIV");
	var m_textElement = in_document.createTextNode(in_text);
	m_div.appendChild(m_textElement);

	var m_inputX = ComponentEditFloat.createInput(in_document, in_callbackGetX, in_callbackSetX, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputX);
	var m_inputY = ComponentEditFloat.createInput(in_document, in_callbackGetY, in_callbackSetY, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputY);
	var m_inputZ = ComponentEditFloat.createInput(in_document, in_callbackGetZ, in_callbackSetZ, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputZ);
	var m_inputW = ComponentEditFloat.createInput(in_document, in_callbackGetW, in_callbackSetW, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputW);
		
	//public methods ==========================
	const result = Object.create({
		"getElement" : function(){
			return m_div;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory
};
