import { factoryByteRGB, factoryByteRGBA, factoryDepthInt, factoryFloatRGBA, factoryFloatRGB, factoryByteRGBANearest } from './texturewrapper.js';
import RenderTargetDataFactory from "./rendertargetdata.js";
import RenderTargetRenderBufferFactory from "./rendertargetrenderbuffer.js";
import RenderBufferWrapperFactory from "./renderbufferwrapper.js";

export const RenderTargetDataFactoryAttachment0ByteRGB = function(in_webGLState, in_width, in_height){
	return RenderTargetDataFactory(
		factoryByteRGB(in_webGLState, in_width, in_height),
		"FRAMEBUFFER", 
		"COLOR_ATTACHMENT0", 
		"TEXTURE_2D"
	);
}
export const RenderTargetDataFactoryAttachment0ByteRGBA = function(in_webGLState, in_width, in_height){
	return RenderTargetDataFactory(
		factoryByteRGBA(in_webGLState, in_width, in_height),
		"FRAMEBUFFER", 
		"COLOR_ATTACHMENT0", 
		"TEXTURE_2D"
	);
}

export const RenderTargetDataFactoryAttachment0ByteRGBANearest = function(in_webGLState, in_width, in_height){
	return RenderTargetDataFactory(
		factoryByteRGBANearest(in_webGLState, in_width, in_height),
		"FRAMEBUFFER", 
		"COLOR_ATTACHMENT0", 
		"TEXTURE_2D"
	);
}

export const RenderTargetRenderBufferFactoryDepthStencil = function(in_webGLState, in_width, in_height){
	return RenderTargetRenderBufferFactory(
		"FRAMEBUFFER",
		"DEPTH_STENCIL_ATTACHMENT",
		"RENDERBUFFER",
		RenderBufferWrapperFactory(
			in_webGLState,
			"RENDERBUFFER",
			"DEPTH_STENCIL",
			in_width, in_height
		)
	);
}

export const RenderTargetDataFactoryAttachment0FloatRGBA = function(in_webGLState, in_width, in_height){
	return RenderTargetDataFactory(
		factoryFloatRGBA(in_webGLState, in_width, in_height),
		"FRAMEBUFFER", 
		"COLOR_ATTACHMENT0", 
		"TEXTURE_2D"
	);
}

export const RenderTargetDataFactoryAttachment0FloatRGB = function(in_webGLState, in_width, in_height){
	return RenderTargetDataFactory(
		factoryFloatRGB(in_webGLState, in_width, in_height),
		"FRAMEBUFFER", 
		"COLOR_ATTACHMENT0", 
		"TEXTURE_2D"
	);
}

export const RenderTargetDataFactoryDepthInt = function(in_webGLState, in_width, in_height){
	return RenderTargetDataFactory(
		factoryDepthInt(in_webGLState, in_width, in_height),
		"FRAMEBUFFER", 
		"DEPTH_ATTACHMENT", 
		"TEXTURE_2D"
	);
}



