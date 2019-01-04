const GltfPipeline = require("gltf-pipeline");
const GltfToRawTriangle = require("./source/gltf-to-raw-triangle.js");
const RawTriangleCenter = require("./source/raw-triangle-center.js");
const RawTriangleScale = require("./source/raw-triangle-scale.js");
const RawTriangleToSphere = require("./source/raw-triangle-to-sphere.js");

const Path = require("path");
const FsExtra = require("fs-extra");

if (7 != process.argv.length){
	console.log("usage");
	console.log("\tgltf-to-spheres [output filepath] [input root dir] [input file] [target max dim] [sphere diameter]");
	process.exit(0);
}

const loadGltr = function(in_outputFile, in_rootDir, in_fileName, in_targetMaxDim, in_sphereDiameter){
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
			return RawTriangleCenter.rawTriangleCenter(in_rawTriangleArray);
		}).then(function(in_rawTriangleArray) {
			return RawTriangleScale.rawTriangleScale(in_rawTriangleArray, in_targetMaxDim);
		}).then(function(in_rawTriangleArray) {
			return RawTriangleToSphere.rawTriangleToSphere(in_rawTriangleArray, in_sphereDiameter);
		}).then(function(in_sphereArray) {
			console.log("in_sphereArray.length:" + in_sphereArray.length);
			FsExtra.writeJSONSync(in_outputFile, in_sphereArray);
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

loadGltr(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);