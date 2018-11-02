const FileSystem = require("fs");
const Path = require("path");
const Browserify = require("browserify");
const Babelify = require("babelify");

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
			in_projectArray.push(require(filePath));
		}catch (error){
			console.log("exception thrown while loading:" + filePath + " error:" + error);
		}
	});
	return;
}

const runProjectArray = function(in_projectArray){
	console.log("projectArray.length:" + in_projectArray.length);

	var exitCode = 0;
	in_projectArray.forEach(function(in_item){
		//console.log(JSON.stringify(in_item));

		Browserify({ debug: true })
			.transform(Babelify)
			//.require("./../" + in_item.source, { entry: true })
			.require("./input.js", { entry: true, expose:"main" })
			.bundle()
			.on("error", function (err) { console.log("Error: " + err.message); })
			.pipe(FileSystem.createWriteStream("output.js"));
			//.pipe(FileSystem.createWriteStream("./../" + in_item.outputBundle));

	});
	process.exit(exitCode);
}

module.exports = {
	"gatherProjectArray" : gatherProjectArray,
	"runProjectArray" : runProjectArray,
};
