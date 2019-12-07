import applyStyle from './applystyle.js';

export default function(in_document, in_canvasStyleDictionaryOrUndefined){
	var m_element = in_document.createElement("CANVAS");

	applyStyle(m_element, in_canvasStyleDictionaryOrUndefined);

	//public methods ==========================
	const that = Object.create({
		"getElement" : function(){
			return m_element;
		}
	});

	const resizeObserver = new ResizeObserver(entries => {
		// for (let entry of entries) {
		// 	console.log("entry:" + entry);
		// }
		// console.log("resizeObserver:" + m_element.offsetWidth + " " + m_element.offsetHeight);
		m_element.width = m_element.offsetWidth;
		m_element.height = m_element.offsetHeight;
	});

	resizeObserver.observe(m_element);	

	return that;
}

// export const factoryAppendElement = function(in_document, in_parent, in_canvasStyleDictionaryOrUndefined){
// 	var result = factory(in_document, in_canvasStyleDictionaryOrUndefined);
// 	var element = result.getElement();
// 	in_parent.appendChild(element);
// 	result.onResize();
// 	return result;
// }
