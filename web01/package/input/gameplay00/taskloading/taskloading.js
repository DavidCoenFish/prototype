import {factory as factoryText} from "./../../manipulatedom/text.js";
import {factoryAppend as factoryDiv} from "./../../manipulatedom/div.js";
import {applyStyle} from "./../../manipulatedom/style.js";
import CelticKnotComponentFactory from "./celticknotcomponent.js";

//export const appendFactory = function(in_document, in_elementToAppend, in_text, in_styleOrUndefined){

export default function(in_webGLState, in_div, in_gameResourceManager, in_initialWeight){
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
	var m_loadingRequestedThisUpdate = undefined;
	var m_weight = in_initialWeight;

	const that = Object.create({
		"destroy" : function(){
			if (true === m_appended){
				in_div.removeChild(m_textDiv);
			}
		},
		"requestLoading" : function(){
			m_loadingRequestedThisUpdate = true;
		},
		"update" : function(in_timeDelta){
			if (undefined !== m_loadingRequestedThisUpdate){
				m_weight = Math.min(1.0, m_weight + (2.0 * in_timeDelta));
			} else {
				m_weight = Math.max(0.0, m_weight - (2.0 * in_timeDelta));
			}

			const append = (0.0 < m_weight);
			if (append !== m_appended){
				if (false === append){
					in_div.removeChild(m_textDiv);
				} else {
					in_div.appendChild(m_textDiv);
				}
				m_appended = append;
			}

			if (true === append){
				m_celticKnotComponent.draw(in_timeDelta, m_textDiv.clientWidth, m_textDiv.clientHeight, m_weight);
				applyStyle(m_textDiv, { "opacity" : m_weight } );
			}

			m_loadingRequestedThisUpdate = undefined;
		},
	});

	return that;
}
