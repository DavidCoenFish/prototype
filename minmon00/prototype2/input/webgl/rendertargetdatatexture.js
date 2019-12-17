/*
	in_targetEnumName,
FRAMEBUFFER 
webgl2[DRAW_FRAMEBUFFER, READ_FRAMEBUFFER]
	in_attachmentEnumName,
COLOR_ATTACHMENT0 DEPTH_ATTACHMENT STENCIL_ATTACHMENT
webgl2[DEPTH_STENCIL_ATTACHMENT, COLOR_ATTACHMENT1...15]
WEBGL_depth_texture[DEPTH_STENCIL_ATTACHMENT]
	in_texTargetEnumName//,
TEXTURE_2D, TEXTURE_CUBE_MAP_POSITIVE_X, TEXTURE_CUBE_MAP_NEGATIVE_X, Y, Z
 */


export default function(
	in_webGLContextWrapper,
	in_texture, //ref to texture, must implement method "getBuffer", "destroy"
	in_targetEnumName,
	in_attachmentEnumName,
	in_texTargetEnumName//TEXTURE_2D, TEXTURE_CUBE_MAP_POSITIVE_X, TEXTURE_CUBE_MAP_NEGATIVE_X, Y, Z
	//in_levelOrUndefined //mipmap?
	)
{
	//public methods ==========================
	const that = Object.create({
		"apply" : function(){
			const targetEnum = in_webGLContextWrapper.getEnum(in_targetEnumName);
			const attachmentEnum = in_webGLContextWrapper.getEnum(in_attachmentEnumName);
			const texTargetEnum = in_webGLContextWrapper.getEnum(in_texTargetEnumName);
			in_webGLContextWrapper.callMethod(
				"framebufferTexture2D",
				targetEnum, 
				attachmentEnum, 
				texTargetEnum, 
				in_texture.getBuffer(), 
				0 //in_levelOrUndefined docs says it must be zero
			);
		},
		"getTexture" : function(){
			return in_texture;
		},
		"setTexture" : function(in_newTexture){
			in_texture = in_newTexture;
			return;
		},
		"destroy" : function(){
			if (undefined !== in_texture){
				in_texture.destroy();
			}
		}
	});

	return that;
}
