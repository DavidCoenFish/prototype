import buttonFactory from './../dom/buttonfactory.js'
import canvasFactory from './../dom/canvasfactory.js'
import elementFactory from './../dom/elementfactory.js'
import inputFactory from './../dom/inputfactory.js'
import selectFactory from './../dom/selectfactory.js'
import textAreaFactory from './../dom/textareafactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'
import canvas2dAPIFactory from './../2d/apifactory.js'
import textManagerFactory from './../glyph/textmanager.js'

import { factoryDagNodeCalculate, linkIndex, link } from './../core/dagnode.js'
import {sRGBA, sUNSIGNED_BYTE} from './../webgl/texturetype'
import { sInt } from './../webgl/shaderuniformtype.js'

const s_logDagCalls = true;

/*

*/

export default function () {
	const divWrapper = elementFactory(document, "DIV", {
		"display" : "flex"
	});
	document.body.appendChild(divWrapper.getElement());

	//document.createElement("DIV");
	//
	const html5CanvasWebGLWrapper = canvasFactory(document, 
	{
		"width" : "256px",
		"height" : "256px",
		"backgroundColor" : "#FFFFFF",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	divWrapper.getElement().appendChild(html5CanvasWebGLWrapper.getElement());
	html5CanvasWebGLWrapper.onResize();

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
	divWrapper.getElement().appendChild(html5CanvasTextWrapper.getElement());
	html5CanvasTextWrapper.onResize();

	const webGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), undefined, false);
	const canvas2dApi = canvas2dAPIFactory(html5CanvasTextWrapper.getElement());

	const textManager = textManagerFactory(canvas2dApi);

	const formWrapper = elementFactory(document, "DIV"); //FORM");
	document.body.appendChild(formWrapper.getElement());

	var m_text = "hello world \uD83D\uDC36";
	const textArea = textAreaFactory(document, undefined, function(in_text){
		m_text = in_text;
	}, m_text);
	formWrapper.getElement().appendChild(textArea.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	//	canvas2dApi.drawText("hello world", 128, 128);

	var m_textDataArray = [];
	const buttonAppend = buttonFactory(document, undefined, function(){
		var font = m_font;
		if ("custom" == font){
			font = m_customFont;
		}
		//canvas2dApi.drawText(m_text,128,128,{"font" : font});
		m_textDataArray.push(textManager.createString(m_text, font));
	 }, "append");
	formWrapper.getElement().appendChild(buttonAppend.getElement());
	const buttonClear = buttonFactory(document, undefined, function(){ 
		//canvas2dApi.drawRect(0,0,256,256,{"fillStyle" : "#FFF"});

		textManager.clear();
		// var arrayLength = m_textDataArray.length;
		// for (var index = 0; index < arrayLength; index++) {
		// 	m_textDataArray[index].destroy();
		// }
		m_textDataArray = [];
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

	return;
}	