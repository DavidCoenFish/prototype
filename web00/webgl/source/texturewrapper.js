/*
collect the data to represent a texture. 
https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D

TEXTURE_MAG_FILTER	LINEAR (default value), NEAREST.
TEXTURE_MIN_FILTER	LINEAR, NEAREST, NEAREST_MIPMAP_NEAREST, LINEAR_MIPMAP_NEAREST, NEAREST_MIPMAP_LINEAR (default value), LINEAR_MIPMAP_LINEAR.
TEXTURE_WRAP_S	REPEAT (default value), CLAMP_TO_EDGE, MIRRORED_REPEAT
TEXTURE_WRAP_T	REPEAT (default value), CLAMP_TO_EDGE, MIRRORED_REPEAT

 */

const factory = function(
	in_webGLState, 
	in_width, 
	in_height,
	in_dataOrUndefined, 
	in_flip,
	in_internalFormatEnumName,
	in_formatEnumName,
	in_typeEnumName,
	in_magFilterEnumName,
	in_minFilterEnumName,
	in_wrapSEnumName,
	in_wrapTEnumName,
	){
	var m_webglTexture = undefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(in_webGLContextWrapper, in_index){
			if (undefined !== m_webglTexture){
				const textureEnum = in_webGLContextWrapper.getEnum("TEXTURE0") + in_index;
				in_webGLContextWrapper.callMethod("activeTexture", textureEnum);
				const targetEnum = in_webGLContextWrapper.getEnum("TEXTURE_2D");
				in_webGLContextWrapper.callMethod("bindTexture", targetEnum, m_webglTexture);
			}
			return;
		},
		"getWebGLTexture" : function(){
			return m_webglTexture;
		},
		"getWidth" : function(){
			return in_width;
		},
		"getHeight" : function(){
			return in_height;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(in_webGLContextWrapper){
		m_webglTexture = in_webGLContextWrapper.callMethod("createTexture");

		const targetEnum = in_webGLContextWrapper.getEnum("TEXTURE_2D");
		in_webGLContextWrapper.callMethod("bindTexture", targetEnum, m_webglTexture);

		const paramFlipYEnum = in_webGLContextWrapper.getEnum("UNPACK_FLIP_Y_WEBGL");

		if (true === in_flip) {
			in_webGLContextWrapper.callMethod("pixelStorei", paramFlipYEnum, true);
		}
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
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_MAG_FILTER"), in_webGLContextWrapper.getEnum(in_magFilterEnumName));
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_MIN_FILTER"), in_webGLContextWrapper.getEnum(in_minFilterEnumName));
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_WRAP_S"), in_webGLContextWrapper.getEnum(in_wrapSEnumName));
		in_webGLContextWrapper.callMethod("texParameteri", targetEnum, in_webGLContextWrapper.getEnum("TEXTURE_WRAP_T"), in_webGLContextWrapper.getEnum(in_wrapTEnumName));

		in_webGLContextWrapper.callMethod("bindTexture", targetEnum, null);

		return;
	}

	const lostCallback = function(in_webGLContextWrapper){
		in_webGLContextWrapper.callMethod("deleteTexture", m_webglTexture);
		m_webglTexture = undefined;
		return;
	}


	in_webGLState.addResourceContextCallbacks(restoredCallback, lostCallback);

	return result;
}

const factoryByteRGBA = function(
	in_webGLContextWrapper,
	in_width, 
	in_height,
	in_dataOrUndefined
	){
	return factory(
		in_webGLContextWrapper,
		in_width, 
		in_height,
		in_dataOrUndefined,
		false,
		"RGBA",
		"RGBA",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

const factoryByteRGB = function(
	in_webGLContextWrapper,
	in_width, 
	in_height,
	in_dataOrUndefined
	){
	return factory(
		in_webGLContextWrapper,
		in_width, 
		in_height,
		in_dataOrUndefined,
		false,
		"RGB",
		"RGB",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 
//              0, gl.RGBA, gl.FLOAT, null);

const factoryFloatRGBA = function(
	in_webGLContextWrapper,
	in_width, 
	in_height,
	in_dataOrUndefined
	){
	return factory(
		in_webGLContextWrapper,
		in_width, 
		in_height,
		in_dataOrUndefined,
		false,
		"RGBA",
		"RGBA",
		"FLOAT",
		"NEAREST",
		"NEAREST",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}
const factoryFloatRGB = function(
	in_webGLContextWrapper,
	in_width, 
	in_height,
	in_dataOrUndefined
	){
	return factory(
		in_webGLContextWrapper,
		in_width, 
		in_height,
		in_dataOrUndefined,
		false,
		"RGB",
		"RGB",
		"FLOAT",
		"NEAREST",
		"NEAREST",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

module.exports = {
	"factory" : factory,
	"factoryByteRGBA" : factoryByteRGBA,
	"factoryByteRGB" : factoryByteRGB,
	"factoryFloatRGBA" : factoryFloatRGBA,
	"factoryFloatRGB" : factoryFloatRGB,
};
