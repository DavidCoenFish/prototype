import canvasFactory from './../dom/canvasfactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'
import { factoryDagNodeCalculate, linkIndex, link } from './../core/dagnode.js'
//import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from './../webgl/shader.js'
import {sRGBA, sUNSIGNED_BYTE} from './../webgl/texturetype'

const dagCallbackTextureRenderTargetFactory = function(in_webglApi){
	var m_texture = in_webglApi.createTexture(
			512, 
			512,
			sRGBA,
			sRGBA,
			sUNSIGNED_BYTE
			);
	var m_renderTarget = in_webglApi.createRenderTarget(
			100,
			100,
			312,
			312,
			[
				in_webglApi.createRenderTargetDataTexture(
					m_texture,
					"FRAMEBUFFER",
					"COLOR_ATTACHMENT0",
					"TEXTURE_2D"
					)
			]
			);


	var result = Object.create({
		"activate" : function(){
			in_webglApi.setRenderTarget(m_renderTarget);
			in_webglApi.clear(1.0, 0.0, 0.0);
		},
		"getTexture" : function(){
			//return m_texture;
			return m_renderTarget.getTexture(0);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		return result;
	}
}

const dagCallbackCanvasRenderTargetFactory = function(in_webglApi){
	const result = Object.create({
		"activate" : function(){
			in_webglApi.setRenderTarget(undefined);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		return result;
	}
}

//input[0] object with "activate" method
const dagCallbackDisplayList = function(in_calculatedValue, in_inputIndexArray, in_inputArray){
	var renderTarget = in_inputIndexArray[0];
	renderTarget.activate();
	in_inputArray.forEach(function(item){
		item.draw();
	});
	return renderTarget;
}

const dagCallbackRenderTriangleFactory = function(in_webglApi){
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

	//get ref to shader
	const m_shader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray );

	//make geom
	const m_geom = in_webglApi.createModel( "TRIANGLES", 3, {
		"a_position" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ -1, -1, -1, 1, 1, -1]), "STATIC_DRAW", false)
	});

	const result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, undefined, undefined, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
		return result;
	}
}

const dagCallbackRenderQuadFactory = function(in_webglApi){
	const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;

void main() {
	v_uv = a_uv;
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}
`;

	const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler0;
void main() {
	vec4 texel = texture2D(u_sampler0, v_uv);
	texel.x = 1.0;
	gl_FragColor = texel;
}
`;

	const sVertexAttributeNameArray = ["a_position", "a_uv"];

	//get ref to shader
	const m_shader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray );
/*
-1, 1		 1, 1
-1,-1		 1,-1

0,1			1,1
0,0			1,0
*/

	//make geom
	const m_geom = in_webglApi.createModel( "TRIANGLES", 6, {
		"a_position" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ -1, -1, -1, 1, 1, -1, 1,-1, -1,1, 1,1]), "STATIC_DRAW", false),
		"a_uv" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0, 1,0, 0,1, 1,1]), "STATIC_DRAW", false)
	});

	var m_textureArray = [ undefined ];

	var result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, undefined, m_textureArray, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
		m_textureArray[0] = in_inputIndexArray[0].getTexture(0);
		return result;
	}
}


export default function () {
	const html5CanvasWrapper = canvasFactory(document, 
	{
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	}
	);

	document.body.appendChild(html5CanvasWrapper.getElement());
	html5CanvasWrapper.onResize();

	const webGLApi = webGLAPIFactory(html5CanvasWrapper.getElement(), undefined, false);

	//webGLApi.clear(1.0);

	//construct a dag nod system that results in a render target being drawn on a quad
	// render triangle to texture
	const dagNodeTextureRenderTarget = factoryDagNodeCalculate(dagCallbackTextureRenderTargetFactory(webGLApi));

	const dagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
	linkIndex(dagNodeTextureRenderTarget, dagNodeDisplayList, 0);
	const dagNodeRenderTriangle = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi));
	link(dagNodeRenderTriangle, dagNodeDisplayList);

	const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(webGLApi));

	const dagNodeDisplayList2 = factoryDagNodeCalculate(dagCallbackDisplayList);
	linkIndex(dagNodeCanvasRenderTarget, dagNodeDisplayList2, 0);
	const dagNodeRenderQuad = factoryDagNodeCalculate(dagCallbackRenderQuadFactory(webGLApi));
	linkIndex(dagNodeDisplayList, dagNodeRenderQuad, 0);
	link(dagNodeRenderQuad, dagNodeDisplayList2);

	dagNodeDisplayList2.getValue();


	return;
}