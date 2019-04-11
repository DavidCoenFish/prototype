const Q = require('q');
const Unittest = require("./../unittest.js");

//import { Uint8ArrayToBase64, Float32ArrayToBase64, Base64ToUint8Array, Base64ToFloat32Array} from "./../../input/core/base64.js"
const FileSystem = require("fs");
//eval(FileSystem.readFileSync("./../../input/core/base64.js") + " ");
var fileText = (FileSystem.readFileSync("./input/core/base64.js") + "");
fileText = fileText.replace(/export/gi, "");
eval(fileText);

const runFloatRoundTrip = function(){
	const input = [1.5, 2.5, 3.5];
	const base64String = Float32ArrayToBase64(input);
	const output = Base64ToFloat32Array(base64String);

	Unittest.dealTestAlmost("FloatRoundTrip0", input.length, output.length);

	for (var index = 0; index < input.length; ++index){
		Unittest.dealTestAlmost("FloatRoundTrip1" + index, input[index], output[index]);
	}
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runFloatRoundTrip);

	return;
}
