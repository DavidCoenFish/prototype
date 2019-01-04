const factory = function(in_document){
	var m_timeStamp = undefined;
	var m_textElement = in_document.createTextNode("");
	var m_div = in_document.createElement("DIV");
	m_div.appendChild(m_textElement);

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_timeStamp){
			if (undefined !== m_timeStamp){
				const timeDelta = in_timeStamp - m_timeStamp;
				if (0.0 !== timeDelta){
					m_textElement.textContent = "" + Math.round(100000.0 / timeDelta) / 100 + "fps";
				}
			}
			m_timeStamp = in_timeStamp;
			return;
		},
		"getElement" : function(){
			return m_div;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory
};
