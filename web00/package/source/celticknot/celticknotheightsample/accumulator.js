/*
	certain regions of the celtic knot can be overlapped by other regions
	rather than do this physically, we do it abstractly and have a max negative component
 */

const factory = function(in_backgroundHeight){
	var m_knotHeight = undefined; //zero to positive
	var m_subtractKnotHeight = 0.0; //zero to positive
	var m_backgroundHeight = in_backgroundHeight;
	var m_subtractBackgroundHeight = 0.0; //zero to positive

	const result = Object.create({
		"setKnotHeight" : function(in_height){
			if (undefined === m_knotHeight){
				m_knotHeight = in_height;
			} else {
				m_knotHeight = Math.max(m_knotHeight, in_height);
			}
			return;
		},
		"setSubtractKnotHeight" : function(in_height){
			m_subtractKnotHeight = Math.max(m_subtractKnotHeight, in_height);
		},
		"setSubtractBackgroundHeight" : function(in_height){
			m_subtractBackgroundHeight = Math.max(m_subtractBackgroundHeight, in_height);
		},
		
		"getHeight" : function(){
			if (undefined === m_knotHeight){
				return m_backgroundHeight - m_subtractBackgroundHeight;
			}
			return m_knotHeight - m_subtractKnotHeight;
		},
	});

	return result;
}

module.exports = {
	"factory" : factory,
};
