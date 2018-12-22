/*
	certain regions of the celtic knot can be overlapped by other regions
	rather than do this physically, we do it abstractly and have a max negative component
 */

const factory = function(){
	var m_height = 0.0; //zero to positive
	var m_subtractHeight = 0.0; //zero to negative

	const result = Object.create({
		"setHeight" : function(in_height){
			m_height = Math.max(m_height, in_height);
			return;
		},
		"setSubtractHeight" : function(in_height){
			m_subtractHeight = Math.max(m_subtractHeight, in_height);
		},
		"getHeight" : function(){
			var value = m_height - m_subtractHeight;
			return value;
		},
	});

	return result;
}

module.exports = {
	"factory" : factory,
};
