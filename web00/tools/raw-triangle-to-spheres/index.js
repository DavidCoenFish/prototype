const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const GltfPipeline = require("gltf-pipeline");

const GltfToRawTriangle = require("./source/gltf-to-raw-triangle.js");
const RawTriangleCenter = require("./source/raw-triangle-center.js");
const RawTriangleScale = require("./source/raw-triangle-scale.js");
const RawTriangleToSphere = require("./source/raw-triangle-to-sphere.js");
const Test = require("./source/test.js");

console.log(new Date().toLocaleTimeString());

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	console.log("test");
	Test.run();
	process.exit(0);
}

if (7 != process.argv.length){
	console.log("usage");
	console.log("\tgltf-to-spheres [output filepath] [input root dir] [input file] [target max dim] [sphere diameter]");
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

const loadGltr = function(in_outputFile, in_rootDir, in_fileName, in_targetMaxDim, in_sphereDiameter){

	return Q(true).then(function(){
			return makeDirectory(in_outputFile);
		}).then(function() {	
			const localFilePath = Path.join(in_rootDir, in_fileName);
			console.log("load file:" + localFilePath);
			return FsExtra.readJson(localFilePath);
		}).then(function(in_fileData) {	
			const options = { 
				"stats" : false,
				"resourceDirectory" : in_rootDir
				};
			return GltfPipeline.processGltf(in_fileData, options);
		}).then(function(in_gltfWrapper) {
			return GltfToRawTriangle.gltfToRawTriangleArray(in_gltfWrapper.gltf);
		}).then(function(in_rawTriangleArray) {
			return RawTriangleCenter.rawTriangleCenter(in_rawTriangleArray);
		}).then(function(in_rawTriangleArray) {
			return RawTriangleScale.rawTriangleScale(in_rawTriangleArray, in_targetMaxDim);
		}).then(function(in_rawTriangleArray) {
			return RawTriangleToSphere.rawTriangleToSphere(in_rawTriangleArray, in_sphereDiameter);
		}).then(function(in_sphereArray) {
			console.log("in_sphereArray.length:" + in_sphereArray.length);
			FsExtra.writeJSONSync(in_outputFile, in_sphereArray);
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

loadGltr(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);