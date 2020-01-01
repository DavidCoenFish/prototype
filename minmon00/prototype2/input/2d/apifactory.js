import ContextWrapperFactory from "./contextwrapper.js"
import StateFactory from "./state.js"

export default function(
	in_html5CanvasElement
){
	var m_contextWrapper = ContextWrapperFactory(in_html5CanvasElement);

	var m_state = StateFactory(m_contextWrapper);

	const that = Object.create({
		// state has the font
		"measureText" : function(in_text, in_stateOrUndefined){
			m_state.activateMeasureText(in_stateOrUndefined);
			return m_contextWrapper.measureText(in_text);
		},
		// state has the "fillStyle", "globalAlpha", "globalCompositeOperation", "font"
		"drawText" : function(in_text, in_x, in_y, in_stateOrUndefined){
			m_state.activateDrawText(in_stateOrUndefined);
			m_contextWrapper.drawText(in_text, in_x, in_y);
			return;
		},

		// state has the "fillStyle", "globalAlpha", "globalCompositeOperation"
		"drawRect" : function(in_x,in_y,in_width,in_height,in_stateOrUndefined){
			m_state.activateDrawRect(in_stateOrUndefined);
			m_contextWrapper.drawRect(in_x,in_y,in_width,in_height);
		},

		"getCanvasWidth" : function(){
			return m_contextWrapper.getCanvasWidth();
		},

		"getCanvasHeight" : function(){
			return m_contextWrapper.getCanvasHeight();
		},

		"getContext" : function(){
			return m_contextWrapper.getContext();
		},

		//"getElement" : function(){
		//	return in_html5CanvasElement;
		//},

		"destroy" : function(){
			//m_webGLState.destroy();
		},
	});

	return that;
}

