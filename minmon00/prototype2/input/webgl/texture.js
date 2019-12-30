/*
collect the data to represent a texture. 
https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D

target TEXTURE_2D (hardcoded)
level 0 (hardcoded)

https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
Internal Format	Format			Type
RGB				RGB				UNSIGNED_BYTE,UNSIGNED_SHORT_5_6_5
RGBA			RGBA			UNSIGNED_BYTE,UNSIGNED_SHORT_4_4_4_4,UNSIGNED_SHORT_5_5_5_1
LUMINANCE_ALPHA	LUMINANCE_ALPHA	UNSIGNED_BYTE
LUMINANCE		LUMINANCE		UNSIGNED_BYTE
ALPHA			ALPHA			UNSIGNED_BYTE
R8				RED				UNSIGNED_BYTE
R16F			RED				HALF_FLOAT, FLOAT
R32F			RED				FLOAT
R8UI			RED_INTEGER		UNSIGNED_BYTE
RG8				RG				UNSIGNED_BYTE
RG16F			RG				HALF_FLOAT, FLOAT
RG32F			RG				FLOAT
RG8UI			RG_INTEGER		UNSIGNED_BYTE
RGB8			RGB				UNSIGNED_BYTE
SRGB8			RGB				UNSIGNED_BYTE
RGB565			RGB				UNSIGNED_BYTE, UNSIGNED_SHORT_5_6_5
R11F_G11F_B10F	RGB				UNSIGNED_INT_10F_11F_11F_REV, HALF_FLOAT, FLOAT
RGB9_E5			RGB				HALF_FLOAT, FLOAT
RGB16F			RGB				HALF_FLOAT, FLOAT
RGB32F			RGB				FLOAT
RGB8UI			RGB_INTEGER		UNSIGNED_BYTE
RGBA8			RGBA			UNSIGNED_BYTE
SRGB8_ALPHA8	RGBA			UNSIGNED_BYTE
RGB5_A1			RGBA			UNSIGNED_BYTE, UNSIGNED_SHORT_5_5_5_1
RGB10_A2		RGBA			UNSIGNED_INT_2_10_10_10_REV
RGBA4			RGBA			UNSIGNED_BYTE, UNSIGNED_SHORT_4_4_4_4
RGBA16F			RGBA			HALF_FLOAT, FLOAT
RGBA32F			RGBA			FLOAT
RGBA8UI			RGBA_INTEGER	UNSIGNED_BYTE

TEXTURE_MAG_FILTER	LINEAR (default value), NEAREST.
TEXTURE_MIN_FILTER	LINEAR, NEAREST, NEAREST_MIPMAP_NEAREST, LINEAR_MIPMAP_NEAREST, NEAREST_MIPMAP_LINEAR (default value), LINEAR_MIPMAP_LINEAR.
	since we dont use mipmap by default, make the default TEXTURE_MIN_FILTER LINEAR
TEXTURE_WRAP_S	REPEAT (default value), CLAMP_TO_EDGE, MIRRORED_REPEAT
TEXTURE_WRAP_T	REPEAT (default value), CLAMP_TO_EDGE, MIRRORED_REPEAT

 */

// const disableTexture = function(in_webGLContextWrapper, in_index, in_nullTexture){
// 	const textureEnum = in_webGLContextWrapper.getEnum("TEXTURE0") + in_index;
// 	in_webGLContextWrapper.callMethod("activeTexture", textureEnum);
// 	const targetEnum = in_webGLContextWrapper.getEnum("TEXTURE_2D");
// 	in_webGLContextWrapper.callMethod("bindTexture", targetEnum, in_nullTexture);
// 	return;
// }

export default function(
	in_webGLContextWrapper,
	in_width, 
	in_height,
	in_internalFormatEnumName,
	in_formatEnumName,
	in_typeEnumName,
	in_dataOrUndefined, 
	in_flipOrUndefined, //UNPACK_FLIP_Y_WEBGL default false
	in_magFilterEnumNameOrUndefined,
	in_minFilterEnumNameOrUndefined,
	in_wrapSEnumNameOrUndefined,
	in_wrapTEnumNameOrUndefined,
	in_generateMipMapOrUndefined
	){
	var m_webglTexture = undefined;

	//public methods ==========================
	const result = Object.create({
		"activate" : function(in_index){
			if (undefined !== m_webglTexture){
				const textureEnum = in_webGLContextWrapper.getEnum("TEXTURE0") + in_index;
				in_webGLContextWrapper.callMethod("activeTexture", textureEnum);
				const targetEnum = in_webGLContextWrapper.getEnum("TEXTURE_2D");
				in_webGLContextWrapper.callMethod("bindTexture", targetEnum, m_webglTexture);
			}
			return;
		},
		"getBuffer" : function(){
			return m_webglTexture;
		},
		"getWidth" : function(){
			return in_width;
		},
		"getHeight" : function(){
			return in_height;
		},
		"getTypeEnumName" : function(){
			return in_typeEnumName;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(){
		m_webglTexture = in_webGLContextWrapper.callMethod("createTexture");

		const targetEnum = in_webGLContextWrapper.getEnum("TEXTURE_2D");
		in_webGLContextWrapper.callMethod("bindTexture", targetEnum, m_webglTexture);

		const paramFlipYEnum = in_webGLContextWrapper.getEnum("UNPACK_FLIP_Y_WEBGL"); //default false
		in_webGLContextWrapper.callMethod("pixelStorei", paramFlipYEnum, (true === in_flipOrUndefined));
		
		in_webGLContextWrapper.callMethod(
			"texImage2D",
			targetEnum,		//GLenum target, 
			0,									//GLint level, 
			in_webGLContextWrapper.getEnum(in_internalFormatEnumName),				//GLenum internalformat, 
			in_width,						//GLsizei width, 
			in_height,						//GLsizei height, 
			0,									//GLint border, 
			in_webGLContextWrapper.getEnum(in_formatEnumName),						//GLenum format, 
			in_webGLContextWrapper.getEnum(in_typeEnumName),						//GLenum type, 
			(undefined === in_dataOrUndefined) ? null : in_dataOrUndefined //ArrayBufferView? pixels
			);

		if (true === in_generateMipMapOrUndefined)
		{
			in_webGLContextWrapper.callMethod("generateMipmap", targetEnum);
		}

		var magFilterEnum = in_webGLContextWrapper.getEnum((undefined === in_magFilterEnumNameOrUndefined) ? "LINEAR" : in_magFilterEnumNameOrUndefined );
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_MAG_FILTER"), magFilterEnum);

		//var minFilterEnum = in_webGLContextWrapper.getEnum((undefined === in_minFilterEnumNameOrUndefined) ? "NEAREST_MIPMAP_LINEAR" : in_minFilterEnumNameOrUndefined );
		var minFilterEnum = in_webGLContextWrapper.getEnum((undefined === in_minFilterEnumNameOrUndefined) ? "LINEAR" : in_minFilterEnumNameOrUndefined );
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_MIN_FILTER"), minFilterEnum);

		var wrapSEnum = in_webGLContextWrapper.getEnum((undefined === in_wrapSEnumNameOrUndefined) ? "REPEAT" : in_wrapSEnumNameOrUndefined );
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_WRAP_S"), wrapSEnum);

		var wrapTEnum = in_webGLContextWrapper.getEnum((undefined === in_wrapTEnumNameOrUndefined) ? "REPEAT" : in_wrapTEnumNameOrUndefined );
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_WRAP_T"), wrapTEnum);

		in_webGLContextWrapper.callMethod("bindTexture", targetEnum, null);

		return;
	}

	const lostCallback = function(){
		in_webGLContextWrapper.callMethod("deleteTexture", m_webglTexture);
		m_webglTexture = undefined;
		return;
	}


	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return result;
}
