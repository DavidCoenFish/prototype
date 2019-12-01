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
	if ( FileSystem.existsSync( assetPath ) ){
		walkSync(assetPath, function(in_filePath, in_stat, in_name){
			arrayAsset.push(in_filePath);
		});
	}
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
	UnitTest.GatherUnitTestPromises(unitTestPromises, unittestPath);
	UnitTest.RunUnitTests(unitTestPromises);
} else {
	Q().then(function(){
		console.log(new Date().toLocaleTimeString() + ":" + process.env.NODE_ENV + ":" + process.argv[2] + ":" + process.argv[3]);
	}).then(function(){
		return makeProject(process.argv[2], process.argv[3]);
	}).then(function(in_ouptupHtmlFilePath){
		//console.log(in_ouptupHtmlFilePath)
		//vscode.env.openExternal(vscode.Uri.parse(in_ouptupHtmlFilePath));		
	}).done(function(){
		console.log(new Date().toLocaleTimeString());
	});
}