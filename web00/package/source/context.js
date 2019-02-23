const Core = require("core");
const ManipulateDom = require("manipulatedom");
const WebGL = require("webgl");

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
const uniformMap = {
	"u_colour" : WebGL.ShaderUniformData.sFloat4
}

const onPageLoad = function(){
	console.info("onPageLoad");

	const m_canvaseElementWrapper = ManipulateDom.ComponentCanvas.factoryAppendBody(document, 512, 256);
	const m_webGLState = WebGL.WebGLState.factory(m_canvaseElementWrapper.getElement());
	const m_extension = m_webGLState.getExtention("WEBGL_lose_context");
	var m_hasContext = true;

	ManipulateDom.Button.addSimpleButton(document, document.body, "context restored", function(in_event){
		if (true === m_hasContext){
			console.log("already have context");
		} else {
			console.log("context restored");
			m_extension.restoreContext();
			m_hasContext = true;
		}
	});

	ManipulateDom.Button.addSimpleButton(document, document.body, "context lost", function(in_event){
		if (false === m_hasContext){
			console.log("already lost context");
		} else {
			console.log("context lost");
			m_extension.loseContext();
			m_hasContext = false;
		}
	});

	const colour = Core.Colour4.factoryFloat32(0.0, 0.0, 1.0, 1.0);
	const shader0 = WebGL.ShaderWrapper.factory(
		m_webGLState,
		vertexShaderSource, 
		fragmentShaderSource,
		["a_position"],
		uniformMap
		);

	return;
}

window.addEventListener('load', onPageLoad, true);
