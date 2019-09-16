/*

https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/framebufferRenderbuffer
gl.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer)
	in_targetEnumName,
FRAMEBUFFER
	in_attachmentEnumName,
COLOR_ATTACHMENT0
DEPTH_ATTACHMENT
DEPTH_STENCIL_ATTACHMENT
STENCIL_ATTACHMENT
	in_renderBufferTargetEnumName,
RENDERBUFFER

 */


export default function(
	in_targetEnumName,
	in_attachmentEnumName,
	in_renderBufferTargetEnumName,
	in_renderBufferWrapper
	)
{
	//public methods ==========================
	const that = Object.create({
		"apply" : function(in_webGLContextWrapper){
			const targetEnum = in_webGLContextWrapper.getEnum(in_targetEnumName);
			const attachmentEnum = in_webGLContextWrapper.getEnum(in_attachmentEnumName);
			const renderBufferTargetEnum = in_webGLContextWrapper.getEnum(in_renderBufferTargetEnumName);

			in_webGLContextWrapper.callMethod(
				"framebufferRenderbuffer",
				targetEnum, 
				attachmentEnum, 
				renderBufferTargetEnum, 
				in_renderBufferWrapper.getWebGLRenderBuffer()
			);
		},
		"getRenderBuffer" : function(){
			return in_renderBufferWrapper;
		},
		"setRenderBuffer" : function(in_newRenderBufferWrapper){
			in_renderBufferWrapper = in_newRenderBufferWrapper;
			return;
		},
		"destroy" : function(){
			if (undefined !== in_renderBufferWrapper){
				in_renderBufferWrapper.destroy();
			}
		}
	});

	return that;
}
