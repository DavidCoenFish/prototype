const WebGL = require("webgl");

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = document.createElement("canvas");
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);

	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);

	const divElement = document.getElementById("divElement");
	const arrayParam = [ 
		"VENDOR",
		"VERSION",
		"MAX_COMBINED_TEXTURE_IMAGE_UNITS",
		"MAX_CUBE_MAP_TEXTURE_SIZE",
		"MAX_FRAGMENT_UNIFORM_VECTORS",
		"MAX_RENDERBUFFER_SIZE",
		"MAX_TEXTURE_IMAGE_UNITS",
		"MAX_TEXTURE_SIZE",
		"MAX_VARYING_VECTORS",
		"MAX_VERTEX_ATTRIBS",
		"MAX_VERTEX_TEXTURE_IMAGE_UNITS",
		"MAX_VERTEX_UNIFORM_VECTORS",
		"ALIASED_LINE_WIDTH_RANGE",
		"MAX_VIEWPORT_DIMS",
		"SHADING_LANGUAGE_VERSION",
		//#extension GL_EXT-draw_buffers : require
		//"MAX_DRAW_BUFFERS_WEBGL",
	];
	arrayParam.forEach(function(in_item){
		logLine(divElement, in_item + ":" + webGLContextWrapper.getParameter(webGLContextWrapper.getEnum(in_item)));
	});

	const arrayExtention = webGLContextWrapper.getSupportedExtensions();
	arrayExtention.forEach( function(item)
	{
		logLine(divElement, "extention:" + item);
	});

	//webGL.getShaderPrecisionFormat(webGL.FRAGMENT_SHADER, webGL.HIGH_FLOAT);
	//webGL.getShaderPrecisionFormat(webGL.FRAGMENT_SHADER, webGL.MEDIUM_FLOAT);
	//webGL.getShaderPrecisionFormat(webGL.FRAGMENT_SHADER, webGL.LOW_FLOAT);


	return;
}

const logLine = function(in_divElement, in_message){
	in_divElement.innerHTML += (in_message + "<br/>");
	return;
}

/*
	this.m_arrayExtention = this.m_webGL.getSupportedExtensions();
	console.info("    webgl supported extentions");
	this.m_arrayExtention.forEach( function(item)
	{
		console.info("        " + item);
	});

	//this.m_webGL.getExtension("GL_ARB_draw_buffers");
	


	this.m_arraySupportedExtentions = [];
	if ((undefined != _paramObject) &&
		(undefined != _paramObject.extentions))
	{
		var that = this;
		_paramObject.extentions.forEach( function(item)
		{
			if (-1 != that.m_arrayExtention.indexOf(item))
			{
				var result = that.m_webGL.getExtension(item);
				if (!result)
					console.info("getExtension failed for [" + item  + "] " + result);
				else
				{
					console.info("getExtension [" + item  + "] " + result);
					that.m_arraySupportedExtentions.push(item);
				}
			}
			else
			{
				console.info("Requested extention was not found:" + item);
			}
		});
	}

 */

window.addEventListener('load', onPageLoad, true);
