/*
wrap the 2d context out of a html5 canvas dom element
 */

const get2dContext = function(in_html5CanvasElement){
	if (undefined === in_html5CanvasElement) {
		throw("Canvas element not found");
	} 

	var context2d = in_html5CanvasElement.getContext("2d");

	return context2d;
}

export default function(
	in_html5CanvasElement
	){
	//private members ==========================

	var m_context2d = get2dContext(in_html5CanvasElement);

	//public methods ==========================
	const that = Object.create({
		"getContext" : function(){
			return m_context2d;
		},

		//https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
		"measureText" : function(in_text){
			return m_context2d.measureText(in_text);
		},

		"drawText" : function(in_text, in_x, in_y){
			return m_context2d.fillText(in_text, in_x, in_y);
		},

		"drawRect" : function(in_x, in_y, in_width, in_height){
			return m_context2d.fillRect(in_x, in_y, in_width, in_height);
		},

		"getCanvasWidth" : function(){
			return in_html5CanvasElement.width;
		},

		"getCanvasHeight" : function(){
			return in_html5CanvasElement.height;
		}

	});

	return that;
}

