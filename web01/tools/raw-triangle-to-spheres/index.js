const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const RawTriangleToSphere = require("./source/raw-triangle-to-sphere.js");
const Test = require("./source/test.js");

console.log(new Date().toLocaleTimeString());

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	console.log("test");
	Test.run();

	process.exit(0);
}

if (5 != process.argv.length){
	console.log("usage");
	console.log("\traw-triangle-to-spheres [output filepath] [input file path] [sphere diameter]");
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

const loadGltr = function(in_outputFilePath, in_inputFilePath, in_sphereDiameter){

	var debugIndexArray = [];
	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {	
			console.log("load file:" + in_inputFilePath);
			return FsExtra.readJson(in_inputFilePath);
		}).then(function(in_rawTriangleArray) {	
			return RawTriangleToSphere.run(in_rawTriangleArray, in_sphereDiameter, debugIndexArray);
		}).then(function(in_sphereArray) {
			console.log("sphere count" + in_sphereArray.length / 4);
			return FsExtra.writeJSON(in_outputFilePath, in_sphereArray);
		}).then(function() {
			var baseName = Path.basename(in_outputFilePath, ".json");
			var outputDebug = Path.join(Path.dirname(in_outputFilePath), baseName + "_index.json");
			console.log("debugIndexArray.length:" + debugIndexArray.length);
			return FsExtra.writeJSON(outputDebug, debugIndexArray);
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

loadGltr(process.argv[2], process.argv[3], parseFloat(process.argv[4]));