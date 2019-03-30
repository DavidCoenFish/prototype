//const Core = require("core");
/*
		blend modes
gl.ZERO	0,0,0,0	Multiplies all colors by 0.
gl.ONE	1,1,1,1	Multiplies all colors by 1.
gl.SRC_COLOR	RS, GS, BS, AS	Multiplies all colors by the source colors.
gl.ONE_MINUS_SRC_COLOR	1-RS, 1-GS, 1-BS, 1-AS	Multiplies all colors by 1 minus each source color.
gl.DST_COLOR	RD, GD, BD, AD	Multiplies all colors by the destination color.
gl.ONE_MINUS_DST_COLOR	1-RD, 1-GD, 1-BD, 1-AD	Multiplies all colors by 1 minus each destination color.
gl.SRC_ALPHA	AS, AS, AS, AS	Multiplies all colors by the source alpha value.
gl.ONE_MINUS_SRC_ALPHA	1-AS, 1-AS, 1-AS, 1-AS	Multiplies all colors by 1 minus the source alpha value.
gl.DST_ALPHA	AD, AD, AD, AD	Multiplies all colors by the destination alpha value.
gl.ONE_MINUS_DST_ALPHA	1-AD, 1-AD, 1-AD, 1-AD	Multiplies all colors by 1 minus the destination alpha value.
gl.CONSTANT_COLOR	RC, GC, BC, AC	Multiplies all colors by a constant color.
gl.ONE_MINUS_CONSTANT_COLOR	1-RC, 1-GC, 1-BC, 1-AC	Multiplies all colors by 1 minus a constant color.
gl.CONSTANT_ALPHA	AC, AC, AC, AC	Multiplies all colors by a constant alpha value.
gl.ONE_MINUS_CONSTANT_ALPHA	1-AC, 1-AC, 1-AC, 1-AC	Multiplies all colors by 1 minus a constant alpha value.
gl.SRC_ALPHA_SATURATE

		in_depthFuncEnumNameOrUndefined
NEVER (never pass)
LESS (pass if the incoming value is less than the depth buffer value)
EQUAL (pass if the incoming value equals the the depth buffer value)
LEQUAL (pass if the incoming value is less than or equal to the depth buffer value)
GREATER (pass if the incoming value is greater than the depth buffer value)
NOTEQUAL (pass if the incoming value is not equal to the depth buffer value)
GEQUAL (pass if the incoming value is greater than or equal to the depth buffer value)
ALWAYS (always pass)

 */
export default function(
		in_textureArrayOrUndefined,
		in_triangleCullEnabledOrUndefined,
		in_triangleCullEnumNameOrUndefined, //"FRONT", "BACK", "FRONT_AND_BACK"
		in_blendModeEnabledOrUndefined,
		in_sourceBlendEnumNameOrUndefined,
		in_destinationBlendEnumNameOrUndefined,
		in_depthFuncEnabledOrUndefined,
		in_depthFuncEnumNameOrUndefined, 
		in_frontFaceEnumNameOrUndefined, //"CW", "CCW"
		in_colorMaskRedOrUndefined, //true
		in_colorMaskGreenOrUndefined, //true
		in_colorMaskBlueOrUndefined, //true
		in_colorMaskAlphaOrUndefined, //false
		in_depthMaskOrUndefined, //false
		in_stencilMaskOrUndefined //false
		){

	//public methods ==========================
	const result = Object.create({
		"getTextureArray" : function(){
			if (undefined === in_textureArrayOrUndefined){
				return [];
			}
		 	return in_textureArrayOrUndefined;
		},
		"setTextureArray" : function(in_textureArray){
			in_textureArrayOrUndefined = in_textureArray;
			return;
		},
		"getTriangleCullEnabled" : function(){
			if (undefined === in_triangleCullEnabledOrUndefined){
				return false;
			}
			return in_triangleCullEnabledOrUndefined;
		},
		//FRONT, BACK, FRONT_AND_BACK
		"getTriangleCullEnumName" : function(){
			if (undefined === in_triangleCullEnumNameOrUndefined){
				return "BACK";
			}
			return in_triangleCullEnumNameOrUndefined;
		},
		"getBlendModeEnabled" : function(){
			if (undefined === in_blendModeEnabledOrUndefined){
				return false;
			}
			return in_blendModeEnabledOrUndefined;
		},
		"getSourceBlendEnumName" : function(){
			if (undefined === in_sourceBlendEnumNameOrUndefined){
				return "ONE";
			}
			return in_sourceBlendEnumNameOrUndefined;
		},
		"getDestinationBlendEnumName" : function(){
			if (undefined === in_destinationBlendEnumNameOrUndefined){
				return "ZERO";
			}
			return in_destinationBlendEnumNameOrUndefined;
		},
		"getDepthFuncEnabled" : function(){
			if (undefined === in_depthFuncEnabledOrUndefined){
				return false;
			}
			return in_depthFuncEnabledOrUndefined;
		},
		"getDepthFuncEnumName" : function(){
			if (undefined === in_depthFuncEnumNameOrUndefined){
				return "LEQUAL";
			}
			return in_depthFuncEnumNameOrUndefined;
		},
		"getFrontFaceEnumName" : function(){
			if (undefined === in_frontFaceEnumNameOrUndefined){
				return "CW";
			}
			return in_frontFaceEnumNameOrUndefined;
		},
		"getColorMaskRed" : function(){
			if (undefined === in_colorMaskRedOrUndefined){
				return true;
			}
			return in_colorMaskRedOrUndefined;
		},
		"setColorMaskRed" : function(in_value){
			in_colorMaskRedOrUndefined = in_value;
			return;
		},
		"getColorMaskGreen" : function(){
			if (undefined === in_colorMaskGreenOrUndefined){
				return true;
			}
			return in_colorMaskGreenOrUndefined;
		},
		"setColorMaskGreen" : function(in_value){
			in_colorMaskGreenOrUndefined = in_value;
			return;
		},
		"getColorMaskBlue" : function(){
			if (undefined === in_colorMaskBlueOrUndefined){
				return true;
			}
			return in_colorMaskBlueOrUndefined;
		},
		"setColorMaskBlue" : function(in_value){
			in_colorMaskBlueOrUndefined = in_value;
			return;
		},
		"getColorMaskAlpha" : function(){
			if (undefined === in_colorMaskAlphaOrUndefined){
				return false;
			}
			return in_colorMaskAlphaOrUndefined;
		},
		"setColorMaskAlpha" : function(in_value){
			in_colorMaskAlphaOrUndefined = in_value;
			return;
		},
		"getDepthMask" : function(){
			if (undefined === in_depthMaskOrUndefined){
				return false;
			}
			return in_depthMaskOrUndefined;
		},
		"getStencilMask" : function(){
			if (undefined === in_stencilMaskOrUndefined){
				return false;
			}
			return in_stencilMaskOrUndefined;
		},
	});

	return result;
}

