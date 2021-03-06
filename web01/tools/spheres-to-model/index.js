const Q = require("q");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const Path = require("path");
const SphereToModel = require("./source/sphere-to-model.js");
const SphereToModelTexture = require("./source/sphere-to-model-texture.js");
const SphereToModelTextureLink = require("./source/sphere-to-model-texture-link.js");
const SphereToModelTextureLinkBbc = require("./source/sphere-to-model-texture-link-bbc.js");
const SphereToModelTextureVolumeBbc = require("./source/sphere-to-model-texture-volume-bbc.js");
const Test = require("./source/test.js");

console.log(new Date().toLocaleTimeString());

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	console.log("test");
	Test.run();

	process.exit(0);
}

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

const run = function(in_outputAssetFilePath, in_outputDataFilePath, in_inputFilePath, in_mode){
	return Q(true).then(function(){
			return makeDirectory(in_outputAssetFilePath);
		}).then(function() {	
			return makeDirectory(in_outputDataFilePath);
		}).then(function() {	
			console.log("load file:" + in_inputFilePath);
			return FsExtra.readJson(in_inputFilePath);
		}).then(function(in_sphereArray) {
			baseName = Path.basename(in_inputFilePath, ".json");
			if (in_mode === "model"){
				return SphereToModel.run(in_sphereArray, in_outputAssetFilePath, in_outputDataFilePath, baseName);
			} else if (in_mode === "model_texture"){
				return SphereToModelTexture.run(in_sphereArray, in_outputAssetFilePath, in_outputDataFilePath, baseName);
			} else if (in_mode === "model_texture_link8"){
				var linkPath = Path.join(Path.dirname(in_inputFilePath), baseName + "_index.json");
				var linkData = FsExtra.readJsonSync(linkPath);
				return SphereToModelTextureLink.run8(in_sphereArray, linkData, in_outputAssetFilePath, in_outputDataFilePath, baseName);
			} else if (in_mode === "model_texture_link14"){
				var linkPath = Path.join(Path.dirname(in_inputFilePath), baseName + "_index.json");
				var linkData = FsExtra.readJsonSync(linkPath);
				return SphereToModelTextureLink.run14(in_sphereArray, linkData, in_outputAssetFilePath, in_outputDataFilePath, baseName);
			} else if (in_mode === "model_texture_link12"){
				var linkPath = Path.join(Path.dirname(in_inputFilePath), baseName + "_index.json");
				var linkData = FsExtra.readJsonSync(linkPath);
				return SphereToModelTextureLinkBbc.run12(in_sphereArray, linkData, in_outputAssetFilePath, in_outputDataFilePath, baseName);
			} else if (in_mode === "model_texture_volume12"){
				var linkPath = Path.join(Path.dirname(in_inputFilePath), baseName + "_index.json");
				var linkData = FsExtra.readJsonSync(linkPath);
				return SphereToModelTextureVolumeBbc.run12(in_sphereArray, linkData, in_outputAssetFilePath, in_outputDataFilePath, baseName);
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