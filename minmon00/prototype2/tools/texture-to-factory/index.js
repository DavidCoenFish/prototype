const Q = require("q");
const FileSystem = require("fs");
const FileSystemExtra = require("fs-extra");
const Path = require("path");
const Base64 = require(".//Base64.js");

console.log(new Date().toLocaleTimeString());

if (6 != process.argv.length){
	console.log("usage");
	console.log("texture-to-factory <inputFilePath> <outputFilePath> <dataName> <RBG|RGBA>");
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

const MakeTexture = function(in_file, in_width, in_height){
	var arrayBuffer = new ArrayBuffer(4);
	// Create a data view of it
	var view = new DataView(arrayBuffer);
	var pixels = new Float32Array(in_width * in_height * 3);
	var trace = 0;
	var count = in_width * in_height * 4;
	var value = 0;
	for (var index = 0; index < count; ++index){
		if (3 === (index & 3)){
			continue;
		} 

		//console.log("MakeTexture:", in_file[(index * 4) + 0].toString(16), in_file[(index * 4) + 1].toString(16), in_file[(index * 4) + 2].toString(16), in_file[(index * 4) + 3].toString(16));

		view.setUint8(0, in_file[(index * 4) + 3]);
		view.setUint8(1, in_file[(index * 4) + 2]);
		view.setUint8(2, in_file[(index * 4) + 1]);
		view.setUint8(3, in_file[(index * 4) + 0]);
		value = view.getFloat32(0);
		//console.log(index, value);

		pixels[trace] = value;
		trace += 1;
	}

	var texture = {
		"width" : in_width,
		"height" : in_height,
		"pixels" : pixels,
	};

	return texture;
}

const printTexture = function(in_texture){
	var dataString = Base64.Float32ArrayToBase64(in_texture.pixels);
	return `
import {Base64ToFloat32Array} from './../core/base64.js';

export default function(in_webGLAPI){
	return in_webGLAPI.createTexture(
		${in_texture.width}, 
		${in_texture.height}, 
		"RGB",
		"RGB",
		"FLOAT",
		Base64ToFloat32Array("${dataString}"),
		false,
		"sLINEAR_MIPMAP_LINEAR",
		"sLINEAR_MIPMAP_LINEAR",
		"REPEAT",
		"REPEAT",
		true
	);
}
`;
}

const printTextureData = function(in_texture, in_name){
	var dataString = Base64.Float32ArrayToBase64(in_texture.pixels);
	return `var ${in_name} = "${dataString}";
`;
}

const run = function(in_inputFilePath, in_outputFilePath, in_name, in_type){
	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {
			return FileSystem.readFileSync(in_inputFilePath);
		}).then(function(in_file) {
			return MakeTexture(in_file, 512, 256);
		}).then(function(in_texture) {
			//return printTexture(in_texture);
			return printTextureData(in_texture, in_name);
		}).then(function(in_output) {
			FileSystem.writeFileSync(in_outputFilePath, in_output);
			return;
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

run(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);