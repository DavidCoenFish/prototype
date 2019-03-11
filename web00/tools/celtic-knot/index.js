const Q = require("q");
const FileSystem = require("fs");
const Path = require("path");
const Test = require("./source/test.js");
const Asset = require("./source/asset.js");

console.log(new Date().toLocaleTimeString());

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	console.log("test");
	Test.run();

	process.exit(0);
}

if (6 != process.argv.length){
	console.log("usage");
	console.log("\tceltic-knot [mode] [output data path] [width] [height]");
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

const run = function(in_mode, in_outputFilePath, in_width, in_height){
	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function(in_sphereArray) {
			if (in_mode === "texturebyte"){
				return Asset.runTextureByte(in_outputFilePath, in_width, in_height);
			} else {
				throw new Error("unknown mode:" + in_mode);
			}
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

run(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);