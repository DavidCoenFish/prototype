const Q = require("q");
const Path = require("path");
const DscProcess = require("./source/dscprocess.js");
const UnitTest = require("./source/unittest.js");
const FileSystem = require("fs");

const outputDir = "./output/" + process.env.NODE_ENV + "/";

const walkSync = function (currentDirPath, callback) {
	try{
		FileSystem.readdirSync(currentDirPath).forEach(function (name) {
			var filePath = Path.join(currentDirPath, name);
			var stat = FileSystem.statSync(filePath);
			if (stat.isFile()) {
				callback(filePath, stat, name);
			}
		});
	}
	catch(err)
	{
		console.log("currentDirPath:" + err);
	}
	return;
}

const makeProject = function(in_sourceSubDir, in_sourceName){
	//are there any assets in the sub
	var assetPath = Path.join(__dirname, "input", in_sourceSubDir, "assets");
	//console.log("assetPath:" + assetPath);
	var arrayAsset = [];
	walkSync(assetPath, function(in_filePath, in_stat, in_name){
		arrayAsset.push(in_filePath);
	});
	if (0 === arrayAsset.length){
		arrayAsset = undefined;
	}
	return DscProcess.processProject(
		`./template/blank.html.template`, 
		outputDir + `${in_sourceName}/index.html`,
		`./input/${in_sourceSubDir}/${in_sourceName}.js`,
		outputDir + `${in_sourceName}/js/bundle.js`,
		arrayAsset,
		outputDir + `${in_sourceName}/js`,
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
		//return makeProject("test", "depthtexture");
	}).then(function(){
		//return makeProject("test", "pallet");
	}).then(function(){
		//return makeProject("test", "scene");
	}).then(function(){
		//return makeProject("test", "triangle");
	}).then(function(){
		//return makeProject("test", "worldgrid");
	}).then(function(){
		//return makeProject("celticknot01", "celticknot01");
	}).then(function(){
		//return makeProject("celticknot02", "celticknot02");
	}).then(function(){
		//return makeProject("convexhull00", "convexhull00");
	}).then(function(){
		//return makeProject("convexhull01", "convexhull01");
	}).then(function(){
		//return makeProject("gameplay00", "gameplay00");
	}).then(function(){
		//return makeProject("vector00", "vector00");
	}).then(function(){
		//return makeProject("font00", "font00");
	}).then(function(){
		return makeProject("phoenix00", "phoenix00");
	}).done(function(){
		console.log(new Date().toLocaleTimeString());
	});
}