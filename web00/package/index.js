//take each of the requested projects, and make a webpage and bundle

// const Path = require("path");
// const Helper = require("./source/helper.js");

// const projectArray = [];
// const projectPath = Path.join(__dirname, "/project");
// Helper.gatherProjectArray(projectArray, projectPath);
// Helper.runProjectArray(projectArray);


const FileSystem = require("fs");
const Path = require("path");
const Browserify = require("browserify");
const Babelify = require("babelify");

Browserify("clear.js", {
	basedir: Path.join(__dirname, "/source"),
	debug: true
	})
	.transform(Babelify, {
	"comments": false,
	"global": true,
	"minified": true,
	"presets": ["@babel/preset-env"]
	})
	.bundle(function(){console.log("done");process.exit(0);})
	.on("error", function (err) { console.log("Error: " + err.message); })
	.pipe(FileSystem.createWriteStream("output/js/clear.js"));
