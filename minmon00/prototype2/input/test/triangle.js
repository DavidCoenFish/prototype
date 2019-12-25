import canvasFactory from './../dom/canvasfactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'
import { factoryDagNodeCalculate, linkIndex, link } from './../core/dagnode.js'
//import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from './../webgl/shader.js'

const dagCallbackCanvasRenderTargetFactory = function(in_webglApi){
	const result = Object.create({
		"activate" : function(){
			in_webglApi.clear(1.0, 0.0, 0.0);
		},
		"getTexture" : function(){
			return undefined;
		}
		//increment?
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		return result;
	}
}

const dagCallbackDisplayList = function(in_calculatedValue, in_inputIndexArray, in_inputArray){
	in_inputIndexArray[0].activate();
	in_inputArray.forEach(function(item){
		item.draw();
	});
	return undefined;
}

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

const dagCallbackRenderTriangleFactory = function(in_webglApi){
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

	//construct a dag nod system that results in a triangle being drawn

	// want a dag nod, that when you call getValue on it, it renders to screen
	const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(webGLApi));

	const dagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
	linkIndex(dagNodeCanvasRenderTarget, dagNodeDisplayList, 0);
	const dagNodeRenderTriangle = factoryDagNodeCalculate(dagCallbackRenderTriangleFactory(webGLApi));
	link(dagNodeRenderTriangle, dagNodeDisplayList);

	dagNodeDisplayList.getValue();

	return;
}