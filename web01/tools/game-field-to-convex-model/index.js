const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const ProcessGameField = require("./source/processgamefield.js");

const makeDirectory = function(in_filePath){
	var deferred = Q.defer();
	console.log("makeDirectory:" + in_filePath + " dirname:" + Path.dirname(in_filePath));
	FileSystem.mkdir(Path.dirname(in_filePath), { recursive: true }, function(error){
		if (error && (error.code !== 'EEXIST')){
			console.log("error:" + error);
			throw error;
		}
		deferred.resolve(true);
	});
	return deferred.promise;
}

const run = function(in_cmd, in_inputFilePath, in_outputFilePath){
	console.log(new Date().toLocaleTimeString());

	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {
			return FsExtra.readJson(in_inputFilePath);
		}).then(function(in_gameField) {
			if (in_cmd == "objectidmodel"){
				return ProcessGameField.runObjectIDModel(in_gameField);
			}
			throw new Error("unknown cmd:" + in_cmd);
		}).then(function(in_saveData) {	
			return FsExtra.writeFile(in_outputFilePath, in_saveData);
		}).then(function() {
			console.log(new Date().toLocaleTimeString());
			console.log("done");
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

console.log(new Date().toLocaleTimeString());
console.log(process.argv[2]);
if ("unittest" === process.argv[2]){
} else {
	run(process.argv[2], process.argv[3], process.argv[4]);
}