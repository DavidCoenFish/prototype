/*
wrap the webgl context out of a html5 canvas dom element
manage context lost and restored
manage creation and destruction of resources (which may need context lost and restored)
 */

const s_default = {
};

const s_defaultParam4 = {
	"colorMask" : [true, true, true, true]
};

export default function(
	in_webGLContextWrapper
	){
	//private members ==========================
	var m_state = {};

	// const setColorMask = function(in_red, in_green, in_blue, in_alpha){
	// 	const falseColorMaskRed = stateValueCmp("colorMaskRed", in_red);
	// 	const falseColorMaskGreen = stateValueCmp("colorMaskGreen", in_green);
	// 	const falseColorMaskBlue = stateValueCmp("colorMaskBlue", in_blue);
	// 	const falseColorMaskAlpha = stateValueCmp("colorMaskAlpha", in_alpha);

	// 	if ((false === falseColorMaskRed) ||
	// 		(false === falseColorMaskGreen) ||
	// 		(false === falseColorMaskBlue) ||
	// 		(false === falseColorMaskAlpha)){
	// 		in_webGLContextWrapper.callMethod("colorMask", in_red, in_green, in_blue, in_alpha);
	// 	}
	// }

	//public methods ==========================
	const that = Object.create({
		/*
		can value be undefined (automatic rest to default) or (don't change state if undefined)

			treat undefined in_value as a none operation (don't change anything)
		*/
		"set" : function(in_key, in_value){
			if (undefined === in_value) {
				return;
			}
			if ((false === (in_key in m_state)) || (in_value !== m_state[in_key])){
				m_state[in_key] = in_value;
				in_webGLContextWrapper.callMethod(in_key, in_value);
			}
		},
		"setParam4" : function(in_key, in_value0, in_value1, in_value2, in_value3){
			var value = undefined;
			if (in_key in m_state)
			{
				value = m_state[in_key];
			}
			else
			{
				var temp = s_default[in_key];
				value = [temp[0], temp[1], temp[2], temp[3]];
			}

			var anythingToSet = false;
			if ((undefined !== in_value0) && (in_value0 != value[0])){
				anythingToSet = true;
				value[0] = in_value0;
			}
			if ((undefined !== in_value1) && (in_value1 != value[1])){
				anythingToSet = true;
				value[1] = in_value1;
			}
			if ((undefined !== in_value2) && (in_value2 != value[2])){
				anythingToSet = true;
				value[2] = in_value2;
			}
			if ((undefined !== in_value3) && (in_value3 != value[3])){
				anythingToSet = true;
				value[3] = in_value3;
			}

			if (false === anythingToSet){
				return;
			}

			in_webGLContextWrapper.callMethod(in_key, value[0], value[1], value[2], value[3]);
		},
		// "getDefault" : function(in_key){
		// },
		// "getDefaultParam4" : function(in_key){
		// },
	});


	//private methods ==========================
	const aquireWebGLResources = function(){
		m_state = {};
		m_lastShaderMapVertexAttribute = {};
		return;
	}

	const releaseWebGLResources = function(){
		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return that;
}

