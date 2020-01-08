import canvasFactory from './../../dom/canvasfactory.js'
import webGLAPIFactory from './../../webgl/apifactory.js'
import inputFactory from './../../dom/inputfactory.js'

import { factoryDagNodeValue, factoryDagNodeCalculate, linkIndex, link, unlink } from './../../core/dagnode.js'
import { sInt, sFloat } from './../../webgl/shaderuniformtype.js'
import {Base64ToFloat32Array} from './../../core/base64.js';

const s_logDagCalls = false;

const dagNodeTextureFactory = function(in_webglApi){
	//var texture = //TextureFactoryEnv0(in_webglApi);
	var texture = in_webglApi.createTexture(
		512, 
		256, 
		"RGB",
		"RGB",
		"FLOAT",
		Base64ToFloat32Array(sEnv0),
		true,
		"LINEAR",
		"NEAREST_MIPMAP_NEAREST",
		"REPEAT",
		"REPEAT",
		true
	);

	return factoryDagNodeValue(texture);
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

const dagCallbackRenderTriangleFactory = function(in_webglApi){
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
	uniform float u_light;
	uniform sampler2D u_sampler0;
	void main() {
		vec4 texel = texture2D(u_sampler0, v_uv) / u_light;
		texel.w = 1.0;
		gl_FragColor = texel;
	}
	`;

	const sVertexAttributeNameArray = ["a_position", "a_uv"];
	const sUniformArray = [
			in_webglApi.createShaderDataUniform("u_sampler0", sInt ),
			in_webglApi.createShaderDataUniform("u_light", sFloat ),
	];

	//get ref to shader
	const m_shader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformArray );

	//make geom
	const m_geom = in_webglApi.createModel( "TRIANGLES", 6, {
		"a_position" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 
			-128, 0, 
			-128, 127, 
			127, 0, 
			127, 0, 
			-128, 127, 
			127, 127
			]), "STATIC_DRAW", true),
		"a_uv" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0, 1,0, 0,1, 1,1]), "STATIC_DRAW", false)
	});

	var m_textureArray = [ undefined ];
	var m_shaderUniformValueArray = [0, 1.0];

	var result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, m_shaderUniformValueArray, m_textureArray, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
		m_textureArray[0] = in_inputIndexArray[0]
		m_shaderUniformValueArray[1] = in_inputIndexArray[1];
		return result;
	}
}

const dagCallbackRenderTriangleFactory2 = function(in_webglApi){
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
	#extension GL_EXT_shader_texture_lod : enable
	precision mediump float;
	varying vec2 v_uv;
	uniform float u_light;
	uniform float u_lod;
	uniform sampler2D u_sampler0;
	void main() {
		vec4 texel = texture2DLodEXT(u_sampler0, v_uv, u_lod) / u_light;
		texel.w = 1.0;
		gl_FragColor = texel;
	}
	`;

	const sVertexAttributeNameArray = ["a_position", "a_uv"];
	const sUniformArray = [
			in_webglApi.createShaderDataUniform("u_sampler0", sInt ),
			in_webglApi.createShaderDataUniform("u_light", sFloat ),
			in_webglApi.createShaderDataUniform("u_lod", sFloat ),
	];

	//get ref to shader
	const m_shader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformArray );

	//make geom
	const m_geom = in_webglApi.createModel( "TRIANGLES", 6, {
		"a_position" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 
			-128, -128, 
			-128, 0, 
			127, -128, 
			127, -128, 
			-128, 0, 
			127, 0
			]), "STATIC_DRAW", true),
		"a_uv" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0, 1,0, 0,1, 1,1]), "STATIC_DRAW", false)
	});

	var m_textureArray = [ undefined ];
	var m_shaderUniformValueArray = [0, 1.0, 0.0];

	var result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, m_shaderUniformValueArray, m_textureArray, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
		m_textureArray[0] = in_inputIndexArray[0]
		m_shaderUniformValueArray[1] = in_inputIndexArray[1];
		m_shaderUniformValueArray[2] = in_inputIndexArray[2];
		return result;
	}
}


export default function () {
	const html5CanvasWebGLWrapper = canvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
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

	var dagLight = factoryDagNodeValue(1.0);
	var dagLod = factoryDagNodeValue(1.0);

	var dagNodeTexture = dagNodeTextureFactory(webGLApi);
	const dagNodeRenderTriangle = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi));
	linkIndex(dagNodeTexture, dagNodeRenderTriangle, 0);
	linkIndex(dagLight, dagNodeRenderTriangle, 1);
	link(dagNodeRenderTriangle, dagNodeDisplayList);

	const dagNodeRenderTriangle2 = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory2(webGLApi));
	linkIndex(dagNodeTexture, dagNodeRenderTriangle2, 0);
	linkIndex(dagLight, dagNodeRenderTriangle2, 1);
	linkIndex(dagLod, dagNodeRenderTriangle2, 2);
	link(dagNodeRenderTriangle2, dagNodeDisplayList);

	dagNodeDisplayList.getValue();

	const domLightInputWrapper = inputFactory(document, undefined, function(in_value){ 
		dagLight.setValue(in_value); 
		dagNodeDisplayList.getValue();
	}, "number", 1.0);
	document.body.appendChild(domLightInputWrapper.getElement());

	const domLodInputWrapper = inputFactory(document, undefined, function(in_value){ 
		dagLod.setValue(in_value); 
		dagNodeDisplayList.getValue();
	}, "number", 0.0);
	document.body.appendChild(domLodInputWrapper.getElement());

	return;
}	