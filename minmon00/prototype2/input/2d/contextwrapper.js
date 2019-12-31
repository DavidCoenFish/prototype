/*
wrap the 2d context out of a html5 canvas dom element
 */

const s_log2dCalls = false;

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

		//default "#000000"
		//"setFillStyle" : function(in_fillStyle){
		//	m_context2d.fillStyle  = in_fillStyle;
		//},

		//"setGlobalAlpha" :  function(in_alpha){
		//	m_context2d.globalAlpha  = in_alpha;
		//},

		//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
		/*
		darken,lighten,source-over(default),copy,...
		*/
		//"setGlobalCompositeOperation" : function(in_globalCompositeOperation){
		//	m_context2d.globalCompositeOperation = in_globalCompositeOperation;
		//},

		//https://developer.mozilla.org/en-US/docs/Web/CSS/font
		//"setFont" : function(in_font){
		//	m_context2d.font = in_font;
		//},

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

