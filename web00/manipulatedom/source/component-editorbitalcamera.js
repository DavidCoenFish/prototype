const ComponentEditFloat = require("./component-editfloat.js");

const factory = function(
	in_document,
	in_callbackGetDistance, 
	in_callbackSetDistance,
	in_callbackGetYaw, 
	in_callbackSetYaw,
	in_callbackGetPitch, 
	in_callbackSetPitch,
	in_callbackGetRoll, 
	in_callbackSetRoll,
	in_minDistanceOrUndefined, 
	in_maxDistanceOrUndefined, 
	in_stepDistanceOrUndefined
	){

	var m_div = in_document.createElement("DIV");

	var m_distance = ComponentEditFloat.factory(
		in_document, 
		in_callbackGetX, 
		in_callbackSetX, 
		in_minOrUndefined, 
		in_maxOrUndefined, 
		in_stepOrUndefined);
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
