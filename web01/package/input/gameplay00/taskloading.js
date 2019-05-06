import {factory as factoryText} from "./../../manipulatedom/text.js";
import {factoryAppend as factoryDiv} from "./../../manipulatedom/div.js";
import CelticKnotComponentFactory from "./celticknotcomponent.js";

//export const appendFactory = function(in_document, in_elementToAppend, in_text, in_styleOrUndefined){

export default function(in_webGLState, in_div, in_gameResourceManager){
	var m_textDiv = factoryDiv(document, in_div, {
		"position": "fixed",
		"top":"50%",
		"left":"50%",
		"transform":"translate(-50%,-50%)",
		"padding":"1em",
		"backgroundColor" : "#FFFFFF"
	});
	var text = in_gameResourceManager.getLocalisedString("loading...");
	m_textDiv.appendChild(factoryText(document, text));
	var m_appended = true;
	var m_celticKnotComponent = CelticKnotComponentFactory(in_gameResourceManager.getResourceManager(), in_webGLState, 32, 32);

	const that = Object.create({
		"destroy" : function(){
			in_div.removeChild(m_textDiv);
		},
		"update" : function(in_timeDelta, in_loadingWeight){
			const append = ((undefined !== in_loadingWeight) && (0.0 < in_loadingWeight));
			if (append !== m_appended){
				if (false === append){
					in_div.removeChild(m_textDiv);
				} else {
					in_div.appendChild(m_textDiv);
				}
				m_appended = append;
			}

			if (true === append){
				m_celticKnotComponent.draw(in_timeDelta, m_textDiv.clientWidth, m_textDiv.clientHeight, in_loadingWeight);
			}
		},
	});

	return that;
}
