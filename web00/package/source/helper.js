const FileSystem = require("fs");
const Path = require("path");
const Browserify = require("browserify");
const Babelify = require("babelify");
//const Uglifyjs = require("uglify-js");
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

const gatherProjectArray = function(in_projectArray, in_path) {
	walkSync(in_path, function(filePath, stat, name){
		try{
			console.log("push:" + filePath);
			in_projectArray.push(require(filePath));
		}catch (error){
			console.log("exception thrown while loading:" + filePath + " error:" + error);
		}
	});
	return;
}

const runProjectArray = function(in_projectArray){
	console.log("projectArray.length:" + in_projectArray.length);

	const promiseArray = [];
	in_projectArray.forEach(function(in_item){
		promiseArray.push(makePromice(in_item));
	});

	var exitCode = 0;
	const promise = promiseArray.reduce(function(input, in_promise){
		return input.then(function(){
			return in_promise;
		}).catch(function(error){
			exitCode = 1;
			console.log("project threw:" + error + " " + JSON.stringify(error));
		});
	}, Q.resolve());

	promise.catch(function(error){
		console.log("Catch:" + error);
		exitCode = 1; //error
		process.exit(exitCode);
	}).done(function(){
		console.log(new Date().toLocaleTimeString());
		console.log("Done");
		process.exit(exitCode);
	},function(error){
		console.log("FAILED:" + error);
		exitCode = 1; //error
		process.exit(exitCode);
	});

	//process.exit(exitCode);
}

const makePromice = function(in_item){
	const htmlPath = Path.join(in_item.outputRootDir, in_item.name + ".htm");
	const bundlePath = Path.join(in_item.outputRootDir, in_item.templateParam.bundleFilePath);
	return Q(true).then(function(){
		console.log(in_item.name);
		makeDirectory(htmlPath);
	}).then(function(){
		makeDirectory(bundlePath);
	}).then(function(){
		return makeDirForCopyFiles(in_item);
	}).then(function(){
		return copyFiles(in_item);
	}).then(function(){
		return makeTemplate(in_item, htmlPath);
	}).then(function(){
		return doBrowserify(in_item, bundlePath);
	});
}
const makeDirectory = function(in_filePath){
	var deferred = Q.defer();
	//console.log("makeDirectory:" + in_filePath + " dirname:" + Path.dirname(in_filePath));
	FileSystem.mkdir(Path.dirname(in_filePath), { recursive: true }, function(error){
		if (error && (error.code !== 'EEXIST')){
			//console.log("error:" + error);
			throw error;
		}
		deferred.resolve(true);
	});
	return deferred.promise;
}

const makeDirForCopyFiles = function(in_item){
	var promiceChain = Q(true);

	const copyFileDest = in_item["copyFileDest"];
	const copyFileArray = in_item["copyFileArray"];
	if ((undefined !== copyFileDest) && (undefined !== copyFileArray)){
		for (var index = 0; index < copyFileArray.length; ++index){
			var destinationDir = Path.join(in_item.outputRootDir, copyFileDest, "*");
			promiceChain = promiceChain.then(function(){
				return makeDirectory(destinationDir);
			});
		}
	}

	return promiceChain;
}
const copyFiles = function(in_item){
	var deferred = Q.defer();

	var copyFilePathArray = "";
	const copyFileDest = in_item["copyFileDest"];
	const copyFileArray = in_item["copyFileArray"];
	if ((undefined !== copyFileDest) && (undefined !== copyFileArray)){
		for (var index = 0; index < copyFileArray.length; ++index){
			var source = copyFileArray[index];
			var baseName = Path.basename(source);
			var destination = Path.join(in_item.outputRootDir, copyFileDest, baseName);
			var htmlDestPath = Path.join(copyFileDest, baseName).replace();
			FileSystem.copyFile(source, destination, function(in_error){
				if (in_error){
					 throw in_error;
				}
			});

			copyFilePathArray += `		<script src="${htmlDestPath}" ></script>\n`;
		}
	}

	deferred.resolve(true);
	in_item.templateParam["copyFilePathArray"] = copyFilePathArray;

	return deferred.promise;
}

const makeTemplate = function(in_item, in_htmlPath){
	var deferred = Q.defer();
	FileSystem.readFile(in_item.template, "utf8", function(error, data) {
		if (error) throw error;
		const newData = templateReplaceTokens(data, in_item.templateParam);
		FileSystem.writeFile(in_htmlPath, newData, function(error){
			deferred.resolve(true);
		}); 
	});
	return deferred.promise;
}

const templateReplaceTokens = function(in_sourcedata, in_param){
	var resultData = in_sourcedata;
	Object.keys(in_param).forEach(function(key) {
		const value = in_param[key];
		const token = "\\$\\(" + key + "\\)";
		resultData = resultData.replace(new RegExp(token, 'g'), value);
	});
	return resultData;
}


const doBrowserify = function(in_item, in_bundlePath){
	var deferred = Q.defer();
	Browserify(in_item.source, {
		basedir: __dirname,
		debug: true
	})
	.transform(Babelify, {
		"comments": false,
		"global": true,
		"minified": true,
		"presets": ["@babel/preset-env"]
	})
	//.transform(Uglifyjs, {
	//})
	.bundle()
	.on("error", function (error) { 
		console.log("doBrowserify:Error:" + error.message); 
		//if we reject during error, the pipe doesn't finish? or seeing "done" after bundle
		//deferred.reject(new Error(error.message));
		process.exit(0);
	})
	.pipe(FileSystem.createWriteStream(in_bundlePath))
	.addListener("finish", function(){
		//console.log("doBrowserify:finish"); 
		deferred.resolve(true);
	});

	return deferred.promise;
}

module.exports = {
	"gatherProjectArray" : gatherProjectArray,
	"runProjectArray" : runProjectArray,
};
