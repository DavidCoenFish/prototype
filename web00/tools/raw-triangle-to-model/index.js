const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const DealRawTriangle = require("./source/deal-raw-triangle.js");

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	console.log("test");
	Test.run();
	process.exit(0);
}

if (6 != process.argv.length){
	console.log("usage");
	console.log("\traw-triangle-to-model [output filepath asset] [output filepath data] [input file] [mode]");
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

const loadGltr = function(in_outputFileAsset, in_outputFileData, in_inputFile, in_mode){
	console.log(new Date().toLocaleTimeString());

	return Q(true).then(function(){
			return makeDirectory(in_outputFileAsset);
		}).then(function() {	
			return makeDirectory(in_outputFileData);
		}).then(function() {	
			return FsExtra.readJson(in_inputFile);
		}).then(function(in_rawTriangleArray) {	
			return DealRawTriangle.run(in_rawTriangleArray, in_mode, in_outputFileAsset, in_outputFileData);
		}).then(function() {
			console.log(new Date().toLocaleTimeString());
			console.log("done");
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

loadGltr(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);