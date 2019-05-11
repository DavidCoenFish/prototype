const Q = require("q");
const Path = require("path");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const Basic = require("./source/basic.js");

/*

output = {
	background : { colour:|,gradient:|,envsphere:|,},
	nodearray : [{
		[objectid:],
		[convexhull:[[x,y,z,d],]]|,
		[sphere:[x,y,z,r]]|,
		[cylinder:[x,y,z,nx,ny,nz,l]],
		colour:[r,g,b]|
		gradient:|?
		[movedata : {
			pos : [x,y,z],
			[steplink : {
				[w : nb],
				[e : nb],
				[a : nb],
				[d : nb],
				[z : nb],
				[x : nb],
			}], //move horizontal, adjust height, finish move horizontal
			[linearlink : {
			}],
			[jumplink : []]? info about distance needed to jump
		}]
	}]
}


 */

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

const run = function(in_type, in_outputFilePath){
	console.log(new Date().toLocaleTimeString());

	return Q(true).then(function(){
			return makeDirectory(in_outputFilePath);
		}).then(function() {	
			if ("test" === in_type){
				return Basic.test();
			} else if ("basic" === in_type){
				return Basic.run();
			} else if ("basic5" === in_type){
				return Basic.run5();
			}
			throw new Error(`unknown type ${in_type}`);
		}).then(function(in_input) {	
			return FsExtra.writeJSON(in_outputFilePath, in_input);
		}).then(function() {
			console.log(new Date().toLocaleTimeString());
			console.log("done");
		}).catch(function(in_reason){
			console.log("promise.catch:" + in_reason);
		});
}

if ("unittest" === process.argv[2]){
	console.log("unittest");
	console.log(new Date().toLocaleTimeString());
	Basic.unittest();
} else {
	run(process.argv[2], process.argv[3]);
}