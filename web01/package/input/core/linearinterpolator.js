/*
linear interpolate to a value over time
jump to value if time is zero, needs to be ticked
 */
export const factory = function(in_value){
	var m_value = in_value;
	var m_step = undefined;
	var m_target = undefined;
	const that = Object.create({
		"tick" : function(in_timeDelta){
			if (undefined === m_step){
				return;
			}
			m_value += (m_step * in_timeDelta);
			if (((m_step < 0.0) && (m_value < m_target)) ||
				((0.0 < m_step) && (m_target < m_value))){
				m_step = undefined;
				m_value = m_target;
			}
			return;
		},
		"setValue" : function(in_value, in_time){
			if (0.0 === in_time){
				m_step = undefined;
				m_value = in_time;
			} else {
				m_target = in_value;
				m_step = (m_target - m_value) / in_time;
				if (0.0 === m_step){
					m_step = undefined;
				}
			}
		},
		"getValue" : function(){
			return m_value;
		}
	});

	return that;
}
