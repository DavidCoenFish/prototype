const DscProcess = require("./source/dscprocess.js");
const Q = require("q");

const outputDir = "./output/" + process.env.NODE_ENV + "/";
Q().then(function(){
	console.log(new Date().toLocaleTimeString() + ":" + process.env.NODE_ENV);
}).then(function(){
	//return DscProcess.processFile("./input/test.js", outputDir + "/test/test.js");
}).then(function(){
	/*
	return DscProcess.processProject(
		"./template/blank.html.template", 
		outputDir + "triangle/index.html",
		"./input/triangle.js",
		outputDir + "triangle/js/bundle.js"
		);
	/**/
}).then(function(){
	/**/
	return DscProcess.processProject(
		"./template/blank.html.template", 
		outputDir + "scene/index.html",
		"./input/scene.js",
		outputDir + "scene/js/bundle.js"
		);
	/**/
}).done(function(){
	console.log(new Date().toLocaleTimeString());
});