const Q = require("q");

const printMoveData = function(in_data){
	const result = `
export default ${in_data}
`;

	return result;
}

const run = function(in_gameField){
	var data = {};
	var reIndexMap = {};
	//"objectid": 1,
	var trace = 0;
	for (var index = 0; index < in_gameField.nodearray.length; ++index){
		var node = in_gameField.nodearray[index];
		if (false === ("movedata" in node)){
			continue;
		}
		reIndexMap[index] = node.objectid;
		trace += 1;
	}

	for (var index = 0; index < in_gameField.nodearray.length; ++index){
		var node = in_gameField.nodearray[index];
		if (false === ("movedata" in node)){
			continue;
		}

		var stepLink = {};
		for (var key in node.movedata.steplink){
			stepLink[key] = reIndexMap[node.movedata.steplink[key]];
		}

		data[node.objectid] = {
			"pos" : node.movedata.pos,
			"steplink" : stepLink
		};
	}

	var result = printMoveData(JSON.stringify(data));

	return result;
}

module.exports = {
	"run" : run
}