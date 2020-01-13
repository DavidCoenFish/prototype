/*
test pbr shader
*/

import canvasFactory from './../../dom/canvasfactory.js'
import webGLAPIFactory from './../../webgl/apifactory.js'
import inputFactory from './../../dom/inputfactory.js'

import { factoryDagNodeValue, factoryDagNodeCalculate, linkIndex, link, unlink } from './../../core/dagnode.js'
import { sInt, sFloat } from './../../webgl/shaderuniformtype.js'
import {Base64ToFloat32Array} from './../../core/base64.js';

const s_logDagCalls = false;

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

const dagNodeTextureFactory = function(in_webglApi){
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
	uniform float u_reflect;
	uniform float u_scatter;
	uniform sampler2D u_sampler0;
	void main() {
		vec2 pos = vec2((v_uv.x - 0.5) * 2.0, (v_uv.y - 0.5) * 2.0);
		float radius = sqrt(dot(pos, pos));
		if (1.0 < radius)
		{
			discard;
		}
		vec4 texel = texture2D(u_sampler0, v_uv);
		gl_FragColor = texel;
	}
	`;

	const sVertexAttributeNameArray = ["a_position", "a_uv"];
	const sUniformArray = [
			in_webglApi.createShaderDataUniform("u_sampler0", sInt ),
			in_webglApi.createShaderDataUniform("u_reflect", sFloat ),
			in_webglApi.createShaderDataUniform("u_scatter", sFloat ),
	];

	const textureWidth = 256;
	const textureHeight= 256;
	const textureRGBData = new Uint8Array(textureWidth * textureHeight * 3);
	var trace = 0;
	for(var indexY = 0; indexY < textureHeight; ++indexY) {
		for(var indexX = 0; indexX < textureWidth; ++indexX) {
			textureRGBData[trace] = indexX; ++trace;
			textureRGBData[trace] = indexY; ++trace;
			var dot = (((indexX / (textureWidth - 1)) * 0.7071067811) + ((indexY / (textureHeight - 1)) * 0.7071067811));
			var value = (dot / 1.4142135623) * 255;
			var value2 = Math.max(0, Math.min(255, Math.round(value) ) );
			textureRGBData[trace] = value2; ++trace;
		}
	}

	//get ref to shader
	const m_shader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformArray );

	//make geom
	const m_geom = in_webglApi.createModel( "TRIANGLES", 6, {
		"a_position" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ -1, -1, -1, 1, 1, -1,   1, -1, -1, 1, 1, 1 ]), "STATIC_DRAW", false),
		"a_uv" : in_webglApi.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0,   1,0, 0,1, 1,1]), "STATIC_DRAW", false)
	});

	var m_textureArray = [ undefined ];
	var m_shaderUniformValueArray = [0, 1.0, 0.0];

	var result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, [0], m_textureArray, m_geom);
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

	var dagNodeTexture = dagNodeTextureFactory(webGLApi);
	var dagReflect = factoryDagNodeValue(0.95);
	var dagScatter = factoryDagNodeValue(0.1);

	const dagNodeRenderQuad = factoryDagNodeCalculate(dagCallbackRenderQuadFactory(webGLApi));
	linkIndex(dagNodeTexture, dagNodeRenderQuad, 0);
	linkIndex(dagReflect, dagNodeRenderQuad, 1);
	linkIndex(dagScatter, dagNodeRenderQuad, 2);
	link(dagNodeRenderQuad, dagNodeDisplayList);

	dagNodeDisplayList.getValue();

	const domLightInputWrapper = inputFactory(document, undefined, function(in_value){ 
		dagReflect.setValue(in_value); 
		dagNodeDisplayList.getValue();
	}, "number", dagReflect.getValue());
	document.body.appendChild(domLightInputWrapper.getElement());

	const domLodInputWrapper = inputFactory(document, undefined, function(in_value){ 
		dagScatter.setValue(in_value); 
		dagNodeDisplayList.getValue();
	}, "number", dagScatter.getValue());
	document.body.appendChild(domLodInputWrapper.getElement());


	return;
}	