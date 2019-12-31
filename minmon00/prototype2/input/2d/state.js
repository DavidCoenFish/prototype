
const s_stateKeysDrawRect = [
	"fillStyle",
	"globalAlpha",
	"globalCompositeOperation",
];

//activateMeasureText
const s_stateKeysMeasureText = [
	"font"
];

const s_stateKeysDrawText = [
	"fillStyle",
	"globalAlpha",
	"globalCompositeOperation",
	"font"
];

const setContextValue = function(in_key, in_default, in_valueOrUndefined, in_state, in_context){
	var value = in_valueOrUndefined;
	if (undefined === value){
		if (false == (in_key in in_state)){
			//value is already default
			return;
		}
		value = in_default;
	}

	if ((false === (in_key in in_state)) || (value !== in_state[in_key])){
		in_context[in_key] = value;
	}

	if (value !== in_default){
		in_state[in_key] = value;
	} else {
		delete in_state[in_key];
	}

	return;
}

const s_metadata = {
	"fillStyle" : function(in_valueOrUndefined, in_state, in_context){ setContextValue("fillStyle", "#000", in_valueOrUndefined, in_state, in_context); },
	"globalAlpha" : function(in_valueOrUndefined, in_state, in_context){ setContextValue("globalAlpha", 1.0, in_valueOrUndefined, in_state, in_context); },
	"globalCompositeOperation" : function(in_valueOrUndefined, in_state, in_context){ setContextValue("globalCompositeOperation", "source-over", in_valueOrUndefined, in_state, in_context); },
	"font" : function(in_valueOrUndefined, in_state, in_context){ setContextValue("font", "10px sans-serif", in_valueOrUndefined, in_state, in_context); },
};
export default function(
	in_contextWrapper
	){
	//private members ==========================
	var m_state = {};
	var m_context = in_contextWrapper.getContext();

	//public methods ==========================
	const that = Object.create({
		"set" : function(in_key, in_value){
			if (in_key in s_metadata){
				s_metadata[in_key](in_value, m_state, m_context);
			}
			return;
		},
		"activateDrawRect" : function(in_stateOrUndefined){
			var arrayLength = s_stateKeysDrawRect.length;
			for (var index = 0; index < arrayLength; index++) {
				var key = s_stateKeysDrawRect[index];
				var value = (undefined !== in_stateOrUndefined) ? in_stateOrUndefined[key] : undefined;
				that.set(key, value);
			}
		},
		"activateMeasureText" : function(in_stateOrUndefined){
			var arrayLength = s_stateKeysMeasureText.length;
			for (var index = 0; index < arrayLength; index++) {
				var key = s_stateKeysMeasureText[index];
				var value = (undefined !== in_stateOrUndefined) ? in_stateOrUndefined[key] : undefined;
				that.set(key, value);
			}
		},
		"activateDrawText" : function(in_stateOrUndefined){
			var arrayLength = s_stateKeysDrawText.length;
			for (var index = 0; index < arrayLength; index++) {
				var key = s_stateKeysDrawText[index];
				var value = (undefined !== in_stateOrUndefined) ? in_stateOrUndefined[key] : undefined;
				that.set(key, value);
			}
		},
	});

	return that;
}
