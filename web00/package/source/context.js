const WebGL = require("webgl");

const onPageLoad = function(){
	console.info("onPageLoad");

	const divElement = document.getElementById("divElement");
	const html5CanvasElement = document.createElement("canvas");
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const extension = webGLContextWrapper.callMethod("getExtension", "WEBGL_lose_context");

	addButton("context restored", function(e){
		logLine(divElement, "context restored");
		extension.restoreContext();
	});
	addButton("context lost", function(e){
		logLine(divElement, "context lost");
		extension.loseContext();
	});

	const shader0 = WebGL.ShaderWrapper.factory(webGLContextWrapper, vertexShaderSource, fragmentShaderSource);

	webGLContextWrapper.callMethod("getExtension", "WEBGL_lose_context");

	return;
}

const logLine = function(in_divElement, in_message){
	in_divElement.innerHTML += (in_message + "<br/>");
	return;
}

const addButton = function(in_title, in_callback){
	const button = document.createElement("BUTTON");
	var textNode = document.createTextNode(in_title);

	button.addEventListener("click",in_callback,false);

	button.appendChild(textNode);
	//document.body.appendChild(button);
	document.body.insertBefore(button, document.body.firstChild);
	return;
}

window.addEventListener('load', onPageLoad, true);
