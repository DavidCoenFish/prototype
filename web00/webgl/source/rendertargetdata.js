const factory = function(
	in_textureWrapper, //ref to texture wrapper
	in_targetEnumName,
	in_attachmentEnumName,
	in_texTargetEnumName//,
	//in_levelOrUndefined //mipmap?
	)
{
	var m_textureWrapper = in_textureWrapper;
	const m_targetEnumName = in_targetEnumName; //"FRAMEBUFFER"
	const m_attachmentEnumName = in_attachmentEnumName; //"COLOR_ATTACHMENT0"
	const m_texTargetEnumName = in_texTargetEnumName; //"TEXTURE_2D"
	const m_level = 0; //docs says it must be zero
	
	//public methods ==========================
	const result = Object.create({
		"setTextureWrapper" : function(localTextureWrapper){
			m_textureWrapper = localTextureWrapper;
			return;
		},
		"apply" : function(in_webGLContextWrapper){

			const targetEnum = in_webGLContextWrapper.getEnum(m_targetEnumName);
			const attachmentEnum = in_webGLContextWrapper.getEnum(m_attachmentEnumName);
			const texTargetEnum = in_webGLContextWrapper.getEnum(m_texTargetEnumName);
			in_webGLContextWrapper.callMethod(
				"framebufferTexture2D",
				targetEnum, 
				attachmentEnum, 
				texTargetEnum, 
				m_textureWrapper.getWebGLTexture(), 
				m_level
			);
		},
	});

	return result;
}

module.exports = {
	"factory" : factory
};
