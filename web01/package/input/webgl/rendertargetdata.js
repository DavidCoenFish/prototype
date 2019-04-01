export default function(
	in_textureWrapper, //ref to texture wrapper
	in_targetEnumName,
	in_attachmentEnumName,
	in_texTargetEnumName//,
	//in_levelOrUndefined //mipmap?
	)
{
	//public methods ==========================
	const that = Object.create({
		"apply" : function(in_webGLContextWrapper){

			const targetEnum = in_webGLContextWrapper.getEnum(in_targetEnumName);
			const attachmentEnum = in_webGLContextWrapper.getEnum(in_attachmentEnumName);
			const texTargetEnum = in_webGLContextWrapper.getEnum(in_texTargetEnumName);
			in_webGLContextWrapper.callMethod(
				"framebufferTexture2D",
				targetEnum, 
				attachmentEnum, 
				texTargetEnum, 
				in_textureWrapper.getWebGLTexture(), 
				0 //in_levelOrUndefined docs says it must be zero
			);
		},
		"getTexture" : function(){
			return in_textureWrapper;
		},
		"setTexture" : function(in_newTextureWrapper){
			in_textureWrapper = in_newTextureWrapper;
			return;
		}
	});

	return that;
}
