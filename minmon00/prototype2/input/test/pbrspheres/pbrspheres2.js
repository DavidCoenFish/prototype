/*
test float texture 2
*/

import canvasFactory from './../../dom/canvasfactory.js'
import webGLAPIFactory from './../../webgl/apifactory.js'

import { factoryDagNodeValue, factoryDagNodeCalculate, linkIndex, link, unlink } from './../../core/dagnode.js'
import { sInt, sFloat2 } from './../../webgl/shaderuniformtype.js'
import {Base64ToFloat32Array} from './../../core/base64.js';

const s_logDagCalls = false;

const dagNodeTextureFactory = function(in_webglApi, in_base64Data){
	var texture = in_webglApi.createTexture(
		256, 
		128, 
		"RGB",
		"RGB",
		"FLOAT",
		Base64ToFloat32Array(in_base64Data),
		true,
		"LINEAR",
		"NEAREST_MIPMAP_NEAREST",
		"REPEAT",
		"REPEAT",
		true
	);

	return factoryDagNodeValue(texture);
}

const dagNodeShaderFactory = function(in_webglApi){
	const sVertexShader = `
	attribute vec2 a_uv;
	varying vec2 v_uv;
	uniform vec2 u_posLow;
	uniform vec2 u_posHigh;
	void main() {
		v_uv = a_uv;
		gl_Position = vec4(
			(u_posLow.x * (a_uv.x)) + (u_posHigh.x * (1.0 - a_uv.x)),
			(u_posLow.y * (a_uv.y)) + (u_posHigh.y * (1.0 - a_uv.y)),
			0.0, 
			1.0
			);
	}
	`;

	const sFragmentShader = `
	precision mediump float;
	varying vec2 v_uv;
	uniform sampler2D u_sampler0;
	void main() {
		vec4 texel = texture2D(u_sampler0, v_uv);
		texel.w = 1.0;
		gl_FragColor = texel;
	}
	`;

	const sVertexAttributeNameArray = ["a_uv"];
	const sUniformArray = [
			in_webglApi.createShaderDataUniform("u_sampler0", sInt ),
			in_webglApi.createShaderDataUniform("u_posLow", sFloat2 ),
			in_webglApi.createShaderDataUniform("u_posHigh", sFloat2 )
	];

	//get ref to shader
	const shader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformArray );

	return factoryDagNodeValue(shader);
}

const dagCallbackCanvasRenderTargetFactory = function(in_webglApi){
	const result = Object.create({
		"activate" : function(){
			in_webglApi.clear(0.0, 0.0, 1.0, 0.0);
		},
		"getTexture" : function(){
			return undefined;
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		return result;
	}
}

const dagCallbackDisplayList = function(in_calculatedValue, in_inputIndexArray, in_inputArray){
	var renderTarget = in_inputIndexArray[0];
	renderTarget.activate();
	in_inputArray.forEach(function(item){
		item.draw();
	});
	return renderTarget;
}

const dagCallbackRenderTriangleFactory = function(in_webglApi, in_lowX, in_lowY, in_highX, in_highY){

	//make geom
	const m_geom = in_webglApi.createModel( "TRIANGLES", 6, {
		"a_uv" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0, 1,0, 0,1, 1,1]), "STATIC_DRAW", false)
	});

	var m_shader = undefined;
	var m_textureArray = [ undefined ];
	var m_shaderUniformValueArray = [0, [in_lowX, in_lowY], [in_highX, in_highY]];

	var result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, m_shaderUniformValueArray, m_textureArray, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
		m_shader = in_inputIndexArray[0];
		m_textureArray[0] = in_inputIndexArray[1];
		return result;
	}
}


export default function () {
	const html5CanvasWebGLWrapper = canvasFactory(document, {
		"width" : "512px",
		"height" : "256px",
		"backgroundColor" : "#000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	document.body.appendChild(html5CanvasWebGLWrapper.getElement());
	html5CanvasWebGLWrapper.onResize();
	var webGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), [
"OES_texture_float",
"OES_texture_float_linear",
"EXT_shader_texture_lod"
	], false);

	const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(webGLApi));
	const dagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
	linkIndex(dagNodeCanvasRenderTarget, dagNodeDisplayList, 0);

	var dagNodeShader = dagNodeShaderFactory(webGLApi);
	var dagNodeTexture0 = dagNodeTextureFactory(webGLApi, sEnv0_00);
	var dagNodeTexture1 = dagNodeTextureFactory(webGLApi, sEnv0_01);
	var dagNodeTexture2 = dagNodeTextureFactory(webGLApi, sEnv0_02);
	var dagNodeTexture3 = dagNodeTextureFactory(webGLApi, sEnv0_03);

	const dagNodeRenderQuad0 = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi, -1.0,0.0,0,1.0));
	linkIndex(dagNodeShader, dagNodeRenderQuad0, 0);
	linkIndex(dagNodeTexture0, dagNodeRenderQuad0, 1);
	link(dagNodeRenderQuad0, dagNodeDisplayList);

	const dagNodeRenderQuad1 = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi, 0.0,0.0,1.0,1.0));
	linkIndex(dagNodeShader, dagNodeRenderQuad1, 0);
	linkIndex(dagNodeTexture1, dagNodeRenderQuad1, 1);
	link(dagNodeRenderQuad1, dagNodeDisplayList);

	const dagNodeRenderQuad2 = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi, -1.0,-1.0,0,0.0));
	linkIndex(dagNodeShader, dagNodeRenderQuad2, 0);
	linkIndex(dagNodeTexture2, dagNodeRenderQuad2, 1);
	link(dagNodeRenderQuad2, dagNodeDisplayList);

	const dagNodeRenderQuad3 = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi, 0.0,-1.0,1.0,0.0));
	linkIndex(dagNodeShader, dagNodeRenderQuad3, 0);
	linkIndex(dagNodeTexture3, dagNodeRenderQuad3, 1);
	link(dagNodeRenderQuad3, dagNodeDisplayList);


	dagNodeDisplayList.getValue();

	return;
}	