/*
render buffer is to allocate render target texture space that you DON'T want to read as a texture
for example, a depth buffer

var depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

in_targetEnumName
	RENDERBUFFER

https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage
in_internalFormatEnumName
	gl.RGBA4: 4 red bits, 4 green bits, 4 blue bits 4 alpha bits.
	gl.RGB565: 5 red bits, 6 green bits, 5 blue bits.
	gl.RGB5_A1: 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
	gl.DEPTH_COMPONENT16: 16 depth bits.
	gl.STENCIL_INDEX8: 8 stencil bits.
	gl.DEPTH_STENCIL
When using a WebGL 2 context, the following values are available additionally:
	gl.R8
	gl.R8UI
	gl.R8I
	gl.R16UI
	gl.R16I
	gl.R32UI
	gl.R32I
	gl.RG8
	gl.RG8UI
	gl.RG8I
	gl.RG16UI
	gl.RG16I
	gl.RG32UI
	gl.RG32I
	gl.RGB8
	gl.RGBA8
	gl.SRGB8_ALPHA8 (also available as an extension for WebGL 1, see below)
	gl.RGB10_A2
	gl.RGBA8UI
	gl.RGBA8I
	gl.RGB10_A2UI
	gl.RGBA16UI
	gl.RGBA16I
	gl.RGBA32I
	gl.RGBA32UI
	gl.DEPTH_COMPONENT24
	gl.DEPTH_COMPONENT32F
	gl.DEPTH24_STENCIL8
	gl.DEPTH32F_STENCIL8
When using the WEBGL_color_buffer_float extension:
	ext.RGBA32F_EXT: RGBA 32-bit floating-point type.
	ext.RGB32F_EXT: RGB 32-bit floating-point type.
When using the EXT_sRGB extension:
	ext.SRGB8_ALPHA8_EXT: 8-bit sRGB and alpha.
When using a WebGL 2 context and the EXT_color_buffer_float extension:
	gl.R16F
	gl.RG16F
	gl.RGBA16F
	gl.R32F
	gl.RG32F
	gl.RGBA32F
	gl.R11F_G11F_B10F

 */

export default function(
	in_webGLContextWrapper, 
	in_targetEnumName, 
	in_internalFormatEnumName,
	in_width, 
	in_height
	){
	var m_webglRenderBuffer = undefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(){
			if (undefined !== m_webglRenderBuffer){
				const targetEnum = in_webGLContextWrapper.getEnum(in_targetEnumName);
				in_webGLContextWrapper.callMethod("bindRenderbuffer", targetEnum, m_webglRenderBuffer);
			}
			return;
		},
		"getBuffer" : function(){
			return m_webglRenderBuffer;
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
	const restoredCallback = function(){
		m_webglRenderBuffer = in_webGLContextWrapper.callMethod("createRenderbuffer");

		const targetEnum = in_webGLContextWrapper.getEnum(in_targetEnumName);
		in_webGLContextWrapper.callMethod("bindRenderbuffer", targetEnum, m_webglRenderBuffer);

		const internalFormatEnum = in_webGLContextWrapper.getEnum(in_internalFormatEnumName);
		in_webGLContextWrapper.callMethod(
			"renderbufferStorage",
			targetEnum,
			internalFormatEnum,
			in_width,
			in_height
		);

		return;
	}

	const lostCallback = function(){
		in_webGLContextWrapper.callMethod("deleteRenderbuffer", m_webglRenderBuffer);
		m_webglRenderBuffer = undefined;
		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return result;
}


