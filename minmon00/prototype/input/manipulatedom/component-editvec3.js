import {createInput} from "./component-editfloat.js";

const factory = function(in_document, in_text, in_callbackGetX, in_callbackSetX, in_callbackGetY, in_callbackSetY, in_callbackGetZ, in_callbackSetZ, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var m_div = in_document.createElement("DIV");
	var m_textElement = in_document.createTextNode(in_text);
	m_div.appendChild(m_textElement);

	var m_inputX = createInput(in_document, in_callbackGetX, in_callbackSetX, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputX);
	var m_inputY = createInput(in_document, in_callbackGetY, in_callbackSetY, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputY);
	var m_inputZ = createInput(in_document, in_callbackGetZ, in_callbackSetZ, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_inputZ);
		
	//public methods ==========================
	const result = Object.create({
		"getElement" : function(){
			return m_div;
		}
	});

	return result;
}

export default  function(in_document, in_text, in_vec3, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	return factory(
		in_document, 
		in_text, 
		function(){ return in_vec3.getX(); },
		function(in_value){ in_vec3.setX(in_value); },
		function(){ return in_vec3.getY(); },
		function(in_value){ in_vec3.setY(in_value); },
		function(){ return in_vec3.getZ(); },
		function(in_value){ in_vec3.setZ(in_value); },
		in_minOrUndefined, 
		in_maxOrUndefined, 
		in_stepOrUndefined
	);
}
