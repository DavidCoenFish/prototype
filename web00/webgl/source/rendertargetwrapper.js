/**
	this.m_initialRenderTargetColour = in_framework.m_asset.NewTexture("RGBAByte", in_framework.m_context, textureMag);

	this.m_initialRenderTarget = in_framework.m_asset.NewRenderTarget(
		"Default", 
		in_framework.m_context, 
		{
			m_width : Task.QuadDefered00.s_offscreenWidth,
			m_height : Task.QuadDefered00.s_offscreenHeight			
		},
		{
			"colour0" : DSC.Framework.Asset.RenderTarget.Data.FactoryRaw(this.m_initialRenderTargetColour)
		}
	);

 */

const factory = function(
	in_webGLState, 
	in_width,
	in_height,
	in_renderTargetDataArray,
	){
	var m_frameBufferObject = undefined; //WebGLFramebuffer

	//public methods ==========================
	const that = Object.create({
		"getFrameBufferObject" : function(){
			return m_frameBufferObject;
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
		//const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		//in_webGLContextWrapper.callMethod("deleteShader", m_vertexWebGLShader);

		m_frameBufferObject = in_webGLContextWrapper.callMethod("createFramebuffer");
		const targetEnum = in_webGLContextWrapper.getEnum("FRAMEBUFFER");
		in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, m_frameBufferObject);

		for (var index = 0; index < in_renderTargetDataArray.length; ++index) { 
			in_renderTargetDataArray[index].apply(in_webGLContextWrapper);
		}

		//glCheckFramebufferStatusEXT(GL_FRAMEBUFFER_EXT);
		const status = in_webGLContextWrapper.callMethod("checkFramebufferStatus", targetEnum);
		if (status !== in_webGLContextWrapper.getEnum("FRAMEBUFFER_COMPLETE")){
			console.log("Could not create FBO:" + status);
			//alert("Could not create FBO");
			//36054 //0x8CD6
		}

		in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, null);

		const isFrameBuffer = in_webGLContextWrapper.callMethod("isFramebuffer", m_frameBufferObject);
		if (true !== isFrameBuffer){
			console.log("isFrameBuffer:" + isFrameBuffer);
		}


		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const lostCallback = function(in_webGLContextWrapper){
		in_webGLContextWrapper.callMethod("deleteFramebuffer", m_frameBufferObject);
		m_frameBufferObject = undefined;
		return;
	}

	in_webGLState.addResourceContextCallbacks(restoredCallback, lostCallback);

	return that;
}


module.exports = {
	"factory" : factory
};
