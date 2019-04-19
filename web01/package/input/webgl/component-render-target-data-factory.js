import { factoryByteRGB, factoryByteRGBA, factoryDepthInt, factoryFloatRGBA, factoryFloatRGB } from './texturewrapper.js';
import RenderTargetDataFactory from "./rendertargetdata.js";

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



