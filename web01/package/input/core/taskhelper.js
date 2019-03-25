export const runArray = function(in_arrayTasks, in_input){
	var inputTrace = in_input;
	for (var index = 0; index < in_arrayTasks.length; ++index){
		var task = in_arrayTasks[index];
		inputTrace = task.run(inputTrace);
	}
	return inputTrace;
}
