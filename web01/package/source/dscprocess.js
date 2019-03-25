const Path = require("path");
const BableCore = require("@babel/core");
const Browserify = require("browserify");
const Babelify = require("babelify");
const FileSystem = require("fs");

const Q = require("q");
const DscStream = require("./dscstream.js");

// 	"comments": false,
// 	"global": true,
// 	"minified": true,
// 	"presets": ["@babel/preset-env"]
// })


/*
BableCore.transformFile("./input/test.js", bableOptions, function(in_error, in_result){
	if (null !== in_error){
		console.log("Error:" + in_error);
		return;
	}
	//console.log("in_result:" + JSON.stringify(in_result));
	console.log("in_result.code:");	
	console.log(in_result.code);	
	console.log(new Date().toLocaleTimeString());
	console.log("done");
});
*/

const bundleFilePromice = function(in_filePath){
	var deferred = Q.defer();

	const browserOptions = {
		basedir: __dirname,
		debug: false
	};

	const bableOptions = {
		"minified": true,
		"global": true,
		"comments": false,
		"presets": [
			[
				"@babel/preset-env", 
				{
					"targets": "> 0.25%, not dead",
				},
			],
		]
	}

	Browserify(in_filePath, browserOptions)
	.transform(Babelify, bableOptions)
	.bundle(function(in_error, in_buffer){
		if (null !== in_error){
			console.log("bundleFilePromice:error:" + error.message); 
			deferred.reject(error.message);
		}
		deferred.resolve(in_buffer);
	});
	return deferred.promise;
}

const minifyPromice = function(in_buffer){
	var deferred = Q.defer();

	const bableOptions = {
		"presets": [
			[
				"babel-preset-minify",
				{
					"removeConsole": { "exclude": [ "error" ] },
					"mangle" : { "topLevel" : false, "exclude" : {"window" : true} },
					"deadcode" : {},
				}
			],
		]
	}

	BableCore.transform(in_buffer, bableOptions, function(in_error, in_result){
		if (null !== in_error){
			console.log("minifyPromice:error:" + in_error.message); 
			deferred.reject(in_error.message);
		}

		deferred.resolve(in_result.code);
	});

	return deferred.promise;
}

const bundleFile = function(in_filePath){
	return Q().then(function(){	
		return bundleFilePromice(in_filePath);
	}).then(function(in_buffer){
		return minifyPromice(in_buffer);
	}).then(function(in_buffer){
		console.log("bundleFile:" + in_buffer); 
		return in_buffer;
	});
}

module.exports = {
	"bundleFile" : bundleFile
}
