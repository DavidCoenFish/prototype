import {factoryAppendElement as divFactory} from './../manipulatedom/div.js';

export const factory = function( in_document, in_parentElement, in_dataServer ){
	var m_div = divFactory(in_document, in_parentElement, {
		"position" : "absolute",
		"background-color" : "black",
		"opacity" : 0.5,
		"width" : "100%",
		"height" : "100%",
	});

	const result = Object.create({
		"update" : function(){
			m_div.style.opacity = in_dataServer.getValue();
		},
		"destroy" : function(){
			in_parentElement.removeChild(m_div);
		}
	});

	return result;

}