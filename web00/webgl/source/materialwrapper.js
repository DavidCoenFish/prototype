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
const factory = function(
		in_shaderWrapperOrUndefined, 
		in_textureArrayOrUndefined,
		in_triangleCullEnabledOrUndefined,
		in_triangleCullEnumNameOrUndefined,
		in_blendModeEnabledOrUndefined,
		in_sourceBlendEnumNameOrUndefined,
		in_destinationBlendEnumNameOrUndefined,
		in_depthFuncEnabledOrUndefined,
		in_depthFuncEnumNameOrUndefined
		){
	var m_shaderWrapper = in_shaderWrapperOrUndefined;
	var m_textureArray = (undefined === in_textureArrayOrUndefined) ? [] : in_textureArrayOrUndefined;
	var m_triangleCullEnabled = (undefined === in_triangleCullEnabledOrUndefined) ? false : in_triangleCullEnabledOrUndefined;
	var m_triangleCullEnumName = in_triangleCullEnumNameOrUndefined;
	var m_blendModeEnabled = (undefined === in_blendModeEnabledOrUndefined) ? false : in_blendModeEnabledOrUndefined;
	var m_sourceBlendEnumName = in_sourceBlendEnumNameOrUndefined;
	var m_destinationBlendEnumName = in_destinationBlendEnumNameOrUndefined;
	var m_depthFuncEnabled = (undefined === in_depthFuncEnabledOrUndefined) ? false : in_depthFuncEnabledOrUndefined;
	var m_depthFuncEnumName = in_depthFuncEnumNameOrUndefined;
	var m_frontFaceEnumName = "CW";
	var m_colorMaskRed = true;
	var m_colorMaskGreen = true;
	var m_colorMaskBlue = true; 
	var m_colorMaskAlpha = false;
	var m_depthMask = false;
	var m_stencilMask = false;

	//public methods ==========================
	const result = Object.create({
		// "getShader" : function(){
		// 	return m_shaderWrapper;
		// },
		"setTextureArray" : function(in_textureArray){
			m_textureArray = in_textureArray;
			return;
		},
		"apply" : function(in_webGLContextWrapper, in_webGLState){

			in_webGLState.setMaterialOrUndefined(result);
			in_webGLState.setMapVertexAttributeOrUndefined((undefined !== m_shaderWrapper)? m_shaderWrapper.getMapVertexAttribute():undefined);

			if (undefined !== m_shaderWrapper){
				m_shaderWrapper.apply(in_webGLContextWrapper);
			}

			for (var index = 0; index < m_textureArray.length; ++index){
				var texture = m_textureArray[index];
				in_webGLState.setTextureOrUndefined(in_webGLContextWrapper, index, texture);
				//in_material.m_shader.ApplyUniform(webGL, DSC.Framework.Context.Uniform.Collection.s_sampler + index, index);
			}

			const triangleCullEnum = in_webGLContextWrapper.getEnum(m_triangleCullEnumName);
			in_webGLState.setTriangleCull(in_webGLContextWrapper, m_triangleCullEnabled, triangleCullEnum);

			const frontFaceEnum = in_webGLContextWrapper.getEnum(m_frontFaceEnumName);
			in_webGLState.setFrontFace(in_webGLContextWrapper, frontFaceEnum);

			const sourceBlendEnum = in_webGLContextWrapper.getEnum(m_sourceBlendEnumName);
			const destinationBlendEnum = in_webGLContextWrapper.getEnum(m_destinationBlendEnumName);
			in_webGLState.setBlendMode(in_webGLContextWrapper, m_blendModeEnabled, sourceBlendEnum, destinationBlendEnum);

			const depthFuncEnum = in_webGLContextWrapper.getEnum(m_depthFuncEnumName);
			in_webGLState.setDepthFunc(in_webGLContextWrapper, m_depthFuncEnabled, depthFuncEnum);

			in_webGLState.setColorMask(in_webGLContextWrapper, m_colorMaskRed, m_colorMaskGreen, m_colorMaskBlue, m_colorMaskAlpha);
			in_webGLState.setDepthMask(in_webGLContextWrapper, m_depthMask);
			in_webGLState.setStencilMask(in_webGLContextWrapper, m_stencilMask);
		},
		"setFrontFaceEnumName" : function(in_name){
			m_frontFaceEnumName = in_name;
		},
		"setColorMask" : function(in_redMask, in_greenMask, in_blueMask, in_alphaMask){
			m_colorMaskRed = in_redMask;
			m_colorMaskGreen = in_greenMask;
			m_colorMaskBlue = in_blueMask;
			m_colorMaskAlpha = in_alphaMask;
		},
		"setDepthMask" : function(in_depthMask){
			m_depthMask = in_depthMask;
		},
		"setStencilMask" : function(in_stencilMask){
			m_stencilMask = in_stencilMask;
		},

	});

	return result;
}

const factoryDefault = function(in_shaderWrapperOrUndefined, in_textureArrayOrUndefined){
	return factory(
		in_shaderWrapperOrUndefined,
		in_textureArrayOrUndefined,
		false, //true,
		undefined, //"BACK",
		false,
		undefined, //"ZERO",
		undefined, //"ONE",
		false,
		);
}


module.exports = {
	"factory" : factory,
	"factoryDefault" : factoryDefault
};
