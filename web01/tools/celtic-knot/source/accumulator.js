/*
	translate distance into colour/ alpha
 */
const distanceThreshold = Math.sqrt((Math.sqrt(0.25 * 0.25)) / 2.0) / 2.0;
const edgeThickness = 0.75 / 32.0;

const factory = function(){
	var m_distance;
	const that = Object.create({
		"setDistance" : function(in_distance){
			if (undefined === m_distance){
				m_distance = in_distance;
			} else {
				m_distance = Math.min(m_distance, in_distance);
			}
			return;
		},
		"getColour" : function(){
			if (undefined === m_distance){
				return 1.0;
			}
			var temp = Math.abs(m_distance - distanceThreshold);
			return (temp < edgeThickness) ? 0.0 : 1.0;
		},
		"getAlpha" : function(){
			if (undefined === m_distance){
				return 0.0;
			}
			return (m_distance <= distanceThreshold) ? 1.0 : 0.0;
		},
	});
	return that;
}


module.exports = {
	"factory" : factory,
};
