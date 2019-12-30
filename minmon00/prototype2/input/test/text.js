import buttonFactory from './../dom/buttonfactory.js'
import canvasFactory from './../dom/canvasfactory.js'
import elementFactory from './../dom/elementfactory.js'
import inputFactory from './../dom/inputfactory.js'
import selectFactory from './../dom/selectfactory.js'
import webGLAPIFactory from './../webgl/apifactory.js'
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
	}
	);
	divWrapper.getElement().appendChild(html5CanvasWebGLWrapper.getElement());

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

	const webGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), undefined, false);

	const formWrapper = elementFactory(document, "DIV"); //FORM");
	document.body.appendChild(formWrapper.getElement());

	const textAreaText = elementFactory(document, "TEXTAREA");
	formWrapper.getElement().appendChild(textAreaText.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	const buttonAppend = buttonFactory(document, undefined, function(){ console.log("button press"); }, "append");
	formWrapper.getElement().appendChild(buttonAppend.getElement());
	const buttonClear = buttonFactory(document, undefined, function(){ console.log("button press"); }, "clear");
	formWrapper.getElement().appendChild(buttonClear.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	const selectFont = selectFactory(document, undefined, function(in_index, in_text){ console.log("selection change", in_index, in_text); }, ["a", "b", "some long text"]);
	formWrapper.getElement().appendChild(selectFont.getElement());
	const numberFontSize = inputFactory(document, undefined, function(in_value){ console.log("selection change", in_value); }, "number", 23);
	formWrapper.getElement().appendChild(numberFontSize.getElement());
	formWrapper.getElement().appendChild(elementFactory(document, "BR").getElement());	

	return;
}	