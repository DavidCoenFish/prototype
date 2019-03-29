export const factory = function(in_document, in_width, in_height){
	var m_element = in_document.createElement("CANVAS");

	m_element.setAttribute("style",`display:block;width:${in_width}px;height:${in_height}px`);
	m_element.style.width=`${in_width}px`;
	m_element.style.height=`${in_height}px`;
	m_element.width = in_width;
	m_element.height = in_height;

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
	});

	return that;
}

export const factoryAppendBody = function(in_document, in_width, in_height){
	var result = factory(in_document, in_width, in_height);
	in_document.body.appendChild(result.getElement());
	return result;
}
