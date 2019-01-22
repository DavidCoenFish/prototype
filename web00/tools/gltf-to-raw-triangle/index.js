const GltfPipeline = require("gltf-pipeline");
const GltfToRawTriangle = require("./source/gltf-to-raw-triangle.js");
const Path = require("path");
const FsExtra = require("fs-extra");

console.log(new Date().toLocaleTimeString());

if (4 != process.argv.length){
	console.log("usage");
	console.log("\tgltf-to-raw-triangle [output filepath] [input file path]");
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

const loadGltr = function(in_outputFilePath, in_inputFilePath){
	const baseDir = Path.dirname(in_inputFilePath);
	console.log("load file:" + in_inputFilePath);
	return Q(True).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {
			return FsExtra.readJson(in_inputFilePath);
		}).then(function(in_fileData) {
			const options = { 
				"stats" : false,
				"resourceDirectory" : baseDir
				};
			return GltfPipeline.processGltf(in_fileData, options)
		}).then(function(in_gltfWrapper) {
			return GltfToRawTriangle.gltfToRawTriangleArray(in_gltfWrapper.gltf);
		}).then(function(in_rawTriangleArray) {
			return FsExtra.writeJSON(in_outputFilePath, in_rawTriangleArray);
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		}).then(function() {
			console.log(new Date().toLocaleTimeString());
			console.log("done");
		});
}

loadGltr(process.argv[2], process.argv[3]);