const DscProcess = require("./source/dscprocess.js");
const Q = require("q");




const outputDir = "./output/" + process.env.NODE_ENV + "/";
Q().then(function(){
	console.log(new Date().toLocaleTimeString() + ":" + process.env.NODE_ENV);
}).then(function(){
	//return DscProcess.processFile("./input/test.js", outputDir + "/test/test.js");
}).then(function(){
	return DscProcess.processProject(
		"./template/blank.html.template", 
		outputDir + "triangle/index.html",
		"./input/triangle.js",
		outputDir + "triangle/triangle.js"
		);
}).done(function(){
	console.log(new Date().toLocaleTimeString());
});


// //take each of the requested projects, and make a webpage and bundle

// const Path = require("path");
// const Rollup = require("rollup");
// const RollupPluginBabel = require("rollup-plugin-babel");

// console.log(new Date().toLocaleTimeString());

// // see below for details on the options
// const inputOptions = {
// 	"input" : "./input/test.js",
// 	plugins: [
// 		RollupPluginBabel({
// 			"exclude": 'node_modules/**',
// 			"minified": true,
// 			"comments": false,
// 			"presets": [
// 				[
// 					"@babel/preset-env", 
// 					{
// 						"targets": "> 0.25%, not dead",
// 					},
// 				],
// 				[
// 					"babel-preset-minify",
// 					{
// 						"removeConsole": { "exclude": [ "error" ] },
// 						"mangle" : { "topLevel" : false, "exclude" : {"window" : true} },
// 						"deadcode" : {},
// 					}
// 				]
// 			]
// 		})
// 	]
// };
// const outputOptions = {
// 	"format" : "iife", //"esm", //"iife",
// 	"name" : "onPageLoad",
// 	"dir" : "output"
// };

// async function build() {
//   // create a bundle
//   const bundle = await Rollup.rollup(inputOptions);

//   console.log("input files:" + JSON.stringify(bundle.watchFiles)); // an array of file names this bundle depends on

//   // generate code
//   const { output } = await bundle.generate(outputOptions);

//   for (const chunkOrAsset of output) {
//     if (chunkOrAsset.isAsset) {
//       // For assets, this contains
//       // {
//       //   isAsset: true,                 // signifies that this is an asset
//       //   fileName: string,              // the asset file name
//       //   source: string | Buffer        // the asset source
//       // }
//       console.log('Asset', chunkOrAsset);
//     } else {
//       // For chunks, this contains
//       // {
//       //   code: string,                  // the generated JS code
//       //   dynamicImports: string[],      // external modules imported dynamically by the chunk
//       //   exports: string[],             // exported variable names
//       //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
//       //   fileName: string,              // the chunk file name
//       //   imports: string[],             // external modules imported statically by the chunk
//       //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
//       //   isEntry: boolean,              // is this chunk a static entry point
//       //   map: string | null,            // sourcemaps if present
//       //   modules: {                     // information about the modules in this chunk
//       //     [id: string]: {
//       //       renderedExports: string[]; // exported variable names that were included
//       //       removedExports: string[];  // exported variable names that were removed
//       //       renderedLength: number;    // the length of the remaining code in this module
//       //       originalLength: number;    // the original length of the code in this module
//       //     };
//       //   },
//       //   name: string                   // the name of this chunk as used in naming patterns
//       // }
//       //console.log('Chunk', chunkOrAsset.modules);
//       console.log(chunkOrAsset.code);
//     }
//   }

//   // or write the bundle to disk
//   await bundle.write(outputOptions);
// }

// build();
