const ComponentEditFloat = require("./component-editfloat.js");

const factory = function(in_document, in_text, in_callbackGetX, in_callbackSetX, in_callbackGetY, in_callbackSetY, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var m_div = in_document.createElement("DIV");
	var m_textElement = in_document.createTextNode(in_text);
	m_div.appendChild(m_textElement);

	var m_inputX = ComponentEditFloat.createInput(in_document, in_callbackGetX, in_callbackSetX, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputX);
	var m_inputY = ComponentEditFloat.createInput(in_document, in_callbackGetY, in_callbackSetY, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputY);
		
	//public methods ==========================
	const result = Object.create({
		"getElement" : function(){
			return m_div;
		}
	});

	return result;
}

const factoryVec2 = function(in_document, in_text, in_vec2, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	return factory(
		in_document, 
		in_text, 
		function(){ return in_vec2.getX(); },
		function(in_value){ in_vec2.setX(in_value); },
		function(){ return in_vec2.getY(); },
		function(in_value){ in_vec2.setY(in_value); },
		in_minOrUndefined, 
		in_maxOrUndefined, 
		in_stepOrUndefined
	);
}

module.exports = {
	"factory" : factory,
	"factoryVec2" : factoryVec2
};
