const Q = require("q");
const FileSystem = require("fs");
const FileSystemExtra = require("fs-extra");
const Path = require("path");
const Base64 = require("./base64.js");

const Sampler = require("./sampler.js");
const Accumulator = require("./accumulator.js");
const TGA = require("tga");

const saveTexture = function(in_outputFilePath, in_width, in_height, in_base64TextureData){
	const content = `
import { Base64ToUint8Array } from './../core/base64.js';
import { factoryByteRGB } from './../webgl/texturewrapper.js';

export default function(in_webGLState){
	return factoryByteRGB(
		in_webGLState, 
		${in_width}, 
		${in_height}, 
		Base64ToUint8Array("${in_base64TextureData}")
	);
}`
	return FileSystemExtra.writeFile(in_outputFilePath, content);
}

const floatToByte = function(in_float){
	return Math.max(0, Math.min(255, Math.round(in_float * 255)));
}

const runOutlineByte = function(in_outputFilePath, in_outputAlphaFilePath, in_width, in_height){
	const sampleCount = 8;
	const colourArray = [];
	const alphaArray = [];
	Sampler.sampleKnot(
		colourArray,
		alphaArray,
		Accumulator.factory,
		in_width, 
		in_height,
		sampleCount
	);

	var dataColourArray = [];
	for (var index = 0; index < colourArray.length; ++index){
		dataColourArray.push(floatToByte(colourArray[index]));
	}
	var dataAlphaArray = [];
	for (var index = 0; index < alphaArray.length; ++index){
		dataAlphaArray.push(floatToByte(alphaArray[index]));
	}
	
	var testPixelArrayA = [];
	var testPixelArrayB = [];
	var testPixelArrayC = [];
	for (var index = 0; index < (in_width * in_height * 3); index += 3){
		var value = floatToByte(colourArray[index]);
		testPixelArrayA.push(value);
		testPixelArrayA.push(value);
		testPixelArrayA.push(value);
		testPixelArrayA.push(floatToByte(alphaArray[index]));

		var value = floatToByte(colourArray[index + 1]);
		testPixelArrayB.push(value);
		testPixelArrayB.push(value);
		testPixelArrayB.push(value);
		testPixelArrayB.push(floatToByte(alphaArray[index + 1]));

		var value = floatToByte(colourArray[index + 2]);
		testPixelArrayC.push(value);
		testPixelArrayC.push(value);
		testPixelArrayC.push(value);
		testPixelArrayC.push(floatToByte(alphaArray[index + 2]));
	}

	const dataA = TGA.createTgaBuffer(in_width, in_height, new Uint8Array(testPixelArrayA));
	const dataB = TGA.createTgaBuffer(in_width, in_height, new Uint8Array(testPixelArrayB));
	const dataC = TGA.createTgaBuffer(in_width, in_height, new Uint8Array(testPixelArrayC));
		
	return Q().then(function(){
		return FileSystemExtra.writeFile("output//testA.tga", dataA);
	}).then(function(){
		return FileSystemExtra.writeFile("output//testB.tga", dataB);
	}).then(function(){
		return FileSystemExtra.writeFile("output//testC.tga", dataC);
	}).then(function(){
		const byteArray = new Uint8Array(dataColourArray);
		const base64TextureData = Base64.byteArrayToBase64(byteArray);
		return saveTexture(in_outputFilePath, in_width, in_height, base64TextureData);
	}).then(function(){
		const byteArray = new Uint8Array(dataAlphaArray);
		const base64TextureData = Base64.byteArrayToBase64(byteArray);
		return saveTexture(in_outputAlphaFilePath, in_width, in_height, base64TextureData);
	});
}

module.exports = {
	"runOutlineByte" : runOutlineByte,
}