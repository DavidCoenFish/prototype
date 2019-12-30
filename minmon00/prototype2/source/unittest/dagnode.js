const Q = require('q');
const Unittest = require("./../unittest.js");

const FileSystem = require("fs");

const loadFile = function( in_fileName ){
	var fileText = (FileSystem.readFileSync(in_fileName) + "");
	fileText = fileText.replace(/export/gi, "");
	return fileText;
} 

eval(loadFile("./input/core/dagnode.js"));

const CalculateSum = function ( m_calculatedValue, inputIndexArray, inputArray ){
	var total = 0;
	inputArray.forEach(element => {
		total += element;
	});
	return total;
}

const RunSanityTest = function(){
	var dagInput0 = factoryDagNodeValue(1);
	var dagInput1 = factoryDagNodeValue(2);
	var dagInput2 = factoryDagNodeValue(3);

	var dagCalculate0 = factoryDagNodeCalculate(CalculateSum);
	Unittest.DealTestAlmost("SanityTest0", dagCalculate0.getValue(), 0);

	link(dagInput0, dagCalculate0);
	link(dagInput1, dagCalculate0);
	link(dagInput2, dagCalculate0);
	Unittest.DealTestAlmost("SanityTest1", dagCalculate0.getValue(), 6);

	unlink(dagInput0, dagCalculate0);
	Unittest.DealTestAlmost("SanityTest2", dagCalculate0.getValue(), 5);
	
	unlink(dagInput1, dagCalculate0);
	unlink(dagInput2, dagCalculate0);
	Unittest.DealTestAlmost("SanityTest3", dagCalculate0.getValue(), 0);

	return;
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(RunSanityTest);

	return;
}
