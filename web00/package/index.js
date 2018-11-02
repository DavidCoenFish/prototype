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

//https://github.com/browserify/browserify#usage
//Browserify("input2.js", { 
Browserify("clear.js", { 
	//entries has the same definition as files.
	//noParse is an array which will skip all require() and global parsing for each file in the array. Use this for giant libs like jquery or threejs that don't have any requires or node-style globals but take forever to parse.
	//transform is an array of transform functions or modules names which will transform the source code before the parsing.
	//ignoreTransform is an array of transformations that will not be run, even if specified elsewhere.
	//plugin is an array of plugin functions or module names to use. See the plugins section below for details.
	//extensions is an array of optional extra extensions for the module lookup machinery to use when the extension has not been specified. By default browserify considers only .js and .json files in such cases.
	//basedir is the directory that browserify starts bundling from for filenames that start with ..
	basedir: Path.join(__dirname, "/source"),
	//paths is an array of directories that browserify searches when looking for modules which are not referenced using relative path. Can be absolute or relative to basedir. Equivalent of setting NODE_PATH environmental variable when calling browserify command.
	//commondir sets the algorithm used to parse out the common paths. Use false to turn this off, otherwise it uses the commondir module.
	//fullPaths disables converting module ids into numerical indexes. This is useful for preserving the original paths that a bundle was generated with.
	//builtins sets the list of built-ins to use, which by default is set in lib/builtins.js in this distribution.
	//bundleExternal boolean option to set if external modules should be bundled. Defaults to true.
	//browserField is false, the package.json browser field will be ignored.
	//insertGlobals is true, always insert process, global, __filename, and __dirname without analyzing the AST for faster builds but larger output bundles. Default false.
	//detectGlobals is true, scan all files for process, global, __filename, and __dirname, defining as necessary. With this option npm modules are more likely to work but bundling takes longer. Default true.
	//ignoreMissing is true, ignore require() statements that don't resolve to anything.
	//debug is true, add a source map inline to the end of the bundle. This makes debugging easier because you can see all the original files if you are in a modern enough browser.
	debug: true,
	//standalone is a non-empty string, a standalone module is created with that name and a umd wrapper. You can use namespaces in the standalone global export using a . in the string name as a separator, for example 'A.B.C'. The global export will be sanitized and camel cased.
	//insertGlobalVars will be passed to insert-module-globals as the opts.vars parameter.
	//externalRequireName defaults to 'require' in expose mode but you can use another name.
	//bare creates a bundle that does not include Node builtins, and does not replace global Node variables except for __dirname and __filename.
	//node creates a bundle that runs in Node and does not use the browser versions of dependencies. Same as passing { bare: true, browserField: false }.
	})
	.transform(Babelify, {
		//https://babeljs.io/docs/en/options
		//"comments": true,
		//"shouldPrintComment": function(in_comment){
		//	console.log(in_comment);
		//	return false;
		//},
		"minified": true,
		"presets": ["@babel/preset-env"]
		})
	//.require("./../" + in_item.source, { entry: true })
	//.require("./input.js", { entry: true, expose:"main" })
	.bundle(function(){console.log("done");process.exit(0);})
	.on("error", function (err) { console.log("Error: " + err.message); })
	.pipe(FileSystem.createWriteStream("output/js/clear.js"));
