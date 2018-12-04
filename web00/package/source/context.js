const WebGL = require("webgl");
const Math = require("math");

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_colour;
void main() {
	gl_FragColor = u_colour;
}
`;

/*
	"m_mapVertexAttributeNames" : {"a_position" : -1}, 
	"m_mapUniformsNames" : {
		"u_colour" : DSC.Framework.Asset.Shader.Uniform.Factory(DSC.Framework.Context.Uniform.s_type.TColour4)
	}
 */

const onPageLoad = function(){
	console.info("onPageLoad");

	const divElement = document.getElementById("divElement");
	const html5CanvasElement = document.createElement("canvas");
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const extension = webGLContextWrapper.callMethod("getExtension", "WEBGL_lose_context");
	var hasContext = true;

	addButton("context restored", function(e){
		if (true === hasContext){
			logLine(divElement, "already have context");
		} else {
			logLine(divElement, "context restored");
			extension.restoreContext();
			hasContext = true;
		}
	});
	addButton("context lost", function(e){
		if (false === hasContext){
			logLine(divElement, "already lost context");
		} else {
			logLine(divElement, "context lost");
			extension.loseContext();
			hasContext = false;
		}
	});

	const colour = Math.Colour4.factoryFloat32(0.0, 0.0, 1.0, 1.0);
	const shader0 = WebGL.ShaderWrapper.factory(
		webGLContextWrapper, 
		vertexShaderSource, 
		fragmentShaderSource,
		{
			"getValue" : function(in_name){
				if (in_name === "u_colour"){
					return colour;
				}
				return undefined;
			}
		},
		["a_position"],
		["u_colour"]
		);

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
	document.body.insertBefore(button, document.body.firstChild);
	return;
}

window.addEventListener('load', onPageLoad, true);
