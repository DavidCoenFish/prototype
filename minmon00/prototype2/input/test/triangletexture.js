import canvasFactory from './../dom/canvasfactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'
import { factoryDagNodeCalculate, linkIndex, link } from './../core/dagnode.js'
import {sRGB, sRGBA, sUNSIGNED_BYTE} from './../webgl/texturetype'
import { sInt } from './../webgl/shaderuniformtype.js'

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
	uniform sampler2D u_sampler0;
	void main() {
		vec4 texel = texture2D(u_sampler0, v_uv);
		//texel = vec4(v_uv.x, v_uv.y, 0.0, 1.0);
		texel.w = 1.0;
		gl_FragColor = texel;
	}
	`;

	const shaderManager = in_webglApi.getShaderManager();
	const sVertexAttributeNameArray = ["a_position", "a_uv"];
	const sUniformArray = [
			shaderManager.createShaderDataUniform("u_sampler0", sInt ),
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

	const m_texture = in_webglApi.createTexture(
		textureWidth, 
		textureHeight, 
		"RGB",
		"RGB",
		"UNSIGNED_BYTE",
		textureRGBData
		);

	//get ref to shader
	const m_shader = shaderManager.getShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformArray );

	//make geom
	const geometryManager = in_webglApi.getGeometryManager();
	const m_geom =  geometryManager.createModel( "TRIANGLES", 3, {
		"a_position" :  geometryManager.createModelAttribute("BYTE", 2, new Int8Array([ -1,-1, -1,1, 1,-1]), "STATIC_DRAW", false),
		"a_uv" :  geometryManager.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0]), "STATIC_DRAW", false)
	});

	var m_textureArray = [ m_texture ];

	var result = Object.create({
		"draw" : function(){
			in_webglApi.draw(m_shader, [0], m_textureArray, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
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

	if (true){
		const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(webGLApi));
		const dagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
		linkIndex(dagNodeCanvasRenderTarget, dagNodeDisplayList, 0);
		const dagNodeRenderTriangle = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi));
		link(dagNodeRenderTriangle, dagNodeDisplayList);
		dagNodeDisplayList.getValue();
	} else {
		var program;
		var texture;

		var vsSource = `
		attribute vec3 a_position;
		attribute vec2 a_uv;

		varying vec2 texCoord;

		void main(void) {
		gl_Position = vec4(a_position, 1.0);
		texCoord = a_uv;
		}
		`;

		var fsSource = `
		precision mediump float;
		uniform sampler2D u_sampler0;
		varying vec2 texCoord;

		void main(void) {
		gl_FragColor = texture2D(u_sampler0, texCoord);
		}
		`;
		const sVertexAttributeNameArray = ["a_position", "a_uv"];
		const sUniformArray = [
			webGLApi.createShaderDataUniform("u_sampler0", sInt ),
		];

		webGLApi.clear(0.0, 1.0, 0.0, 1.0);

		var m_texture;
		{
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

			m_texture = webGLApi.createTexture(
				textureWidth, 
				textureHeight, 
				"RGB",
				"RGB",
				"UNSIGNED_BYTE",
				textureRGBData
				);
		};

		const shaderManager = in_webglApi.getShaderManager();
		const m_shader = shaderManager.getShader( vsSource, fsSource, sVertexAttributeNameArray, sUniformArray );

		const geometryManager = in_webglApi.getGeometryManager();
		const m_geom = geometryManager.createModel( "TRIANGLES", 3, {
			"a_position" : geometryManager.createModelAttribute("BYTE", 2, new Int8Array([ -1,-1, -1,1, 1,-1]), "STATIC_DRAW", false),
			"a_uv" : geometryManager.createModelAttribute("BYTE", 2, new Int8Array([ 0,0, 0,1, 1,0]), "STATIC_DRAW", false)
		});

		webGLApi.draw(
			m_shader, 
			[0], 
			[m_texture],
			m_geom
		);
	}

	return;
}