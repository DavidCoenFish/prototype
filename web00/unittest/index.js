const FileSystem = require("fs");
const Path = require("path");
const Q = require("q");

const walkSync = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat, name);
		}
	});
}

const gatherUnitTestPromises = function(promiseFactoryArray, in_path) {
	walkSync(in_path, function(filePath, stat, name){
		try{
			require(filePath)(promiseFactoryArray);
		}catch (err){
			promiseFactoryArray.push(function(){ return Q.reject("unittestPath:" + filePath + " threw:" + err)});
		}
	});
	return;
}

const runUnitTests = function(in_promiseFactoryArray){
	console.log("unittest promiseArray.length:" + in_promiseFactoryArray.length);

	var exitCode = 0;
	var passCount = 0;
	const promise = in_promiseFactoryArray.reduce(function(input, factory){
		return input.then(function(){
			return factory();
		}).then(function(input){
			passCount += 1;
		}).catch(function(error){
			exitCode = 1;
			console.log("test threw:" + error + " " + JSON.stringify(error));
		});
	}, Q.resolve());

	promise.done(function(){
		console.log("PASS:" + passCount);
		process.exit(exitCode);
	},function(error){
		console.log("FAILED:" + error);
		exitCode = 1; //error
		process.exit(exitCode);
	});
}

const dealTest = function(testName, value, expected)
{
	var success = (value === expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected);
	}

	return;
}

const dealTestNot = function(testName, value, expected)
{
	var success = (value !== expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " notExpected:" + expected);
	}

	return;
}

const dealTestAlmost = function(testName, value, expected, epsilonOrUndefined)
{
	const epsilon = (undefined === epsilonOrUndefined) ? Number.MIN_VALUE : epsilonOrUndefined;
	var success = (Math.abs(expected - value) <= epsilon);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected + " epsilon:" + epsilon);
	}

	return;
}

const dealTestRange = function(testName, value, expectedLow, expectedHigh)
{
	var success = ((expectedLow <= value) && (value < expectedHigh));
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expectedLow:" + expectedLow + " expectedHigh:" + expectedHigh);
	}

	return;
}

const dealTestFail = function(testName)
{
	throw testName;
}

module.exports = {
	"gatherUnitTestPromises" : gatherUnitTestPromises,
	"runUnitTests" : runUnitTests,
	"dealTest" : dealTest,
	"dealTestNot" : dealTestNot,
	"dealTest" : dealTest,
	"dealTestAlmost" : dealTestAlmost,
	"dealTestRange" : dealTestRange,
	"dealTestFail" : dealTestFail,
};
