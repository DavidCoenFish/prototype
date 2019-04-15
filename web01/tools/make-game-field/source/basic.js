const UnitTest = require("./unittest.js");

// output = {
// 	background : { colour:|,gradient:|,envSphere:|,},
// 	nodeArray : [{
// 		[objectId:],
// 		[convexHull:[[x,y,z,d],]]|,
// 		[sphere:[x,y,z,r]]|,
// 		colour:[r,g,b]|
// 		gradient:|?
// 	}]
// }

const makeNodeOrigin = function(in_radius, in_indexX, in_indexY, in_width, in_height){
	var x = ((in_width * in_radius) * (-0.5)) + (0.25 * in_radius) + (in_indexX * in_radius);
	if (1 === (in_indexY & 1)){
		x += (0.5 * in_radius);
	}
	const yStep = 0.86602540378443864676372317075294 * in_radius;
	var y = ((in_height * yStep) * (-0.5)) + (0.5 * yStep) + (in_indexY * yStep);
	return {"x":x,"y":y};
}

const makeDistance = function(in_x, in_y){
	return Math.sqrt((in_x * in_x) + (in_y * in_y));
}

const makeNodeHeight = function(in_radius, in_x, in_y, in_width, in_height){
	const origin = makeNodeOrigin(in_radius, in_x, in_y, in_width, in_height);
	var d = makeDistance(origin.x, origin.y) / (Math.max(in_width, in_height) * 0.5 * in_radius);
	var h = 1.0 + Math.cos(d * Math.PI * 2.0);
	return h;
}

const makePlane = function(in_nX, in_nY, in_nZ, in_pX, in_pY, in_pZ){
	var d = (in_nX * in_pX) + (in_nY * in_pY) + (in_nZ * in_pZ);
	return [in_nX, in_nY, in_nZ, d];
}

const sHalfSqrt3 = 0.86602540378443864676372317075294;
const sQuaterSqrt3 = 0.43301270189221932338186158537647;

const makeNode = function(in_nodeOrigin, in_objectId, in_radius, in_low, in_high){
	const result = {
		"objectid" : in_objectId,
		"convexhull" : [],
		"colour" : [0.2,0.2,0.5]
	};

	result.convexhull.push(makePlane(0.0, 0.0, 1.0, 0, 0, in_high));
	result.convexhull.push(makePlane(0.0, 0.0, -1.0, 0, 0, in_low));

	result.convexhull.push(makePlane(1.0, 0.0, 0.0, in_nodeOrigin.x + (0.5 * in_radius), 0, 0));
	result.convexhull.push(makePlane(-1.0, 0.0, 0.0, in_nodeOrigin.x - (0.5 * in_radius), 0, 0));

	result.convexhull.push(makePlane(0.5, sHalfSqrt3, 0.0, in_nodeOrigin.x + (0.25 * in_radius), in_nodeOrigin.y + (sQuaterSqrt3 * in_radius), 0));
	result.convexhull.push(makePlane(0.5, -sHalfSqrt3, 0.0, in_nodeOrigin.x + (0.25 * in_radius), in_nodeOrigin.y - (sQuaterSqrt3 * in_radius), 0));

	result.convexhull.push(makePlane(-0.5, sHalfSqrt3, 0.0, in_nodeOrigin.x - (0.25 * in_radius), in_nodeOrigin.y + (sQuaterSqrt3 * in_radius), 0));
	result.convexhull.push(makePlane(-0.5, -sHalfSqrt3, 0.0, in_nodeOrigin.x - (0.25 * in_radius), in_nodeOrigin.y - (sQuaterSqrt3 * in_radius), 0));

	return result;
}

const makeShere = function(in_objectIDorUndefined, in_x, in_y, in_z, in_radius){
	const result = {
		"sphere" : [in_x, in_y, in_z, in_radius],
		"colour" : [1,1,1]
	};
	if (undefined !== in_objectIDorUndefined){
		result["objectid"] = in_objectIDorUndefined;
	}
	return result;
}

const test = function(){
	const result = {
		"background" : [0.5, 0.5, 0.5],
		"nodearray" : []
	};

	var radius = 1.0;
	const nodeOrigin = {
		"x" : 0,
		"y" : 0
	};
	result.nodearray.push(makeNode(nodeOrigin, 1, radius, -1, 1));
	return result;
}

const addNodeConvexHull = function(trace, out_nodearray, indexX, indexY, width, height, radius){
	var nodeOrigin = makeNodeOrigin(radius, indexX, indexY, width, height);
	//console.log("index:" + indexX + ", " + indexY);
	//console.log("nodeOrigin:" + nodeOrigin.x + ", " + nodeOrigin.y);
	var height = makeNodeHeight(radius, indexX, indexY, width, height);
	out_nodearray.push(makeNode(nodeOrigin, trace, radius, -1, height));
	return trace + 1;
}

const run5 = function(){
	const result = {
		"background" : [0.5, 0.5, 0.5],
		"nodearray" : []
	};

	const radius = 1.0;
	const width = 16;
	const height = 16;

	var trace = 1;
	trace = addNodeConvexHull(trace, result.nodearray, 9, 8, width, height, radius);
	trace = addNodeConvexHull(trace, result.nodearray, 10, 8, width, height, radius);
	trace = addNodeConvexHull(trace, result.nodearray, 8, 9, width, height, radius);
	trace = addNodeConvexHull(trace, result.nodearray, 9, 9, width, height, radius);
	trace = addNodeConvexHull(trace, result.nodearray, 10, 9, width, height, radius);
	trace = addNodeConvexHull(trace, result.nodearray, 9, 10, width, height, radius);
	trace = addNodeConvexHull(trace, result.nodearray, 10, 10, width, height, radius);

	return result;
}

const run = function(){
	const result = {
		"background" : [0.5, 0.5, 0.5],
		"nodearray" : []
	};

	const radius = 1.0;
	const width = 16;
	const height = 16;

	var trace = 1;
	for (var indexY = 0; indexY < 16; ++indexY){
		for (var indexX = 0; indexX < 16; ++indexX){
			trace = addNodeConvexHull(trace, result.nodearray, indexX, indexY, width, height, radius);
		}
	}

	result.nodearray.push(makeShere(undefined, 0, 0, 3, 1));

	return result;
}

/*
	   / \ / \
	  |	  |	  |
	 / \ / \ /
	|	|	|
	 \ / \ /
*/
const runTestMakeNodeOrigin0 = function(){
	console.log("runTestMakeNodeOrigin0");
	const result0 = makeNodeOrigin(1.0, 0, 0, 2, 2);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin000", result0.x, -0.75);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin001", result0.y, 0.86602540378443864676372317075294 * (-0.5));

	const result1 = makeNodeOrigin(1.0, 1, 0, 2, 2);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin010", result1.x, 0.25);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin011", result1.y, 0.86602540378443864676372317075294 * (-0.5));

	const result2 = makeNodeOrigin(1.0, 0, 1, 2, 2);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin020", result2.x, -0.25);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin021", result2.y, 0.86602540378443864676372317075294 * (0.5));

	const result3 = makeNodeOrigin(1.0, 1, 1, 2, 2);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin030", result3.x, 0.75);
	UnitTest.dealTestAlmost("runTestMakeNodeOrigin031", result3.y, 0.86602540378443864676372317075294 * (0.5));
}

const unittest = function(){
	console.log("basic unittest start");
	runTestMakeNodeOrigin0();
	console.log("basic unittest end");
}

module.exports = {
	"run" : run,
	"run5" : run5,
	"unittest" : unittest,
	"test" : test
}