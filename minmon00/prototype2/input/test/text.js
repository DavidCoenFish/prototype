import buttonFactory from './../dom/buttonfactory.js'
import canvasFactory from './../dom/canvasfactory.js'
import elementFactory from './../dom/elementfactory.js'
import inputFactory from './../dom/inputfactory.js'
import selectFactory from './../dom/selectfactory.js'
import textAreaFactory from './../dom/textareafactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'
import canvas2dAPIFactory from './../2d/apifactory.js'
import textManagerFactory from './../glyph/textmanager.js'

import { factoryDagNodeCalculate, linkIndex, link, unlink } from './../core/dagnode.js'
import {sRGBA, sUNSIGNED_BYTE} from './../webgl/texturetype'
import { sInt } from './../webgl/shaderuniformtype.js'

const s_logDagCalls = true;
var gWebGLApi;
var gContext2dApi;
var gDagNodeDisplayList;
var gDrawArray = [];
var gTextShader;
var gDagNodeGlyphTexture;
var gGlyphTextureChangeID;
var gTextManager;
var gGlyphTextureElement;

const UpdateDagGlyphTextureDirty = function(){
	var changeID = gTextManager.getTextureChangeID();
	if (changeID != gGlyphTextureChangeID){
		gGlyphTextureChangeID = changeID; 
		gDagNodeGlyphTexture.setDirty();
	}
}

const dagCallbackGlyphTextureFactory = function(in_webglApi){
	var m_texture = in_webglApi.createTextureElement(
		gGlyphTextureElement
		);

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray ){
		//TODO: debug start
		//var imageData = gContext2dApi.getImageData();
		//m_texture.updateDataCanvasElement(imageData.data);
		//TODO: debug end
		return m_texture;
	}
}

const dagCallbackCanvasRenderTargetFactory = function(in_webglApi){
	const result = Object.create({
		"activate" : function(){
			in_webglApi.clear(1.0, 1.0, 1.0, 1.0);
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

const sMaskData = [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1],
];

const appendVertex = function(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, in_posX, in_posY, in_uvX, in_uvY, in_mask){
	inout_positionDataArray.push(in_posX);
	inout_positionDataArray.push(in_posY);
	inout_uvDataArray.push(in_uvX);
	inout_uvDataArray.push(in_uvY);
	inout_maskDataArray.push(in_mask[0]);
	inout_maskDataArray.push(in_mask[1]);
	inout_maskDataArray.push(in_mask[2]);
	inout_cursor.geomElementCount += 1;
}

const appendTextData = function(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, in_textData){
	var pos = in_textData.getPos();

	//in_textData
	// "actualBoundingBoxLeft" : in_actualBoundingBoxLeft,
	// "actualBoundingBoxAscent" : in_actualBoundingBoxAscent
	//pos
	// "x" : in_x,
	// "y" : in_y,
	// "width" : in_requestWidth,
	// "height" : in_requestHeight,
	// "index" : in_index,
	const textureWidth = 256;
	const textureHeight = 256;

	var posX1 = -1; //(((inout_cursor.traceX - in_textData.actualBoundingBoxLeft) / textureWidth) * 2.0) - 0.0;
	var posX2 = 1; //(((inout_cursor.traceX - in_textData.actualBoundingBoxLeft + pos.width) / textureWidth) * 2.0) - 0.0;
	var posY1 = -1; //-((((inout_cursor.traceY - in_textData.actualBoundingBoxAscent) / textureHeight) * 2.0) - 0.0);
	var posY2 = 1; //-((((inout_cursor.traceY - in_textData.actualBoundingBoxAscent + pos.height) / textureHeight) * 2.0) - 0.0);

	var uvX1 = 0; //(pos.x) / textureWidth;
	var uvX2 = 1; //(pos.x + pos.width) / textureWidth;
	var uvY1 = 0; //1.0 - ((pos.y) / textureHeight);
	var uvY2 = 1; //1.0 - ((pos.y + pos.height) / textureHeight);

	var maskData = sMaskData[pos.index];

	appendVertex(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, posX1, posY1, uvX1, uvY1, maskData);
	appendVertex(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, posX2, posY1, uvX2, uvY1, maskData);
	appendVertex(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, posX2, posY2, uvX2, uvY2, maskData);

	appendVertex(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, posX1, posY1, uvX1, uvY1, maskData);
	appendVertex(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, posX2, posY2, uvX2, uvY2, maskData);
	appendVertex(inout_positionDataArray, inout_uvDataArray, inout_maskDataArray, inout_cursor, posX1, posY2, uvX1, uvY2, maskData);

	inout_cursor.traceX += in_textData.cursorAdvance;
}

const dagCallbackTextDraw = function(in_webglApi, in_textData){
	const sVertexShader = `
	attribute vec2 a_position;
	attribute vec2 a_uv;
	attribute vec3 a_mask;
	varying vec2 v_uv;
	varying vec3 v_mask;
	void main() {
		v_uv = a_uv;
		v_mask = a_mask;
		gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
	}
	`;

	const sFragmentShader = `
	precision mediump float;
	varying vec2 v_uv;
	varying vec3 v_mask;
	uniform sampler2D u_sampler0;
	void main() {
		vec4 texel = texture2D(u_sampler0, v_uv);
		float value = 1.0 - dot(texel.xyz, v_mask);
		gl_FragColor = vec4(v_uv.x, v_uv.y, (texel.x + texel.y) * 0.5, 1.0);
		//gl_FragColor = vec4(texel.x, texel.y, texel.z, 1.0);
	}
	`;

	const sVertexAttributeNameArray = ["a_position", "a_uv", "a_mask"];
	const sUniformArray = [
			in_webglApi.createShaderDataUniform("u_sampler0", sInt )
	];


	//get ref to shader
	if (undefined === gTextShader){
		gTextShader = in_webglApi.createShader( sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformArray );
	}

	//make geom
	var positionDataArray = [];
	var uvDataArray = [];
	var maskDataArray = [];

	var arrayLength = in_textData.length;
	var cursor = {
		traceX : 0.0,
		traceY : 0.0,
		geomElementCount : 0
	};
	for (var index = 0; index < arrayLength; index++) {
		var textData = in_textData[index];
		appendTextData(positionDataArray, uvDataArray, maskDataArray, cursor, textData);
	}

	const m_geom = in_webglApi.createModel( "TRIANGLES", cursor.geomElementCount, {
		"a_position" : in_webglApi.createModelAttribute("FLOAT", 2, new Float32Array(positionDataArray), "STATIC_DRAW", false),
		"a_uv" : in_webglApi.createModelAttribute("FLOAT", 2, new Float32Array(uvDataArray), "STATIC_DRAW", false),
		"a_mask" : in_webglApi.createModelAttribute("BYTE", 3, new Int8Array(maskDataArray), "STATIC_DRAW", true)
	});

	var m_textureArray = [ undefined ];

	const result = Object.create({
		"draw" : function(){
			if ((s_logDagCalls) && (DEVELOPMENT)){
				console.log("RenderQuad::draw");
			}

			in_webglApi.draw(gTextShader, [0], m_textureArray, m_geom);
		}
	})

	return function(in_calculatedValue, in_inputIndexArray, in_inputArray){
		m_textureArray[0] = in_inputIndexArray[0];
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

const MakeTextDraw = function(in_textData){
	const dagNodeTextDraw = factoryDagNodeCalculate(dagCallbackTextDraw(gWebGLApi, in_textData.getGlyphDataArray()));
	link(dagNodeTextDraw, gDagNodeDisplayList);
	gDrawArray.push(dagNodeTextDraw);
	dagNodeTextDraw.m_text = in_textData;

	linkIndex(gDagNodeGlyphTexture, dagNodeTextDraw, 0);

	//redraw
	gDagNodeDisplayList.getValue();
}

const ClearTextDraw = function(){
	var arrayLength = gDrawArray.length;
	for (var index = 0; index < arrayLength; index++) {
		var dagNodeTextDraw = gDrawArray[index];
		//Do something
		unlink(dagNodeTextDraw, gDagNodeDisplayList);
		dagNodeTextDraw.m_text.destroy();
	}
	gDagNodeDisplayList.getValue();
}

const PrepContextWebgl = function(in_divWrapper){
	const html5CanvasWebGLWrapper = canvasFactory(document, 
	{
		"width" : "256px",
		"height" : "256px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	in_divWrapper.getElement().appendChild(html5CanvasWebGLWrapper.getElement());
	html5CanvasWebGLWrapper.onResize();
	gWebGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), undefined, false);

	//gWebGLApi.clear(1.0, 1.0, 1.0, 1.0);

	//make a dag node system to render display list, and have any appended text added to display list
	// textManager is inside a dag node?
	gDagNodeGlyphTexture = factoryDagNodeCalculate(dagCallbackGlyphTextureFactory(gWebGLApi));

	const dagNodeCanvasRenderTarget = factoryDagNodeCalculate(dagCallbackCanvasRenderTargetFactory(gWebGLApi));

	gDagNodeDisplayList = factoryDagNodeCalculate(dagCallbackDisplayList);
	linkIndex(dagNodeCanvasRenderTarget, gDagNodeDisplayList, 0);

	gDagNodeDisplayList.getValue();
}

const PrepContext2d = function(in_divWrapper){
	const html5CanvasTextWrapper = canvasFactory(document, 
	{
		"width" : "256px",
		"height" : "256px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "10,0,0,0",
		"padding" : "0",
		"display" : "block"
	}
	);
	gGlyphTextureElement = html5CanvasTextWrapper.getElement();

	in_divWrapper.getElement().appendChild(html5CanvasTextWrapper.getElement());
	html5CanvasTextWrapper.onResize();

	const canvas2dApi = canvas2dAPIFactory(html5CanvasTextWrapper.getElement());
	gContext2dApi = canvas2dApi;

	gTextManager = textManagerFactory(canvas2dApi);

	if (DEVELOPMENT){
		canvas2dApi.drawRect(0, 0, 256, 128, { "fillStyle" : "#FF0" });
		canvas2dApi.drawRect(0, 128, 256, 128, { "fillStyle" : "#0FF" });
	}

	const formWrapper = elementFactory(document, "DIV"); //FORM");
	document.body.appendChild(formWrapper.getElement());

	var m_text = "hello world"; // \uD83D\uDC36";
	const textArea = textAreaFactory(document, undefined, function(in_text){
		m_text = in_text;
	}, m_text);
	formWrapper.getElement().appendChild(textArea.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	//	canvas2dApi.drawText("hello world", 128, 128);

	const buttonAppend = buttonFactory(document, undefined, function(){
		var font = m_font;
		if ("custom" == font){
			font = m_customFont;
		}
		var textData = gTextManager.createString(m_text, font);
		UpdateDagGlyphTextureDirty();
		MakeTextDraw(textData);
	}, "append");
	formWrapper.getElement().appendChild(buttonAppend.getElement());
	const buttonClear = buttonFactory(document, undefined, function(){ 
		ClearTextDraw();
		gTextManager.clear();
		// var arrayLength = m_textDataArray.length;
		// for (var index = 0; index < arrayLength; index++) {
		// 	m_textDataArray[index].destroy();
		// }
	}, "clear");
	formWrapper.getElement().appendChild(buttonClear.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	var m_font = "custom";
	const selectFont = selectFactory(document, undefined, function(in_index, in_text){ 
		console.log("selection change", in_index, in_text); 
		m_font = in_text;
		}, ["caption", "icon", "menu", "message-box", "small-caption", "status-bar", "custom"], m_font);
	formWrapper.getElement().appendChild(selectFont.getElement());

	const addSpace = function(in_text){
		if (in_text != ""){
			return in_text + " ";
		}
		return in_text;
	}

	var m_customFont = "";
	const updateCustomFont = function(){
		m_customFont = "";
		if ("none" != m_fontStyle){
			m_customFont += m_fontStyle;
		}
		if ("none" != m_fontVariant){
			m_customFont = addSpace(m_customFont);
			m_customFont += m_fontVariant;
		}
		if ("none" != m_fontWeight){
			m_customFont = addSpace(m_customFont);
			m_customFont += m_fontWeight;
		}
		m_customFont = addSpace(m_customFont);
		m_customFont += m_fontSize + "px";

		m_customFont = addSpace(m_customFont);
		m_customFont += m_fontFamily;
		m_textNode.nodeValue = m_customFont;
	}
	var m_fontStyle = "none";
	var fontStyle = selectFactory(document, undefined, function(in_index, in_text){
		m_fontStyle = in_text;
		updateCustomFont();
	}, [ "none", "normal", "italic", "oblique"], m_fontStyle );
	formWrapper.getElement().appendChild(fontStyle.getElement());

	var m_fontVariant = "none";
	var fontVariant = selectFactory(document, undefined, function(in_index, in_text){
		m_fontVariant = in_text;
		updateCustomFont();
	}, [ "none", "normal", "small-caps"], m_fontVariant );
	formWrapper.getElement().appendChild(fontVariant.getElement());

	var m_fontWeight = "none";
	var fontWeight = selectFactory(document, undefined, function(in_index, in_text){
		m_fontWeight = in_text;
		updateCustomFont();
	}, [ "none", "100", "200", "300", "400", "500", "600", "700", "800", "900" ], m_fontVariant );
	formWrapper.getElement().appendChild(fontWeight.getElement());

	var m_fontSize = 50; //10;
	const numberFontSize = inputFactory(document, undefined, function(in_value){ 
		m_fontSize = in_value; 
		updateCustomFont();
	}, "number", m_fontSize);
	formWrapper.getElement().appendChild(numberFontSize.getElement());

	var m_fontFamily = "sans-serif";
	var fontFamily = selectFactory(document, undefined, function(in_index, in_text){
		m_fontFamily = in_text;
		updateCustomFont();
	}, [ "courier", "serif", "sans-serif", "Arial", "monospace", "cursive", "fantasy", "system-ui" ], m_fontFamily );
	formWrapper.getElement().appendChild(fontFamily.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	const m_textNode = document.createTextNode(m_customFont);
	formWrapper.getElement().appendChild(m_textNode);

	updateCustomFont();

	// {
	// 	var font = m_font;
	// 	if ("custom" == font){
	// 		font = m_customFont;
	// 	}

	// 	RunMeasureTest(canvas2dApi, font);
	// }
}

const RunMeasureTest = function(in_canvas2dApi, in_font){
	const doTheThing = function(in_text){
		var measure = in_canvas2dApi.measureText(in_text, { "font" : in_font });
		console.log(in_text);
		console.log(measure);
	}
	doTheThing("A");
	doTheThing("a");
	doTheThing("AA");
	doTheThing("AaA");
}

export default function () {
	const divWrapper = elementFactory(document, "DIV", {
		"display" : "flex"
	});
	document.body.appendChild(divWrapper.getElement());

	PrepContext2d(divWrapper);
	PrepContextWebgl(divWrapper);

	return;
}	