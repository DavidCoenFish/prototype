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
	in_webGLContextWrapper, 
	in_renderTargetDataArray,
	//in_width,
	//in_height,
	){
	//const m_width = in_width;
	//const m_height = in_height;
	const m_renderTargetDataArray = in_renderTargetDataArray;

	var m_frameBufferObject = undefined; //WebGLFramebuffer

	//public methods ==========================
	const result = Object.create({
		"apply" : function(in_webGLContextWrapper){
			const targetEnum = in_webGLContextWrapper.getEnum("FRAMEBUFFER");
			in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, m_frameBufferObject);
			return;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		},
	});

	//private methods ==========================
	const restoredCallback = function(in_webGLContextWrapper){
		//const vertexShaderEnum = in_webGLContextWrapper.getEnum("VERTEX_SHADER");
		//in_webGLContextWrapper.callMethod("deleteShader", m_vertexWebGLShader);

		m_frameBufferObject = in_webGLContextWrapper.callMethod("createFramebuffer");
		const targetEnum = in_webGLContextWrapper.getEnum("FRAMEBUFFER");
		in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, m_frameBufferObject);

		for (var index = 0; index < m_renderTargetDataArray.length; ++index) { 
			m_renderTargetDataArray[index].apply(in_webGLContextWrapper);
		}

		const status = in_webGLContextWrapper.callMethod("checkFramebufferStatus", targetEnum);
		if (status !== in_webGLContextWrapper.getEnum("FRAMEBUFFER_COMPLETE")){
			alert("Could not create FBO");
		}

		in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, null);

		return;
	}

	// if we still have a webgl context, mark the resources for delete, else clear the resource references
	const lostCallback = function(in_webGLContextWrapper){
		in_webGLContextWrapper.callMethod("deleteFramebuffer", m_frameBufferObject);
		m_frameBufferObject = undefined;
		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);

	return result;
}


module.exports = {
	"factory" : factory
};
