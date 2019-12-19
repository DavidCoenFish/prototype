/*
having an undefined value will cause the value to reset to default
if an array value is defined, need to be defined every item internal to the value (no [true, undefined, false, undefined])
 */

const arrayCmp = function(in_lhs, in_rhs){
	if (in_lhs.length !== in_rhs.length){
		return false;
	}
	var arrayLength = in_lhs.length;
	for (var index = 0; index < arrayLength; index++) {
		if (in_lhs[index] !== in_rhs[index]){
			return false;
		}
	}
	return true;
}
const setParam4 = function(in_key, in_default, in_value, in_state, in_webGLContextWrapper){
	var value = (undefined !== in_value) ? [in_value[0], in_value[1], in_value[2], in_value[3]] : undefined;
	if (undefined === value){
		if (false == (in_key in in_state)){
			//value is already default
			return;
		}
		value = in_default;
	}

	if ((false === (in_key in in_state)) || (false === arrayCmp(value, in_state[in_key]))){
		in_webGLContextWrapper.callMethod(in_key, value[0], value[1], value[2], value[3]);
	}
	
	if (false === arrayCmp(value, in_default)){
		in_state[in_key] = value;
	} else {
		delete in_state[in_key];
	}
}
const setParam = function(in_key, in_default, in_value, in_state, in_webGLContextWrapper){
	var value = in_value;
	if (undefined === value){
		if (false == (in_key in in_state)){
			//value is already default
			return;
		}
		value = in_default;
	}

	if ((false === (in_key in in_state)) || (value !== in_state[in_key])){
		in_webGLContextWrapper.callMethod(in_key, value);
	}

	if (value !== in_default){
		in_state[in_key] = value;
	} else {
		delete in_state[in_key];
	}
}
const setEnumByName = function(in_key, in_default, in_value, in_state, in_webGLContextWrapper){
	var value = in_value;
	if (undefined === value){
		if (false == (in_key in in_state)){
			//value is already default
			return;
		}
		value = in_default;
	}

	if ((false === (in_key in m_state)) || (value !== in_state[in_key])){
		var enumValue = in_webGLContextWrapper.getEnum(value);
		in_webGLContextWrapper.callMethod(in_key, enumValue);
	}

	if (value !== in_default){
		in_state[in_key] = value;
	} else {
		delete in_state[in_key];
	}
}
const setEnumByName2 = function(in_key, in_default, in_value, in_state, in_webGLContextWrapper){
	var value = (undefined !== in_value) ? [in_value[0], in_value[1]] : undefined;
	if (undefined === value){
		if (false == (in_key in in_state)){
			//value is already default
			return;
		}
		value = in_default;
	}

	if ((false === (in_key in in_state)) || (false === arrayCmp(value, in_state[in_key]))){
		var enumValue0 = in_webGLContextWrapper.getEnum(value[0]);
		var enumValue1 = in_webGLContextWrapper.getEnum(value[1]);
		in_webGLContextWrapper.callMethod(in_key, enumValue0, enumValue1);
	}

	if (false === arrayCmp(value, in_default)){
		in_state[in_key] = value;
	} else {
		delete in_state[in_key];
	}
}
const setEnableDisable = function(in_key, in_default, in_value, in_state, in_webGLContextWrapper){
	var value = in_value;
	if (undefined === value){
		if (false == (in_key in in_state)){
			//value is already default
			return;
		}
		value = in_default;
	}

	if ((false === (in_key in in_state)) || (value !== in_state[in_key])){
		var enumValue = in_webGLContextWrapper.getEnum(in_key);
		in_state[in_key] = value;
		if (true === value){
			in_webGLContextWrapper.callMethod("enable", enumValue);
		} else {
			in_webGLContextWrapper.callMethod("disable", enumValue);
		}
	}

	if (value !== in_default){
		in_state[in_key] = value;
	} else {
		delete in_state[in_key];
	}
}

const s_metadata = {
	//setParam4
	"colorMask" : function(in_value, in_state, in_webGLContextWrapper){ setParam4("colorMask", [true, true, true, true], in_value, in_state, in_webGLContextWrapper); },
	"clearColor" : function(in_value, in_state, in_webGLContextWrapper){ setParam4("clearColor", [0.0, 0.0, 0.0, 0.0], in_value, in_state, in_webGLContextWrapper); },
	"viewport" : function(in_value, in_state, in_webGLContextWrapper){ setParam4("viewport", [0, 0, 300, 300], in_value, in_state, in_webGLContextWrapper); },

	//setParam
	"stencilMask" : function(in_value, in_state, in_webGLContextWrapper){ setParam("stencilMask", 0b11111111111111111111111111111111, in_value, in_state, in_webGLContextWrapper); },
	"clearStencil" : function(in_value, in_state, in_webGLContextWrapper){ setParam("clearStencil", 0, in_value, in_state, in_webGLContextWrapper); },
	 //enable write depth
	"depthMask" : function(in_value, in_state, in_webGLContextWrapper){ setParam("depthMask", true, in_value, in_state, in_webGLContextWrapper); },
	"clearDepth" : function(in_value, in_state, in_webGLContextWrapper){ setParam("clearDepth", 1, in_value, in_state, in_webGLContextWrapper); },

	//setEnumByName
	"frontFace" : function(in_value, in_state, in_webGLContextWrapper){ setEnumByName("frontFace", "CCW", in_value, in_state, in_webGLContextWrapper); },
	 //"CW"
	"cullFace" : function(in_value, in_state, in_webGLContextWrapper){ setEnumByName("cullFace", "BACK", in_value, in_state, in_webGLContextWrapper); },
	 //FRONT BACK FRONT_AND_BACK
	"depthFunc" : function(in_value, in_state, in_webGLContextWrapper){ setEnumByName("depthFunc", "LESS", in_value, in_state, in_webGLContextWrapper); },
	 //NEVER, LESS, EQUAL, LEQUAL, GREATER, NOTEQUAL, GEQUAL, ALWAYS
	"blendEquation" : function(in_value, in_state, in_webGLContextWrapper){ setEnumByName("blendEquation", "FUNC_ADD", in_value, in_state, in_webGLContextWrapper); },
	 //FUNC_SUBTRACT, FUNC_REVERSE_SUBTRACT, MIN, MAX 

	//setEnumByName2
	"blendFunc" : function(in_value, in_state, in_webGLContextWrapper){ setEnumByName2("blendFunc", ["ONE", "ZERO"], in_value, in_state, in_webGLContextWrapper); },
	 //SRC_COLOR, ONE_MINUS_SRC_COLOR, DST_COLOR, ONE_MINUS_DST_COLOR, SRC_ALPHA, ONE_MINUS_SRC_ALPHA, DST_ALPHA, ONE_MINUS_DST_ALPHA, CONSTANT_COLOR, ONE_MINUS_CONSTANT_COLOR, CONSTANT_ALPHA, ONE_MINUS_CONSTANT_ALPHA, SRC_ALPHA_SATURATE
	
	//setEnableDisable
	//By default, all capabilities except gl.DITHER are disabled.
	"BLEND" : function(in_value, in_state, in_webGLContextWrapper){ setEnableDisable("BLEND", false, in_value, in_state, in_webGLContextWrapper); },
	"CULL_FACE" : function(in_value, in_state, in_webGLContextWrapper){ setEnableDisable("CULL_FACE", false, in_value, in_state, in_webGLContextWrapper); },
	"DEPTH_TEST" : function(in_value, in_state, in_webGLContextWrapper){ setEnableDisable("DEPTH_TEST", false, in_value, in_state, in_webGLContextWrapper); },
	"SCISSOR_TEST" : function(in_value, in_state, in_webGLContextWrapper){ setEnableDisable("SCISSOR_TEST", false, in_value, in_state, in_webGLContextWrapper); },
	"STENCIL_TEST" : function(in_value, in_state, in_webGLContextWrapper){ setEnableDisable("STENCIL_TEST", false, in_value, in_state, in_webGLContextWrapper); },
};

export default function(
	in_webGLContextWrapper
	){
	//private members ==========================
	var m_state = {};

	//public methods ==========================
	const that = Object.create({
		"set" : function(in_key, in_value){
			if (in_key in s_metadata){
				s_methodMap[in_key](in_value, m_state, in_webGLContextWrapper);
			}
			return;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);
		},
	});

	//private methods ==========================
	const aquireWebGLResources = function(){
		m_state = {};
		return;
	}

	const releaseWebGLResources = function(){
		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return that;
}

