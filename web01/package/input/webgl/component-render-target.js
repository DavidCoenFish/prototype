import RenderTargetWrapperFactory from "./rendertargetwrapper.js";

export default function(in_webGLState, in_arrayDataFactory, in_width, in_height){
	var m_renderTarget = undefined;
	const release = function(){
		if (undefined !== m_renderTarget){
			m_renderTarget.destroy();
			m_renderTarget = undefined;
		}
		return;
	}

	const makeRenderTarget = function(){
		const renderTargetDataArray = [];
		for (var index = 0; index < in_arrayDataFactory.length; ++index){
			renderTargetDataArray.push(in_arrayDataFactory[index](in_webGLState, in_width, in_height));
		}
		m_renderTarget = RenderTargetWrapperFactory(in_webGLState, in_width, in_height, renderTargetDataArray);
		return;
	}

	makeRenderTarget();

	//public methods ==========================
	const that = Object.create({
		"setWidthHeight" : function(in_newWidth, in_newHeight){
			if ((in_width === in_newWidth) && (in_height === in_newHeight)){
				return false;
			}
			in_width = in_newWidth;
			in_height = in_newHeight;
			release();
			makeRenderTarget();
			return true;
		},
		// "apply" : function(){
		// 	in_webGLState.applyRenderTarget(m_renderTarget);
		// },
		"getRenderTarget" : function(){
			return m_renderTarget;
		},
		"getTexture" : function(in_index){
			return m_renderTarget.getTexture(in_index);
		},
		"destroy" : function(){
			release();
			return;
		}
	})

	return that;
}
