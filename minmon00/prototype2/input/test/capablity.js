import factory from './../webgl/contextwrapper.js';

export default function () {
	console.info("onPageLoad");

	const html5CanvasElement = document.createElement("canvas");
	const webGLContextWrapper = factory(html5CanvasElement);
	const divElement = document.createElement("div");
	document.body.appendChild(divElement);
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
		"ALIASED_POINT_SIZE_RANGE",
		"MAX_VIEWPORT_DIMS",
		"SHADING_LANGUAGE_VERSION",
		"DEPTH_BITS",
		"STENCIL_BITS",
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

	logLine(divElement, "BLEND isEnabled:" + webGLContextWrapper.callMethod("isEnabled", webGLContextWrapper.getEnum("BLEND")));
	logLine(divElement, "DITHER isEnabled:" + webGLContextWrapper.callMethod("isEnabled", webGLContextWrapper.getEnum("DITHER")));
	logLine(divElement, "CULL_FACE isEnabled:" + webGLContextWrapper.callMethod("isEnabled", webGLContextWrapper.getEnum("CULL_FACE")));
	logLine(divElement, "DEPTH_TEST isEnabled:" + webGLContextWrapper.callMethod("isEnabled", webGLContextWrapper.getEnum("DEPTH_TEST")));
	logLine(divElement, "SCISSOR_TEST isEnabled:" + webGLContextWrapper.callMethod("isEnabled", webGLContextWrapper.getEnum("SCISSOR_TEST")));
	logLine(divElement, "STENCIL_TEST isEnabled:" + webGLContextWrapper.callMethod("isEnabled", webGLContextWrapper.getEnum("STENCIL_TEST")));

	return;
}

const logLine = function(in_divElement, in_message){
	in_divElement.innerHTML += (in_message + "<br/>");
	return;
}

