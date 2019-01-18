const GltfPipeline = require("gltf-pipeline");
const GltfToRawTriangle = require("./source/gltf-to-raw-triangle.js");
const DealRawTriangle = require("./source/deal-raw-triangle.js");

const Path = require("path");
const FsExtra = require("fs-extra");

console.log(new Date().toLocaleTimeString());

if ((3 == process.argv.length) && ("test" === process.argv[2])){
	console.log("test");
	Test.run();
	process.exit(0);
}

if (7 != process.argv.length){
	console.log("usage");
	console.log("\tgltf-to-model [output filepath] [output file data] [input root dir] [input file] [mode]");
	process.exit(0);
}

const loadGltr = function(in_outputFileModel, in_outputFileData, in_rootDir, in_fileName, in_mode){
	const localFilePath = Path.join(in_rootDir, in_fileName);
	const options = { 
		"stats" : false,
		"resourceDirectory" : in_rootDir
		};
	console.log("load file:" + localFilePath);
	const fileData = FsExtra.readJsonSync(localFilePath);
	return GltfPipeline.processGltf(fileData, options)
		.then(function(in_gltfWrapper) {
			return GltfToRawTriangle.gltfToRawTriangleArray(in_gltfWrapper.gltf);
		}).then(function(in_rawTriangleArray) {
			return DealRawTriangle.run(in_rawTriangleArray, in_mode, in_outputFileModel, in_outputFileData); 
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		}).then(function() {
			console.log("done");
		});
}

loadGltr(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);