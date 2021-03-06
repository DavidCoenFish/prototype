const FileSystem = require("fs");
const Path = require("path");
const Rollup = require("rollup");
const RollupPluginBabel = require("rollup-plugin-babel");
const RollupPluginEslint = require("rollup-plugin-eslint");
const RollupPluginReplace = require("rollup-plugin-replace");
const RollupPluginUglify = require("rollup-plugin-uglify");

const Q = require("q");

const templateReplaceTokens = function(in_sourcedata, in_key, in_value){
	const token = "\\$\\(" + in_key + "\\)";
	return in_sourcedata.replace(new RegExp(token, 'g'), in_value);
}

const dealHtmlTemplate = function(in_htmlTemplatePath, in_outputHtmlPath, in_entryPointPath, in_outputBundelPath, in_arrayScriptAssetsOrUndefined, in_outputAssetPathOrUndefined){
	var deferred = Q.defer();
	FileSystem.readFile(in_htmlTemplatePath, "utf8", function(error, data) {
		if (error) throw error;

		const title = Path.basename(in_entryPointPath, '.js') + " " + (new Date().toLocaleTimeString());
		const htmlDir = Path.dirname(in_outputHtmlPath);
		const bundlePath = Path.relative(htmlDir, in_outputBundelPath);
		var scriptArray = ""
		if (undefined !== in_arrayScriptAssetsOrUndefined){ 
			for (var index = 0; index < in_arrayScriptAssetsOrUndefined.length; ++index){
				const item = in_arrayScriptAssetsOrUndefined[index];
				const assetName = Path.basename(item);
				const sriptOutputPath = Path.join(in_outputAssetPathOrUndefined, assetName);
				const scriptPath = Path.relative(htmlDir, sriptOutputPath);
				scriptArray += `		<script src="${scriptPath}" ></script>\n`
			};
		}

		data = templateReplaceTokens(data, "title", title);
		data = templateReplaceTokens(data, "bundlePath", bundlePath);
		data = templateReplaceTokens(data, "scriptArray", scriptArray);

		FileSystem.writeFile(in_outputHtmlPath, data, function(error){
			if (null !== error){
				deferred.reject(error);
				return;
			}
			deferred.resolve(true);
		}); 
	});
	return deferred.promise;
}

const dealBundle = function(in_entryPointPath, in_outputBundelPath){
	const development = ("development" === process.env.NODE_ENV);
	const production = ("production" === process.env.NODE_ENV);
	const plugins = [];
	plugins.push(RollupPluginReplace({
		"DEVELOPMENT" : development,
		"PRODUCTION" : production
	}));
	plugins.push(RollupPluginEslint.eslint({
		"useEslintrc": false,
		"throwOnError": true,
		"throwOnWarning": true,
		"parserOptions": {
			"sourceType": "module"
		},
		"env": {
			"browser": true,
			"node": true
		},
		"extends": [
			"eslint:recommended",
			"plugin:react/recommended"
		],
	}));	
	const rollupPluginBablePresetArray = [
			[
				"@babel/preset-env", 
				{
					"targets": "> 0.25%, not dead",
				}
			]
		];
	if (false === development){
		rollupPluginBablePresetArray.push(
			[
				"babel-preset-minify",
				{
					"removeConsole": development ? false : { "exclude": [ "error" ] },
					//"mangle" : { "topLevel" : false, "exclude" : {"window" : true} },
					"deadcode" : {},
					"builtIns": false,
//   evaluate: false,
//   mangle: false,
				}
			]
		);
	}

	plugins.push(RollupPluginBabel({
		"exclude": 'node_modules/**',
		"comments": false,
		"presets": rollupPluginBablePresetArray
	}));
	if (false === development){
		plugins.push(RollupPluginUglify.uglify({
			"sourcemap": development
		}));
	}

	const inputOptions = {
		"input" : in_entryPointPath,
		"plugins" : plugins
	};
	const outputOptions = {
		"format" : "iife", //"esm", //"iife",
		"name" : "onPageLoad",
		"file" : in_outputBundelPath,
		"sourcemap": development ? 'inline' : false,
	};

	return Q().then(function(){
		return Rollup.rollup(inputOptions);
	}).then(function(in_rollup){
		//console.log("watchFiles:" + JSON.stringify(in_rollup.watchFiles));
		//return in_rollup.generate(outputOptions);
		return in_rollup.write(outputOptions);
	}).then(function(in_output){
		/*
		console.log("in_output:" + JSON.stringify(in_output));
		for (const chunkOrAsset of in_output.output) {
			if (chunkOrAsset.isAsset) {
				console.log('Asset', chunkOrAsset);
			} else {
				// For chunks, this contains
				console.log(chunkOrAsset.code);
			}
		}
		*/
	});
}

const dealOutputPath = function(in_filePath){
	if (undefined === in_filePath){
		return;
	}
	return dealOutputFolder(Path.dirname(in_filePath));
}
const dealOutputFolder = function(in_filePath){
	if (undefined === in_filePath){
		return;
	}
	var deferred = Q.defer();
	//console.log("makeDirectory:" + in_filePath);
	FileSystem.mkdir(in_filePath, {recursive: true}, function(error){
		if (error && (error.code !== 'EEXIST')){
			//console.log("error:" + error);
			throw error;
		}
		deferred.resolve(true);
	});
	return deferred.promise;
}

const processFile = function(in_entryPointPath, in_outputBundelPath){
	return Q().then(function(){	
		return dealBundle(in_entryPointPath, in_outputBundelPath);
	});
}

const dealCopyFiles = function(in_arrayScriptAssetsPathOrUndefined, in_outputAssetPathOrUndefined){
	var deferred = Q.defer();

	if (undefined !== in_arrayScriptAssetsPathOrUndefined){
		for (var index = 0; index < in_arrayScriptAssetsPathOrUndefined.length; ++index){
			var source = in_arrayScriptAssetsPathOrUndefined[index];
			var baseName = Path.basename(source);
			var destination = Path.join(in_outputAssetPathOrUndefined, baseName);
			FileSystem.copyFile(source, destination, function(in_error){
				if (in_error){
					 throw in_error;
				}
			});
		}
	}

	deferred.resolve(true);
	return deferred.promise;
}

const processProject = function(in_htmlTemplatePath, in_outputHtmlPath, in_entryPointPath, in_outputBundelPath, in_arrayScriptAssetsPathOrUndefined, in_outputAssetPathOrUndefined){
	return Q().then(function(){	
		return dealOutputFolder(in_outputAssetPathOrUndefined);
	}).then(function(){
		return dealOutputPath(in_outputHtmlPath);
	}).then(function(){
		return dealOutputPath(in_outputBundelPath);
	}).then(function(){
		return dealCopyFiles(in_arrayScriptAssetsPathOrUndefined, in_outputAssetPathOrUndefined);
	}).then(function(){
		return dealHtmlTemplate(in_htmlTemplatePath, in_outputHtmlPath, in_entryPointPath, in_outputBundelPath, in_arrayScriptAssetsPathOrUndefined, in_outputAssetPathOrUndefined);
	}).then(function(){
		return dealBundle(in_entryPointPath, in_outputBundelPath);
	});
}

module.exports = {
	"processFile" : processFile,
	"processProject" : processProject
}
