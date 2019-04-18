import ComponentCanvasFactory from './../manipulatedom/component-canvas.js';
import ComponentModelFactory from './../webgl/component-model-screen-quad.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import WebGLStateFactory from './../webgl/webglstate.js';
import MaterialWrapperFactory from "./materialwrapper.js";
import ShaderWrapperFactory from "./shaderwrapper.js";

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
	v_uv = a_uv;
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
vec4 makeColour(vec2 in_uv){
	
}
void main() {
	gl_FragColor = makeColour(v_uv);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameMap = {};


export default function () {
	const componentCanvas = ComponentCanvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const webGLState = WebGLStateFactory(componentCanvas.getCanvasElement(), false);

	const shader =  ShaderWrapperFactory(
		webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);

	const material = MaterialWrapperFactory();
	const resourceManager = ResourceManagerFactory();
	const model = ComponentModelFactory(resourceManager, webGLState);

	webGLState.applyShader(shader);
	webGLState.applyMaterial(material);
	webGLState.drawModel(model);

	return;
}