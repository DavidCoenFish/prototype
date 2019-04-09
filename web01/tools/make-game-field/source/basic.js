const Test = require("./test.js");

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

	result.convexhull.push(makePlane(0.5, 0.28867513459481288225457439025098, 0.0, in_nodeOrigin.x + (0.25 * in_radius), in_nodeOrigin.y + (0.14433756729740644112728719512549 * in_radius), 0));
	result.convexhull.push(makePlane(0.5, -0.28867513459481288225457439025098, 0.0, in_nodeOrigin.x + (0.25 * in_radius), in_nodeOrigin.y - (0.14433756729740644112728719512549 * in_radius), 0));

	result.convexhull.push(makePlane(-0.5, 0.28867513459481288225457439025098, 0.0, in_nodeOrigin.x - (0.25 * in_radius), in_nodeOrigin.y + (0.14433756729740644112728719512549 * in_radius), 0));
	result.convexhull.push(makePlane(-0.5, -0.28867513459481288225457439025098, 0.0, in_nodeOrigin.x - (0.25 * in_radius), in_nodeOrigin.y - (0.14433756729740644112728719512549 * in_radius), 0));

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

const run = function(){
	const result = {
		"background" : [0.5, 0.5, 0.5],
		"nodearray" : []
	};

	var radius = 1.0;
	var width = 16;
	var height = 16;

	var trace = 1;
	for (var indexY = 0; indexY < 16; ++indexY){
		for (var indexX = 0; indexX < 16; ++indexX){
			var nodeOrigin = makeNodeOrigin(radius, indexX, indexY, width, height);
			var height = makeNodeHeight(radius, indexX, indexY, width, height);
			result.nodearray.push(makeNode(nodeOrigin, trace, radius, -1, height));
			++trace;
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
	Test.dealTestAlmost("runTestMakeNodeOrigin000", result0.x, -0.75);
	Test.dealTestAlmost("runTestMakeNodeOrigin001", result0.y, 0.86602540378443864676372317075294 * (-0.5));

	const result1 = makeNodeOrigin(1.0, 1, 0, 2, 2);
	Test.dealTestAlmost("runTestMakeNodeOrigin010", result1.x, 0.25);
	Test.dealTestAlmost("runTestMakeNodeOrigin011", result1.y, 0.86602540378443864676372317075294 * (-0.5));

	const result2 = makeNodeOrigin(1.0, 0, 1, 2, 2);
	Test.dealTestAlmost("runTestMakeNodeOrigin020", result2.x, -0.25);
	Test.dealTestAlmost("runTestMakeNodeOrigin021", result2.y, 0.86602540378443864676372317075294 * (0.5));

	const result3 = makeNodeOrigin(1.0, 1, 1, 2, 2);
	Test.dealTestAlmost("runTestMakeNodeOrigin030", result3.x, 0.75);
	Test.dealTestAlmost("runTestMakeNodeOrigin031", result3.y, 0.86602540378443864676372317075294 * (0.5));
}

const test = function(){
	console.log("basic test start");
	runTestMakeNodeOrigin0();
	console.log("basic test end");
}

module.exports = {
	"run" : run,
	"test" : test
}