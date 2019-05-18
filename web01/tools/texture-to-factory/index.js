const Q = require("q");
const FileSystem = require("fs");
const FileSystemExtra = require("fs-extra");
const TGA = require("tga");
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

const printTga2 = function(in_tga){
	var pixelData = [];
	for (var i = 0; i < in_tga.pixels.length; i += 4) {
		pixelData.push(in_tga.pixels[i + 0]);
		pixelData.push(in_tga.pixels[i + 1]);
		pixelData.push(in_tga.pixels[i + 2]);
	}
	var data = new Uint8Array(pixelData);
	var dataString = Base64.Uint8ArrayToBase64(data);
	return `
import {Base64ToUint8Array} from './../core/base64.js';
import {factoryByteRGB} from "./../webgl/texturewrapper.js";

export default function(in_webGLState){
	return factory(
		in_webGLState,
		${in_tga.width}, 
		${in_tga.height}, 
		Base64ToUint8Array("${dataString}"),
		false,
		"RGB",
		"RGB",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"REPEAT",
		"REPEAT"
	);
}
`;
}
const printTga = function(in_tga, in_name, in_type){
	var pixelData = [];
	for (var i = 0; i < in_tga.pixels.length; i += 4) {
		pixelData.push(in_tga.pixels[i + 0]);
		pixelData.push(in_tga.pixels[i + 1]);
		pixelData.push(in_tga.pixels[i + 2]);
		if ("RGBA" === in_type){
			pixelData.push(in_tga.pixels[i + 3]);
		}
	}
	var data = new Uint8Array(pixelData);
	var dataString = Base64.Uint8ArrayToBase64(data);
	return `
const ${in_name} = "${dataString}";
`;
}


const run = function(in_inputFilePath, in_outputFilePath, in_name, in_type){
	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {
			return new TGA(FileSystem.readFileSync(in_inputFilePath));
		}).then(function(in_tga) {
			console.log(in_tga.width, in_tga.height);
			return printTga(in_tga, in_name, in_type);
		}).then(function(in_tgaFactory) {
			FileSystem.writeFileSync(in_outputFilePath, in_tgaFactory);
			return;
		}).then(function() {
			console.log("done:" + new Date().toLocaleTimeString());
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

run(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);