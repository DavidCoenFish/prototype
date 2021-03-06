const UnitTest = require("./unittest.js");

const sHalfSqrt3 = 0.86602540378443864676372317075294;
const sQuaterSqrt3 = 0.43301270189221932338186158537647;
const sBaseColourNode = [77.0/255.0, 57.0/255.0, 34.0/255.0, 0.5];
const sBaseColourNodeA = [255.0/255.0, 0.0/255.0, 0.0/255.0, 0.5];
const sBaseColourNodeB = [24.0/255.0, 24.0/255.0, 32.0/255.0, 0.0];


// output = {
// 	background : { colour:|,gradient:|,envSphere:|,},
// 	nodeArray : [{
// 		[objectId:],
// 		[convexHull:[[x,y,z,d],]]|,
// 		[sphere:[x,y,z,r]]|,
// 		colour0:[r,g,b, {0 ... 0.5 emittance, 0.5 ... 1.0 refelectivity}]|
// 		colour1:[r,g,b, {0 ... 0.5 emittance, 0.5 ... 1.0 refelectivity}]|
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

const makeNodeColour = function(in_radius, in_x, in_y, in_width, in_height){
	const origin = makeNodeOrigin(in_radius, in_x, in_y, in_width, in_height);
	var d = makeDistance(origin.x, origin.y) / (Math.max(in_width, in_height) * 0.5 * in_radius);
	var h = 0.5 + (Math.cos(d * Math.PI * 2.0) * 0.5);
	var colour = makeColourLerp(sBaseColourNodeA, sBaseColourNodeB, h);
	return colour;
}

const makePlane = function(in_nX, in_nY, in_nZ, in_pX, in_pY, in_pZ){
	var d = (in_nX * in_pX) + (in_nY * in_pY) + (in_nZ * in_pZ);
	return [in_nX, in_nY, in_nZ, d];
}

const makeColourLerp = function(in_colour0, in_colour1, in_ratio){
	return [
		in_colour0[0] + ((in_colour1[0] - in_colour0[0]) * in_ratio),
		in_colour0[1] + ((in_colour1[1] - in_colour0[1]) * in_ratio),
		in_colour0[2] + ((in_colour1[2] - in_colour0[2]) * in_ratio),
		in_colour0[3] + ((in_colour1[3] - in_colour0[3]) * in_ratio)
		];
}

const makeNode = function(in_nodeOrigin, in_objectId, in_radius, in_low, in_high, in_colour0, in_colour1){
	const result = {
		"objectid" : in_objectId,
		"convexhull" : [],
		"colour0" : in_colour0,
		"colour1" : in_colour1,
		"movedata" : { "pos" : [in_nodeOrigin.x, in_nodeOrigin.y, in_high], "steplink" : {} }
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

const makeSphere = function(in_objectIDorUndefined, in_x, in_y, in_z, in_radius, in_rgba){
	const result = {
		"sphere" : [in_x, in_y, in_z, in_radius],
		"colour" : in_rgba
	};
	if (undefined !== in_objectIDorUndefined){
		result["objectid"] = in_objectIDorUndefined;
	}
	return result;
}

//radius1 is the center of cylinder to flat cap (ie, half length), r2 is the pipe radius
const makeCylinder = function(in_objectIDorUndefined, in_x, in_y, in_z, in_nx, in_ny, in_nz, in_radius1, in_radius2, in_rgba){
	const result = {
		"cylinder" : [in_x, in_y, in_z, in_nx, in_ny, in_nz, in_radius1, in_radius2],
		"colour" : in_rgba
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
	addNodeConvexHull(1, result.nodearray, 0, 0, 1, 1, radius);

	populateMoveDataLinks(result.nodearray);

	return result;
}

const addNodeConvexHull = function(trace, out_nodearray, indexX, indexY, width, height, radius){
	var nodeOrigin = makeNodeOrigin(radius, indexX, indexY, width, height);
	//console.log("index:" + indexX + ", " + indexY);
	//console.log("nodeOrigin:" + nodeOrigin.x + ", " + nodeOrigin.y);
	var high = makeNodeHeight(radius, indexX, indexY, width, height);
	var colour = makeNodeColour(radius, indexX, indexY, width, height);
	out_nodearray.push(makeNode(nodeOrigin, trace, radius, -1, high, sBaseColourNode, colour));
	trace++;

	if (((indexX === 0) || (indexX === (width - 1))) &&
		((indexY === 0) || (indexY === (height - 1)))){
		out_nodearray.push(makeSphere(trace, nodeOrigin.x, nodeOrigin.y, high + 1.0, 0.5, colour));
		trace++;
	}

	if (((indexX === 2) || (indexX === (width - 3))) &&
		((indexY === 2) || (indexY === (height - 3)))){
		out_nodearray.push(makeCylinder(trace, nodeOrigin.x, nodeOrigin.y, high + 1.0, 0.0, 0.0, 1.0, 1.0, 0.25, sBaseColourNode));
		trace++;
	}

	return trace;
}

//stepLink
const sLinkKeyArray = ["d", "e", "w", "a", "z", "x"];
const populateMoveDataLinks = function(in_nodeArray){
	for (var index = 0; index < in_nodeArray.length; ++index){
		var node = in_nodeArray[index];
		if (false === ("movedata" in node)){
			continue;
		}
		var data = [];
		for (var subIndex = 0; subIndex < in_nodeArray.length; ++subIndex){
			if (subIndex === index){
				continue;
			}
			var subNode = in_nodeArray[subIndex];
			if (false === ("movedata" in subNode)){
				continue;
			}

			var offset = [
				subNode.movedata.pos[0] - node.movedata.pos[0],
				subNode.movedata.pos[1] - node.movedata.pos[1],
				subNode.movedata.pos[2] - node.movedata.pos[2]
			];
			var distance = Math.sqrt((offset[0] * offset[0]) + (offset[1] * offset[1]));
			var angle = Math.atan2(offset[1], offset[0]) * 180.0 / Math.PI;
			data.push({
				"index" : subIndex,
				"distance" : distance,
				"angle" : angle
			});
		}

		data.sort(function(in_lhs, in_rhs){
			return (in_lhs.distance - in_rhs.distance);
		});

		//console.log(data);
		for (var subIndex = 0; subIndex < data.length; ++subIndex){
			var subData = data[subIndex];
			if (1.5 < subData.distance){
				break;
			}

			var angleIndex = Math.round((subData.angle + 360.0) / 60.0) % 6;
			var key = sLinkKeyArray[angleIndex];
			node.movedata.steplink[key] = subData.index;
		}
	}
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

	populateMoveDataLinks(result.nodearray);

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

	result.nodearray.push(makeSphere(undefined, 0, 0, 5, 2.0, [1.0, 1.0, 1.0, 0.0]));

	populateMoveDataLinks(result.nodearray);

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