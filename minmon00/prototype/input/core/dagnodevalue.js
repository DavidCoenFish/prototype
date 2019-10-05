export const factory = function(in_value){
	var m_value = in_value;
	const result = Object.create({
		"getValue" : function(){
			return m_value;
		},
		"setValue" : function(in_value){
			m_value = in_value;
			return;
		}
	})
	return result;
}