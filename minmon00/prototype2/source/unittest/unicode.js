const Q = require('q');
const Unittest = require("./../unittest.js");

const FileSystem = require("fs");

const loadFile = function( in_fileName ){
	var fileText = (FileSystem.readFileSync(in_fileName) + "");
	fileText = fileText.replace(/export/gi, "");
	return fileText;
} 

eval(loadFile("./input/core/unicode.js"));

const RunSanityTest = function(){
	var codePointArray0 = stringToArrayCodePoint("\uD83D\uDC36");
	Unittest.DealTestAlmost("SanityTest0a", codePointArray0.length, 1);
	Unittest.DealTestAlmost("SanityTest0b", codePointArray0[0], 128054);

	var codePointArray1 = stringToArrayCodePoint("");
	Unittest.DealTestAlmost("SanityTest1", codePointArray1.length, 0);

	var codePointArray2 = stringToArrayCodePoint("A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A");
	Unittest.DealTestAlmost("SanityTest2a", codePointArray2.length, 6);
	Unittest.DealTestAlmost("SanityTest2b", codePointArray2[0], 65);
	Unittest.DealTestAlmost("SanityTest2b", codePointArray2[1], 119912);
	Unittest.DealTestAlmost("SanityTest2b", codePointArray2[2], 66);
	Unittest.DealTestAlmost("SanityTest2b", codePointArray2[3], 119913);
	Unittest.DealTestAlmost("SanityTest2b", codePointArray2[4], 67);
	Unittest.DealTestAlmost("SanityTest2b", codePointArray2[5], 119914);

	return;
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(RunSanityTest);

	return;
}
