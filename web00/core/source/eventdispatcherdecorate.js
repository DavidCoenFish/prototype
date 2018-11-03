module.exports = function(in_targetObject){
	const eventMap = {};
	Object.assign(in_targetObject, {
		"addEventListener" : function(in_name, in_callback){
			if (in_name in eventMap){
				eventMap[in_name].push(in_callback);
			} else {
				eventMap[in_name] = [in_callback];
			}
			return;
		},
		"removeEventListener" : function(in_name, in_callback){
			if (in_name in eventMap){
				const dataArray = eventMap[in_name];
				const index = dataArray.indexOf(in_callback);
				if (-1 < index) {
					dataArray.splice(index, 1);
				}
			}
			return;
		},
		// if you can pass in a closure, why have the in_param, pass in the thing emitting the event?
		"triggerEvent" : function(in_name, in_param){
			if (in_name in eventMap){
				const dataArray = eventMap[in_name];
				dataArray.forEach(function(in_element){
					in_element(in_param);
				});
			}
			return;
		}
	});


}
