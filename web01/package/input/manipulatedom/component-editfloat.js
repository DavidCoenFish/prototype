//https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging/37623959#37623959
const onRangeChange = function(r,f) {
	var n,c,m;
	r.addEventListener("input",function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c;});
	r.addEventListener("change",function(e){if(!n)f(e);});
	return;
}


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

	onRangeChange(input, function(in_event){
		try{
			var value = parseFloat(input.value);
			in_callbackSet(value);
		} catch (in_error){
			//nop
		}
		return;
	});
	return input;
}

const createRange = function(in_document, in_callbackGet, in_callbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var input = in_document.createElement("INPUT");

	input.setAttribute("type", "range");
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

	onRangeChange(input, function(in_event){
		try{
			var value = parseFloat(input.value);
			in_callbackSet(value);
		} catch (in_error){
			//nop
		}
		return;
	});
	return input;
}


const factory = function(in_document, in_text, in_callbackGet, in_callbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined){
	var m_div = in_document.createElement("DIV");
	var m_textElement = in_document.createTextNode(in_text);
	m_div.appendChild(m_textElement);

	var m_lockRange = false;
	const rangeCallbackSet = function(in_value){
		if (true === m_lockRange){
			return;
		}
		m_lockRange = true;
		m_input.value = in_value;
		m_lockRange = false;
		in_callbackSet(in_value);
	}

	const inputCallbackSet = function(in_value){
		if (true === m_lockRange){
			return;
		}
		m_lockRange = true;
		m_range.value = in_value;
		m_lockRange = false;
		in_callbackSet(in_value);
	}

	var m_range = createRange(in_document, in_callbackGet, rangeCallbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
	m_div.appendChild(m_range);

	var m_input = createInput(in_document, in_callbackGet, inputCallbackSet, in_minOrUndefined, in_maxOrUndefined, in_stepOrUndefined);
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
