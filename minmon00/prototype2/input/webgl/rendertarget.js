//void gl.viewport(x, y, width, height);
/*
	const targetEnum = m_webGLContextWrapper.getEnum("FRAMEBUFFER");
	m_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, null);
	m_webGLState.setParam4(viewport, 0, 0, that.getCanvasWidth(), that.getCanvasHeight());

in_renderTargetDataArray
	renderTargetDataRenderbuffer
		renderBuffer
	renderTargetDataTexture
		texture
*/


export default function(
	in_webGLContextWrapper, 
	in_webGLState, 
	in_x,
	in_y,
	in_width,
	in_height,
	in_renderTargetDataArray
	)
{
	var m_frameBufferObject = undefined; //WebGLFramebuffer

	//public methods ==========================
	const that = Object.create({
		"activate" : function(){
			const targetEnum = in_webGLContextWrapper.getEnum("FRAMEBUFFER");
			in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, m_frameBufferObject);
			in_webGLState.set("viewport", [in_x, in_y, in_width, in_height]);
		},
		"getTexture" : function(in_index){
			return in_renderTargetDataArray[in_index].getTexture();
		},
		"getWidth" : function(){
			return in_width;
		},
		"getHeight" : function(){
			return in_height;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
		}
	});

	//private methods ==========================
	const restoredCallback = function(){
		m_frameBufferObject = in_webGLContextWrapper.callMethod("createFramebuffer");
		const targetEnum = in_webGLContextWrapper.getEnum("FRAMEBUFFER");
		in_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, m_frameBufferObject);

		for (var index = 0; index < in_renderTargetDataArray.length; ++index) { 
			in_renderTargetDataArray[index].activate();
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
	const lostCallback = function(){
		in_webGLContextWrapper.callMethod("deleteFramebuffer", m_frameBufferObject);
		m_frameBufferObject = undefined;

		for (var index = 0; index < in_renderTargetDataArray.length; ++index) { 
			in_renderTargetDataArray[index].destroy();
		}

		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(restoredCallback, lostCallback);


	return that;
}