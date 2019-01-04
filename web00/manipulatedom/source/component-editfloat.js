const createInput = function(in_document, in_callbackGet, in_callbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var input = in_document.createElement("INPUT");

	input.setAttribute("type", "number");
	if (undefined !== in_minOrUndefined){
		input.min = in_minOrUndefined;
	}
	if (undefined !== in_maxOrUndefined){
		input.max = in_maxOrUndefined;
	}
	if (undefined !== in_stepOrUndefined){
		input.step = in_stepOrUndefined;
	}
	input.value = in_callbackGet();
	input.onchange = function(in_event){
		try{
			var value = parseFloat(input.value);
			in_callbackSet(value);
		} catch (in_error){
			//nop
		}
		return;
	}
	return input;
}


const factory = function(in_document, in_text, in_callbackGet, in_callbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var m_div = in_document.createElement("DIV");
	var m_textElement = in_document.createTextNode(in_text);
	m_div.appendChild(m_textElement);

	var m_input = createInput(in_document, in_callbackGet, in_callbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_input);
	
	//public methods ==========================
	const result = Object.create({
		"getElement" : function(){
			return m_div;
		}
	});

	return result;
}


module.exports = {
	"createInput" : createInput,
	"factory" : factory
};
