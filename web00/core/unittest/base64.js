const Q = require('q');
const Unittest = require("unittest");
const Base64 = require("./../source/base64.js");

function runSanity(){
	return Q(true).then(function(){
		const input = new Uint8Array([1,2,3,4,255,254,253]);
		const base64String = Base64.byteArrayToBase64(input);
		console.log(base64String);
		const output = Base64.base64ToByteArray(base64String);

		Unittest.dealTest("Base64::runSanity::1", output.length, input.length);
		for (var index = 0; index < output.length; ++index){
			Unittest.dealTest("Base64::runSanity::2." + index, output[index], input[index]);
		}
	});
}

function runArrayTypes(){
	return Q(true).then(function(){
		const input = new Float32Array([7.5, 10.75]);
		const inputByteArray = new Uint8Array(input.buffer);
		const base64String = Base64.byteArrayToBase64(inputByteArray);
		console.log(base64String);
		const outputByteArray = Base64.base64ToByteArray(base64String);
		const output = new Float32Array(outputByteArray.buffer);

		Unittest.dealTest("Base64::runArrayTypes::1", output.length, input.length);
		for (var index = 0; index < output.length; ++index){
			Unittest.dealTest("Base64::runArrayTypes::2." + index, output[index], input[index]);
		}
	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);
	in_promiseArray.push(runArrayTypes);

	return;
}
