/*
helper function for the webgl context wrapper
 */

const flush = function(in_webGLContextWrapper){
	in_webGLContextWrapper.callMethod("flush");
	return;
}

const clear = function(in_webGLContextWrapper, in_colourOrUndefined, in_depthOrUndefined, in_stencilOrUndefined){
	var clearFlag = 0;

	if (undefined !== in_colourOrUndefined){
		clearFlag |= in_webGLContextWrapper.getEnum("COLOR_BUFFER_BIT");
		in_webGLContextWrapper.callMethod(
			"clearColor", 
			in_colourOrUndefined.getRed(),
			in_colourOrUndefined.getGreen(),
			in_colourOrUndefined.getBlue(),
			in_colourOrUndefined.getAlpha()
			);
	}

	if (undefined !== in_depthOrUndefined){
		clearFlag |= in_webGLContextWrapper.getEnum("DEPTH_BUFFER_BIT");
		in_webGLContextWrapper.callMethod("clearDepth", in_depthOrUndefined);
	}

	if (undefined !== in_stencilOrUndefined){
		clearFlag |= in_webGLContextWrapper.getEnum("STENCIL_BUFFER_BIT");
		in_webGLContextWrapper.callMethod("clearStencil", in_stencilOrUndefined);
	}

	if (0 !== clearFlag){
		in_webGLContextWrapper.callMethod("clear", clearFlag);
	}

	return;
}

//"ELEMENT_ARRAY_BUFFER"
//"STATIC_DRAW"
const createBuffer = function(in_webGLContextWrapper, in_arrayData, in_bufferObjectTypeName, in_usageName){
	const bufferHandle = in_webGLContextWrapper.callMethod("createBuffer");
	const bufferObjectType = in_webGLContextWrapper.getEnum(in_bufferObjectTypeName);
	in_webGLContextWrapper.callMethod("bindBuffer", bufferObjectType, bufferHandle);
	const usage = in_webGLContextWrapper.getEnum(in_usageName);
	in_webGLContextWrapper.callMethod("bufferData", bufferObjectType, in_arrayData, usage);
	return bufferHandle;
}

const deleteBuffer = function(in_webGLContextWrapper, in_bufferHandle){
	in_webGLContextWrapper.callMethod("deleteBuffer", in_bufferHandle);
	return;
}

const setUniformFloat = function(in_webGLContextWrapper, in_uniformHandle, in_float){
	in_webGLContextWrapper.callMethod("uniform1f", in_uniformHandle, in_float);
	return;
}

const setUniformFloat2 = function(in_webGLContextWrapper, in_uniformHandle, in_floatArray){
	in_webGLContextWrapper.callMethod("uniform2fv", in_uniformHandle, in_floatArray);
	return;
}

const setUniformFloat3 = function(in_webGLContextWrapper, in_uniformHandle, in_floatArray){
	in_webGLContextWrapper.callMethod("uniform3fv", in_uniformHandle, in_floatArray);
	return;
}

// if uniform in shader is a vec4[3], then float array should be 12 floats?
const setUniformFloat4 = function(in_webGLContextWrapper, in_uniformHandle, in_floatArray){
	in_webGLContextWrapper.callMethod("uniform4fv", in_uniformHandle, in_floatArray);
	return;
}

const setUniformFloat16 = function(in_webGLContextWrapper, in_uniformHandle, in_floatArray, in_transposeOrUndefined){
	const transpose = (undefined == in_transposeOrUndefined) ? false : in_transposeOrUndefined;
	in_webGLContextWrapper.callMethod("uniformMatrix4fv", in_uniformHandle, transpose, in_floatArray);
	return;
}

const setUniformInteger = function(in_webGLContextWrapper, in_uniformHandle, in_value){
	in_webGLContextWrapper.callMethod("uniform1i", in_uniformHandle, in_value);
	return;
}


// const setMaterial = function(in_material){
// }

// const setRenderTarget = function(in_renderTarget){
// }

// const drawModel = function(in_model){
// }

/*
DSC.Framework.Context.WebGL.UNPACK_FLIP_Y_WEBGL            = 0x9240;
DSC.Framework.Context.WebGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
DSC.Framework.Context.WebGL.CONTEXT_LOST_WEBGL             = 0x9242;
DSC.Framework.Context.WebGL.UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
DSC.Framework.Context.WebGL.BROWSER_DEFAULT_WEBGL          = 0x9244;

DSC.Framework.Context.WebGL.NO_ERROR          = 0;
DSC.Framework.Context.WebGL.INVALID_ENUM      = 0x0500;
DSC.Framework.Context.WebGL.INVALID_VALUE     = 0x0501;
DSC.Framework.Context.WebGL.INVALID_OPERATION = 0x0502;
DSC.Framework.Context.WebGL.OUT_OF_MEMORY     = 0x0505;

DSC.Framework.Context.WebGL.CULL_FACE                = 0x0B44;
DSC.Framework.Context.WebGL.BLEND                    = 0x0BE2;
DSC.Framework.Context.WebGL.DITHER                   = 0x0BD0;
DSC.Framework.Context.WebGL.STENCIL_TEST             = 0x0B90;
DSC.Framework.Context.WebGL.DEPTH_TEST               = 0x0B71;
DSC.Framework.Context.WebGL.SCISSOR_TEST             = 0x0C11;
DSC.Framework.Context.WebGL.POLYGON_OFFSET_FILL      = 0x8037;
DSC.Framework.Context.WebGL.SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
DSC.Framework.Context.WebGL.SAMPLE_COVERAGE          = 0x80A0;

DSC.Framework.Context.WebGL.POINTS = 0;
DSC.Framework.Context.WebGL.LINES = 1;
DSC.Framework.Context.WebGL.LINE_LOOP = 2;
DSC.Framework.Context.WebGL.LINE_STRIP = 3;
DSC.Framework.Context.WebGL.TRIANGLES = 4;
DSC.Framework.Context.WebGL.TRIANGLE_STRIP = 5;
DSC.Framework.Context.WebGL.TRIANGLE_FAN = 6;

DSC.Framework.Context.WebGL.FRAGMENT_SHADER = 0x8B30;
DSC.Framework.Context.WebGL.VERTEX_SHADER  = 0x8B31;

DSC.Framework.Context.WebGL.STREAM_DRAW    = 0x88E0;
DSC.Framework.Context.WebGL.STATIC_DRAW    = 0x88E4;
DSC.Framework.Context.WebGL.DYNAMIC_DRAW   = 0x88E8;

DSC.Framework.Context.WebGL.BYTE           = 0x1400;
DSC.Framework.Context.WebGL.UNSIGNED_BYTE  = 0x1401;
DSC.Framework.Context.WebGL.SHORT          = 0x1402;
DSC.Framework.Context.WebGL.UNSIGNED_SHORT = 0x1403;
DSC.Framework.Context.WebGL.INT            = 0x1404;
DSC.Framework.Context.WebGL.UNSIGNED_INT   = 0x1405;
DSC.Framework.Context.WebGL.FLOAT          = 0x1406;

DSC.Framework.Context.WebGL.HALF_FLOAT_OES = 0x8D61; //extention OES_texture_half_float

DSC.Framework.Context.WebGL.ARRAY_BUFFER   = 0x8892;
DSC.Framework.Context.WebGL.ELEMENT_ARRAY_BUFFER = 0x8893;

//CULL_FACE
DSC.Framework.Context.WebGL.FRONT = 0x0404;
DSC.Framework.Context.WebGL.BACK = 0x0405;
DSC.Framework.Context.WebGL.FRONT_AND_BACK = 0x0408;

DSC.Framework.Context.WebGL.CW = 0x0900;
DSC.Framework.Context.WebGL.CCW = 0x0901;

//blend
DSC.Framework.Context.WebGL.ZERO = 0;
DSC.Framework.Context.WebGL.ONE = 1;
DSC.Framework.Context.WebGL.SRC_COLOR = 0x0300;
DSC.Framework.Context.WebGL.ONE_MINUS_SRC_COLOR = 0x0301;
DSC.Framework.Context.WebGL.SRC_ALPHA = 0x0302;
DSC.Framework.Context.WebGL.ONE_MINUS_SRC_ALPHA = 0x0303;
DSC.Framework.Context.WebGL.DST_ALPHA = 0x0304;
DSC.Framework.Context.WebGL.ONE_MINUS_DST_ALPHA = 0x0305;
DSC.Framework.Context.WebGL.DST_COLOR = 0x0306;
DSC.Framework.Context.WebGL.ONE_MINUS_DST_COLOR = 0x0307;
DSC.Framework.Context.WebGL.SRC_ALPHA_SATURATE = 0x0308

DSC.Framework.Context.WebGL.NEVER    = 0x0200;
DSC.Framework.Context.WebGL.LESS     = 0x0201;
DSC.Framework.Context.WebGL.EQUAL    = 0x0202;
DSC.Framework.Context.WebGL.LEQUAL   = 0x0203;
DSC.Framework.Context.WebGL.GREATER  = 0x0204;
DSC.Framework.Context.WebGL.NOTEQUAL = 0x0205;
DSC.Framework.Context.WebGL.GEQUAL   = 0x0206;
DSC.Framework.Context.WebGL.ALWAYS   = 0x0207;

//PixelFormat
DSC.Framework.Context.WebGL.DEPTH_COMPONENT = 0x1902;
DSC.Framework.Context.WebGL.ALPHA           = 0x1906;
DSC.Framework.Context.WebGL.RGB             = 0x1907;
DSC.Framework.Context.WebGL.RGBA            = 0x1908;
DSC.Framework.Context.WebGL.LUMINANCE       = 0x1909;
DSC.Framework.Context.WebGL.LUMINANCE_ALPHA = 0x190A;


//TextureMagFilter
DSC.Framework.Context.WebGL.NEAREST                        = 0x2600;
DSC.Framework.Context.WebGL.LINEAR                         = 0x2601;
    
//TextureMinFilter
DSC.Framework.Context.WebGL.NEAREST_MIPMAP_NEAREST         = 0x2700;
DSC.Framework.Context.WebGL.LINEAR_MIPMAP_NEAREST          = 0x2701;
DSC.Framework.Context.WebGL.NEAREST_MIPMAP_LINEAR          = 0x2702;
DSC.Framework.Context.WebGL.LINEAR_MIPMAP_LINEAR           = 0x2703;
    
// TextureParameterName
DSC.Framework.Context.WebGL.TEXTURE_MAG_FILTER             = 0x2800;
DSC.Framework.Context.WebGL.TEXTURE_MIN_FILTER             = 0x2801;
DSC.Framework.Context.WebGL.TEXTURE_WRAP_S                 = 0x2802;
DSC.Framework.Context.WebGL.TEXTURE_WRAP_T                 = 0x2803;
    
// TextureTarget
DSC.Framework.Context.WebGL.TEXTURE_2D                     = 0x0DE1;
DSC.Framework.Context.WebGL.TEXTURE                        = 0x1702;
    
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP               = 0x8513;
DSC.Framework.Context.WebGL.TEXTURE_BINDING_CUBE_MAP       = 0x8514;
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP_POSITIVE_X    = 0x8515;
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP_NEGATIVE_X    = 0x8516;
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP_POSITIVE_Y    = 0x8517;
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP_NEGATIVE_Y    = 0x8518;
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP_POSITIVE_Z    = 0x8519;
DSC.Framework.Context.WebGL.TEXTURE_CUBE_MAP_NEGATIVE_Z    = 0x851A;
DSC.Framework.Context.WebGL.MAX_CUBE_MAP_TEXTURE_SIZE      = 0x851C;
    
// TextureUnit
DSC.Framework.Context.WebGL.TEXTURE0                       = 0x84C0;

// TextureWrapMode
DSC.Framework.Context.WebGL.REPEAT                         = 0x2901;
DSC.Framework.Context.WebGL.CLAMP_TO_EDGE                  = 0x812F;
DSC.Framework.Context.WebGL.MIRRORED_REPEAT                = 0x8370;

// Framebuffer Object
DSC.Framework.Context.WebGL.FRAMEBUFFER                    = 0x8D40;
DSC.Framework.Context.WebGL.RENDERBUFFER                   = 0x8D41;

DSC.Framework.Context.WebGL.COLOR_ATTACHMENT0              = 0x8CE0;
DSC.Framework.Context.WebGL.DEPTH_ATTACHMENT               = 0x8D00;
DSC.Framework.Context.WebGL.STENCIL_ATTACHMENT             = 0x8D20;
DSC.Framework.Context.WebGL.DEPTH_STENCIL_ATTACHMENT       = 0x821A;

DSC.Framework.Context.WebGL.prototype.GetViewport = function(_result)
{
	if (!this.m_webGL)
		return;
	var viewport = this.m_webGL.getParameter(this.m_webGL.VIEWPORT); //Int32Array (with 4 elements)

	if (undefined != _result)
	{
		_result.Set(viewport[0], viewport[1], viewport[0] + viewport[2], viewport[1] + viewport[3]);
		return _result;
	}
	return DSC.Math.Bound2.Factory(viewport[0], viewport[1], viewport[0] + viewport[2], viewport[1] + viewport[3]);
}

DSC.Framework.Context.WebGL.prototype.SetViewport = function(in_lowX, in_lowY, in_highX, in_highY)
{
	if (!this.m_webGL)
		return;
	this.m_webGL.viewport(in_lowX, in_lowY, in_highX - in_lowX, in_highY - in_lowY);
	this.GetError();
}

DSC.Framework.Context.WebGL.prototype.ActivateTexture = function(in_textureHandle, in_index)
{
	if (!this.m_webGL)
		return;
	this.m_webGL.activeTexture(this.m_webGL.TEXTURE0 + in_index);
	this.m_webGL.bindTexture(this.m_webGL.TEXTURE_2D, in_textureHandle);
	this.GetError();

	return;	
}

DSC.Framework.Context.WebGL.prototype.DeactivateTexture = function(in_index)
{
	if (!this.m_webGL)
		return;
	this.m_webGL.activeTexture(this.m_webGL.TEXTURE0 + in_index);
	this.m_webGL.bindTexture(this.m_webGL.TEXTURE_2D, undefined);
	this.GetError();

	return;	
}

DSC.Framework.Context.WebGL.prototype.SetVertexAttributeBufferFloat = function(in_attribute, in_buffer, in_dataSize)
{
	if (!this.m_webGL)
		return undefined;

	this.m_webGL.enableVertexAttribArray(in_attribute);
	this.GetError();

	if (this.m_webGL)
		this.m_webGL.bindBuffer(this.m_webGL.ARRAY_BUFFER, in_buffer);
	this.GetError();

	if (this.m_webGL)
		this.m_webGL.vertexAttribPointer(
			in_attribute, 
			in_dataSize, 
			this.m_webGL.FLOAT, 
			false,
			0, 
			0);  
	this.GetError();
}

DSC.Framework.Context.WebGL.prototype.UpdateBuffer = function(in_handle, in_arrayData, _bufferObjectType, _type)
{
	if (!this.m_webGL)
		return undefined;

	var bufferObjectType = (undefined == _bufferObjectType) ? DSC.Framework.Context.WebGL.ARRAY_BUFFER : _bufferObjectType;

	if (this.m_webGL)
		this.m_webGL.bindBuffer(bufferObjectType, in_handle);
	this.GetError();

	var type = (undefined == _type) ? DSC.Framework.Context.WebGL.DYNAMIC_DRAW : _type;

	if (this.m_webGL)
		this.m_webGL.bufferData(bufferObjectType, in_arrayData, type);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.BindBuffer = function(in_handle, _bufferObjectType)
{
	var bufferObjectType = (undefined == _bufferObjectType) ? DSC.Framework.Context.WebGL.ARRAY_BUFFER : _bufferObjectType;

	if (this.m_webGL)
		this.m_webGL.bindBuffer(bufferObjectType, in_handle);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.EnableVertexAttribArray = function(in_position, in_elementsPerVertex, in_type, in_normalise, _stride, _offset)
{
	var stride = (undefined == _stride) ? 0 : _stride;
	var offset = (undefined == _offset) ? 0 : _offset;

	if (this.m_webGL)
		this.m_webGL.enableVertexAttribArray(in_position);
	this.GetError();

	if (this.m_webGL)
		this.m_webGL.vertexAttribPointer(in_position, in_elementsPerVertex, in_type, in_normalise, stride, offset);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.DisableVertexAttribArray = function(in_position)
{
	if (this.m_webGL)
		this.m_webGL.disableVertexAttribArray(in_position);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.DrawArrays = function(in_mode, in_first, in_count)
{
	if (this.m_webGL)
		this.m_webGL.drawArrays(in_mode, in_first, in_count);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.DrawElements = function(in_mode, in_count, in_type, in_offset)
{
	if (this.m_webGL)
		this.m_webGL.drawElements(in_mode, in_count, in_type, in_offset);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.Enable = function(in_capability, _enable)
{
	if (this.m_webGL)
	{
		if (true == _enable)
		{
			this.m_webGL.enable(in_capability);
		}
		else
		{
			this.m_webGL.disable(in_capability);
		}
	}
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.FrontFace = function(in_mode)
{
	if (this.m_webGL)
		this.m_webGL.frontFace(in_mode);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.CullFace = function(in_mode)
{
	if (this.m_webGL)
		this.m_webGL.cullFace(in_mode);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.BlendFunc = function(in_sfactor, in_dfactor)
{
	if (this.m_webGL)
		this.m_webGL.blendFunc(in_sfactor, in_dfactor);
	this.GetError();

	return;
}

DSC.Framework.Context.WebGL.prototype.DepthFunc = function(in_mode)
{
	if (this.m_webGL)
		this.m_webGL.depthFunc(in_mode);
	this.GetError();

	return;
}

 */

module.exports = {
	"flush" : flush,
	"clear" : clear,
	"createBuffer" : createBuffer,
	"deleteBuffer" : deleteBuffer,
	"setUniformFloat" : setUniformFloat,
	"setUniformFloat2" : setUniformFloat2,
	"setUniformFloat3" : setUniformFloat3,
	"setUniformFloat4" : setUniformFloat4,
	"setUniformFloat16" : setUniformFloat16,
	"setUniformInteger" : setUniformInteger

	//"setMaterial" : setMaterial,
	//"setRenderTarget" : setRenderTarget,
	//"drawModel" : drawModel
}
