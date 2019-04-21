/*
 */
export default function(in_targetElement, in_callbackArray){
	var m_x = undefined;
	var m_y = undefined;
	var m_deltaX = 0.0;
	var m_deltaY = 0.0;
	var m_leftButtonDown = false;

	const setNew = function(in_x, in_y){
		if (undefined !== m_x){
			m_deltaX = in_x - m_x;
		}
		if (undefined !== m_y){
			m_deltaY = in_y - m_y;
		}
		m_x = in_x;
		m_y = in_y;

		in_callbackArray.forEach(function(item){
			item(m_x, m_y, m_deltaX, m_deltaY);
		});

		return;
	}


	//https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
	const mouseMoveCallback = function(in_event){
		//m_lmb = (0 !== (in_event.buttons & 1));

		in_event = in_event || window.event; // IE-ism

		// If pageX/Y aren't available and clientX/Y are,
		// calculate pageX/Y - logic taken from jQuery.
		// (This is to support old IE)
		if (in_event.pageX == null && in_event.clientX != null) {
			var eventDoc = (in_event.target && in_event.target.ownerDocument) || document;
			var doc = eventDoc.documentElement;
			var body = eventDoc.body;

			in_event.pageX = in_event.clientX +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0);
			in_event.pageY = in_event.clientY +
				(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
				(doc && doc.clientTop  || body && body.clientTop  || 0 );
		}

		// Use event.pageX / event.pageY here
		setNew(in_event.pageX, in_event.pageY);

		return;
	}


	const mouseDownCallback = function(in_event){
		//console.log("mouseDownCallback:" + in_event.buttons);
		if (1 === (in_event.buttons & 1)){
			m_leftButtonDown = true;
		}
	}

	const mouseUpCallback = function(in_event){
		//console.log("mouseUpCallback:" + in_event.buttons);
		if (0 === (in_event.buttons & 1)){
			m_leftButtonDown = false;
		}
	}

	//public methods ==========================
	const that = Object.create({
		"destroy" : function(){
			in_targetElement.removeEventListener("mousemove", mouseMoveCallback);
			in_targetElement.removeEventListener("mousedown", mouseDownCallback);
			in_targetElement.removeEventListener("mouseup", mouseUpCallback);
			return;
		},
		"getX" : function(){
			return m_x;
		},
		"getY" : function(){
			return m_y;
		},
		"getLeftButtonDown" : function(){
			return m_leftButtonDown;
		}
	});

	in_targetElement.addEventListener("mousemove", mouseMoveCallback);
	in_targetElement.addEventListener("mousedown", mouseDownCallback);
	in_targetElement.addEventListener("mouseup", mouseUpCallback);

	return that;
}
