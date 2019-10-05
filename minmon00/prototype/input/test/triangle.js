import {factoryAppendElement} from './../manipulatedom/component-canvas.js'
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import WebGLStateFactory from './../webgl/webglstate.js'
import MaterialWrapperFactory from './../webgl/materialwrapper.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';
import ShaderWrapper from './../webgl/shaderwrapper.js';

const sVertexShader = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;
void main() {
	gl_FragColor = vec4(0.0,1.0,0.0,1.0);
}
`;

const sVertexAttributeNameArray = ["a_position"];

export default function () {
	const html5CanvasWrapper = factoryAppendElement(document, document.body,
	{
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	}
	);
	const webGLState = WebGLStateFactory(html5CanvasWrapper.getElement(), false);
	webGLState.clear(Colour4FactoryFloat32(1.0,0.0,0.0));

	const model = ModelWrapperFactory(webGLState, "TRIANGLES", 3, {
		"a_position" : ModelDataStream(webGLState, "BYTE", 2, new Int8Array([ -1, -1, -1, 1, 1, -1]), "STATIC_DRAW", false)
	});
	const material = MaterialWrapperFactory();
	const shader = ShaderWrapper(webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray);

	webGLState.applyShader(shader);
	webGLState.applyMaterial(material);
	webGLState.drawModel(model);

	return;
}