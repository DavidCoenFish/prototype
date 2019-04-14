const Q = require("q");
const Path = require("path");
const DscProcess = require("./source/dscprocess.js");
const UnitTest = require("./source/unittest.js");

const outputDir = "./output/" + process.env.NODE_ENV + "/";
const makeProject = function(in_sourceSubDir, in_sourceName){
	return DscProcess.processProject(
		`./template/blank.html.template`, 
		outputDir + `${in_sourceName}/index.html`,
		`./input/${in_sourceSubDir}/${in_sourceName}.js`,
		outputDir + `${in_sourceName}/js/bundle.js`
		);
}

if ("unittest" === process.argv[2]){
	console.log("unittest");
	console.log(new Date().toLocaleTimeString());
	var unitTestPromises = [];
	const unittestPath = Path.join(__dirname, "/source/unittest");
	UnitTest.gatherUnitTestPromises(unitTestPromises, unittestPath);
	UnitTest.runUnitTests(unitTestPromises);
} else {
	Q().then(function(){
		console.log(new Date().toLocaleTimeString() + ":" + process.env.NODE_ENV);
	}).then(function(){
		//return DscProcess.processFile("./input/test/test.js", outputDir + "/test/test.js");
	}).then(function(){
		//return makeProject("test", "capablity");
	}).then(function(){
		return makeProject("test", "triangle");
	}).then(function(){
		return makeProject("test", "scene");
	}).then(function(){
		return makeProject("celticknot01", "celticknot01");
	}).then(function(){
		return makeProject("celticknot02", "celticknot02");
	}).then(function(){
		//return makeProject("convexhull00", "convexhull00");
	}).done(function(){
		console.log(new Date().toLocaleTimeString());
	});
}