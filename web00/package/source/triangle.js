const CoreTypes = require("coretypes");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
const sFragmentShader = `
precision mediump float;
uniform vec4 u_colour;
void main() {
	gl_FragColor = u_colour;
}
`;
//	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);;
//	gl_FragColor = u_colour;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = ["u_colour"];

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
	}

	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);

	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const colour = CoreTypes.Colour4.factoryFloat32(0.0, 0.0, 1.0, 1.0);
	const uniformServer = {
		"setUniform" : function(in_webGLContextWrapper, in_key, in_position){
			if (in_key === "u_colour"){
				console.log("uniformServer:u_colour");
				WebGL.WebGLContextWrapperHelper.setUniformFloat4(in_webGLContextWrapper, in_position, colour.getRaw());
			}
		}
	};
	const shader = WebGL.ShaderWrapper.factory(webGLContextWrapper, sVertexShader, sFragmentShader, uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const material = WebGL.MaterialWrapper.factoryDefault(shader);
	const webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	const posDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Int8Array([
				-1, -1,
				-1, 1,
				1, -1
				]),
			"STATIC_DRAW",
			false
			);
			//in_typeName,in_elementsPerVertex,in_arrayData,in_usageName,in_normalise

	const model = WebGL.ModelWrapper.factory(
		webGLContextWrapper, 
		"TRIANGLES",
		3,
		{
			"a_position" : posDataStream
		}
		);

	const clearColour = CoreTypes.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	WebGL.WebGLContextWrapperHelper.clear(webGLContextWrapper, clearColour);

	material.apply(webGLContextWrapper, webGLState);
	model.draw(webGLContextWrapper, shader.getMapVertexAttribute());

	return;
}

// const onPageLoad = function(){
// 	console.info("onPageLoad2");
// }

window.addEventListener('load', onPageLoad, true);
