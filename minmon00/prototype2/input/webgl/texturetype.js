export const sRGB = "RGB";
export const sRGBA = "RGBA";
export const sUNSIGNED_BYTE = "UNSIGNED_BYTE";
export const sHALF_FLOAT = "HALF_FLOAT";
export const sFLOAT = "FLOAT";
export const sLINEAR = "LINEAR";
export const sNEAREST = "NEAREST";
export const sNEAREST_MIPMAP_NEAREST = "NEAREST_MIPMAP_NEAREST";
export const sLINEAR_MIPMAP_NEAREST = "LINEAR_MIPMAP_NEAREST";
export const sNEAREST_MIPMAP_LINEAR = "NEAREST_MIPMAP_LINEAR";
export const sLINEAR_MIPMAP_LINEAR = "LINEAR_MIPMAP_LINEAR";
export const sREPEAT = "REPEAT";
export const sCLAMP_TO_EDGE = "CLAMP_TO_EDGE";
export const sMIRRORED_REPEAT = "MIRRORED_REPEAT";

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
TEXTURE_WRAP_S	REPEAT (default value), CLAMP_TO_EDGE, MIRRORED_REPEAT
TEXTURE_WRAP_T	REPEAT (default value), CLAMP_TO_EDGE, MIRRORED_REPEAT

 */
