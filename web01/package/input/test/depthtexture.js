/* 
make a render target with depth
then render it to screen to check what accuracy we are getting for the depth texture
*/

import { factoryAppendBody as ComponentCanvasFactory} from './../manipulatedom/component-canvas.js';
import ComponentModelFactory from './../webgl/component-model-screen-quad.js';
import ComponentRenderTargetFactory from './../webgl/component-render-target.js';
import { RenderTargetDataFactoryAttachment0ByteRGBA, RenderTargetDataFactoryDepthInt } from './../webgl/component-render-target-data-factory.js';
import ResourceManagerFactory from './../core/resourcemanager.js';
import WebGLStateFactory from './../webgl/webglstate.js';
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt} from "./../webgl/shaderuniformdata.js";
import ModelDataStreamFactory from "./../webgl/modeldatastream.js";
import ModelWrapperFactory from "./../webgl/modelwrapper.js";

const sDepthVertexShader = `
precision mediump float;
attribute vec3 a_position;
void main() {
	gl_Position = vec4(a_position, 1.0);
}
`;
const sDepthFragmentShader = `
precision mediump float;
void main() {
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;
const sDepthVertexAttributeNameArray = ["a_position"];

const sPresentVertexShader = `
precision mediump float;
attribute vec3 a_position;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 1.0);
	v_uv = (a_position.xy * 0.5) + 0.5;
}
`;
const sPresentFragmentShader = `
precision mediump float;
uniform sampler2D u_sampler;
varying vec2 v_uv;
void main() {
	vec4 texel = texture2D(u_sampler, v_uv);
	float value0 = fract(texel.x);
	float value1 = fract(texel.x * 256.0);
	float value2 = fract(texel.x * 256.0 * 256.0);
	//float value = fract(texel.x * 256.0 * 256.0 * 256.0);
	gl_FragColor = vec4(value0, value1, value2, 1.0);
}
`;
const sPresentVertexAttributeNameArray = ["a_position"];
const sPresentUniformNameMap = {
	"u_sampler" : sInt,
};



const makeDepthModel = function(in_webGLState){
	const z0 = 1.0 / 1.0;
	const z1 = 1.0 / 256.0;
	const z2 = 1.0 / (256.0 * 256.0);
	const z3 = 1.0 / (256.0 * 256.0 * 256.0);

	const posDataStream = ModelDataStreamFactory(
		in_webGLState, 
		"FLOAT",
		3,
		new Float32Array([
			-1, -1, 0,
			-1, -0.5, 0,
			1, -1, z0,
			1, -1, z0,
			-1, -0.5, 0,
			1, -0.5, z0,

			-1, -0.5, 0,
			-1, 0, 0,
			1, -0.5, z1,
			1, -0.5, z1,
			-1, 0, 0,
			1, 0, z1,

			-1, 0, 0,
			-1, 0.5, 0,
			1, 0, z2,
			1, 0, z2,
			-1, 0.5, 0,
			1, 0.5, z2,

			-1, 0.5, 0,
			-1, 1, 0,
			1, 0.5, z3,
			1, 0.5, z3,
			-1, 1, 0,
			1, 1, z3
			]),
		"STATIC_DRAW",
		false
		);

	return ModelWrapperFactory(
		in_webGLState, 
		"TRIANGLES", 
		24, 
		{
			"a_position" : posDataStream
		}
	);
}

export default function () {
	const componentCanvas = ComponentCanvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const webGLState = WebGLStateFactory(componentCanvas.getElement(), false, undefined, undefined, ["WEBGL_depth_texture"], undefined);
	const resourceManager = ResourceManagerFactory();
	
	const componentRenderTarget = ComponentRenderTargetFactory(webGLState, [
		RenderTargetDataFactoryAttachment0ByteRGBA,
		RenderTargetDataFactoryDepthInt
	], 512, 512);

	const depthModel = makeDepthModel(webGLState);
	const depthMaterial = MaterialWrapperFactory(
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		"ALWAYS",
		undefined,
		true,
		true,
		true,
		true,
		true,
		undefined
	);
	const depthShader = ShaderWrapperFactory(
		webGLState, 
		sDepthVertexShader, 
		sDepthFragmentShader, 
		sDepthVertexAttributeNameArray);

	const presentMaterial = MaterialWrapperFactory([componentRenderTarget.getTexture(1)]);
	const presentModel = ComponentModelFactory(resourceManager, webGLState);
	const presentShader = ShaderWrapperFactory(
		webGLState, 
		sPresentVertexShader, 
		sPresentFragmentShader, 
		sPresentVertexAttributeNameArray,
		sPresentUniformNameMap);

	webGLState.applyRenderTarget(componentRenderTarget.getRenderTarget());
	webGLState.applyShader(depthShader);
	webGLState.applyMaterial(depthMaterial);
	webGLState.drawModel(depthModel);

	webGLState.applyRenderTarget();
	webGLState.applyShader(presentShader, { "u_sampler" : 0 } );
	webGLState.applyMaterial(presentMaterial);
	webGLState.drawModel(presentModel.getModel());

	return;
}