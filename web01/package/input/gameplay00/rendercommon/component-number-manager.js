/* 
	var m_dynamicNumberArray = [];
	for (var index = 0; index < 24; ++index){
		var temp = index / 24.0;
		m_dynamicNumberArray.push({
			"m_sphere" : Vector4FactoryFloat32(Math.cos(temp * Math.PI * 2.0) * 3.0, Math.sin(temp * Math.PI * 2.0) * 3.0, 3.0, 0.5),
			"m_data" : Vector4FactoryFloat32(index % 5.0, 0.0, 0.5, index % 10.0)
			});

*/

export default function(in_state){
	

	//public methods ==========================
	const that = Object.create({
		"update" : function(in_timeDelta){
			return;
		},
		"requestNumber" : function(in_digit, in_scale, in_position){
		},
		"destroy" : function(){
			return;
		}
	})

	return that;
}
