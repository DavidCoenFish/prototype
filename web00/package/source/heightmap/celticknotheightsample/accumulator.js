/*
	certain regions of the celtic knot can be overlapped by other regions
	rather than do this physically, we do it abstractly and have a max negative component
 */

const factory = function(){
	var m_noSubtractHeight = 0.0; //zero to positive
	var m_canSubtractHeight = 0.0; //zero to positive
	var m_subtractHeight = 0.0; //zero to negative

	const result = Object.create({
		"setNoSubtractHeight" : function(in_height){
			m_noSubtractHeight = Math.max(m_noSubtractHeight, in_height);
			return;
		},
		"setCanSubtractHeight" : function(in_height){
			m_canSubtractHeight = Math.max(m_canSubtractHeight, in_height);
			return;
		},
		"setSubtractHeight" : function(in_height){
			m_subtractHeight = Math.min(m_subtractHeight, in_height);
		},
		"getHeight" : function(){
			var value = Math.max(m_noSubtractHeight, (m_canSubtractHeight + m_subtractHeight));
		},
	});

	return result;
}

module.exports = {
	"factory" : factory,
};
