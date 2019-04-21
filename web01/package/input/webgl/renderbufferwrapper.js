/*
var depthBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

in_targetEnumName
	RENDERBUFFER

https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage
in_internalFormatEnumName
	RGBA4: 4 red bits, 4 green bits, 4 blue bits 4 alpha bits.
	RGB565: 5 red bits, 6 green bits, 5 blue bits.
	RGB5_A1: 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
	DEPTH_COMPONENT16: 16 depth bits.
	STENCIL_INDEX8: 8 stencil bits.
	DEPTH_STENCIL
	webgl2 DEPTH_COMPONENT24

 */

export default function(
	in_webGLState, 
	in_targetEnumName, 
	in_internalFormatEnumName,
	in_width, 
	in_height
	){
	var m_webglRenderBuffer = undefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(in_webGLContextWrapper){
			if (undefined !== m_webglRenderBuffer){
				const targetEnum = in_webGLContextWrapper.getEnum(in_targetEnumName);
				in_webGLContextWrapper.callMethod("bindRenderbuffer", targetEnum, m_webglRenderBuffer);
			}
			return;
		},
		"getWebGLRenderBuffer" : function(){
			return m_webglRenderBuffer;
		},
		"getWidth" : function(){
			return in_width;
		},
		"getHeight" : function(){
			return in_height;
		},
		"destroy" : function(){
			in_webGLState.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(in_webGLContextWrapper){
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

	const lostCallback = function(in_webGLContextWrapper){
		in_webGLContextWrapper.callMethod("deleteRenderbuffer", m_webglRenderBuffer);
		m_webglRenderBuffer = undefined;
		return;
	}

	in_webGLState.addResourceContextCallbacks(restoredCallback, lostCallback);

	return result;
}


