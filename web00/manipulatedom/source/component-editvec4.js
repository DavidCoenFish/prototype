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

const factoryVec4 = function(in_document, in_text, in_vec4, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	return factory(
		in_document, 
		in_text, 
		function(){ return in_vec4.getX(); },
		function(in_value){ in_vec4.setX(in_value); },
		function(){ return in_vec4.getY(); },
		function(in_value){ in_vec4.setY(in_value); },
		function(){ return in_vec4.getZ(); },
		function(in_value){ in_vec4.setZ(in_value); },
		function(){ return in_vec4.getW(); },
		function(in_value){ in_vec4.setW(in_value); },
		in_minOrUndefined, 
		in_maxOrUndefined, 
		in_stepOrUndefined
	);
}


module.exports = {
	"factory" : factory,
	"factoryVec4" : factoryVec4
};
