const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const AdjustHeight = require("./source/adjust_height.js");

const makeDirectory = function(in_filePath){
	var deferred = Q.defer();
	//console.log("makeDirectory:" + in_filePath + " dirname:" + Path.dirname(in_filePath));
	FileSystem.mkdir(Path.dirname(in_filePath), { recursive: true }, function(error){
		if (error && (error.code !== 'EEXIST')){
			//console.log("error:" + error);
			throw error;
		}
		deferred.resolve(true);
	});
	return deferred.promise;
}

const loadGltr = function(in_outputFilePath, in_inputFilePath, in_param){
	console.log(new Date().toLocaleTimeString());

	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {	
			return FsExtra.readJson(in_inputFilePath);
		}).then(function(in_rawTriangleArray) {	
			var result = in_rawTriangleArray;
			for (var index = 0; index < in_param.length; ++index){
				if (in_param[index] === "-adjust_height"){
					++index;
					height = parseFloat(in_param[index]);
					result = AdjustHeight.run(result, height);
				}
			}
			return result;
		}).then(function(in_rawTriangleArray) {	
			return FsExtra.writeJSON(in_outputFilePath, in_rawTriangleArray);
		}).then(function() {
			console.log(new Date().toLocaleTimeString());
			console.log("done");
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

loadGltr(process.argv[2], process.argv[3], process.argv.slice(4));