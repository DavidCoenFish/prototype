const Q = require("q");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const Path = require("path");
const SphereToModel = require("./source/sphere-to-model.js");

console.log(new Date().toLocaleTimeString());

if (6 != process.argv.length){
	console.log("usage");
	console.log("\tspheres-to-model [output asset filepath] [output data path] [input file path] [mode]");
	process.exit(0);
}

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

const loadGltr = function(in_outputAssetFilePath, in_outputDataFilePath, in_inputFilePath, in_mode){
	return Q(true).then(function(){
			return makeDirectory(in_outputAssetFilePath);
		}).then(function() {	
			return makeDirectory(in_outputDataFilePath);
		}).then(function() {	
			console.log("load file:" + in_inputFilePath);
			return FsExtra.readJson(in_inputFilePath);
		}).then(function(in_sphereArray) {
			if (in_mode === "model"){
				baseName = Path.basename(in_inputFilePath, ".json");
				return SphereToModel.run(in_sphereArray, in_outputAssetFilePath, in_outputDataFilePath, baseName);
			}
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

loadGltr(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);