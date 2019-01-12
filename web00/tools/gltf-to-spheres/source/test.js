const Geometry = require("./geometry.js");
const BarycentricTriangle = require("./barycentric-triangle.js");
const SpaceInvestigator = require("./space-investigator.js");

const dealTest = function(testName, value, expected)
{
	var success = (value === expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected);
	}

	return;
}

const dealTestNot = function(testName, value, expected)
{
	var success = (value !== expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " notExpected:" + expected);
	}

	return;
}

const dealTestAlmost = function(testName, value, expected, epsilonOrUndefined)
{
	const epsilon = (undefined === epsilonOrUndefined) ? Number.MIN_VALUE : epsilonOrUndefined;
	var success = (Math.abs(expected - value) <= epsilon);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected + " epsilon:" + epsilon);
	}

	return;
}

const dealTestRange = function(testName, value, expectedLow, expectedHigh)
{
	var success = ((expectedLow <= value) && (value < expectedHigh));
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expectedLow:" + expectedLow + " expectedHigh:" + expectedHigh);
	}

	return;
}

const dealTestFail = function(in_message){
	console.log("FAIL:" + in_message);
}

const testGeometryRayPlaneIntersect = function(){
	console.log("testGeometryRayPlaneIntersect");

	const intersect0 = Geometry.rayPlaneIntersection([1.0, 2.0, -1.0], [0.0, 0.0, 1.0], [0.0, 0.0, 0.5], [0.0, 0.0, 1.0]);
	dealTestAlmost("GeometryRayPlaneIntersect0:", intersect0[0], 1.0, 0.000001);
	dealTestAlmost("GeometryRayPlaneIntersect1:", intersect0[1], 2.0, 0.000001);
	dealTestAlmost("GeometryRayPlaneIntersect2:", intersect0[2], 0.5, 0.000001);

	const intersect1 = Geometry.rayPlaneIntersection([1.0, 2.0, 0.0], [0.70710678118654752440084436210485, 0.0, 0.70710678118654752440084436210485], [0.0, 0.0, 1.0], [0.0, 0.0, 1.0]);
	dealTestAlmost("GeometryRayPlaneIntersect3:", intersect1[0], 2.0, 0.000001);
	dealTestAlmost("GeometryRayPlaneIntersect4:", intersect1[1], 2.0, 0.000001);
	dealTestAlmost("GeometryRayPlaneIntersect5:", intersect1[2], 1.0, 0.000001);

	return;
}

const testBarycentricTriangle0 = function(){
	console.log("testBarycentricTriangle0");

	const triangle0 = BarycentricTriangle.factory([0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 1.0]);
	const point0 = triangle0.projectRayOntoTrianglePlane([-1.0, 0.5, 0.5], [1.0, 0.0, 0.0]);

	dealTestAlmost("BarycentricTriangle0.0:", point0[0], -0.5, 0.000001);
	dealTestAlmost("BarycentricTriangle0.1:", point0[1], 0.5, 0.000001);
	dealTestAlmost("BarycentricTriangle0.2:", point0[2], 0.5, 0.000001);

	const inTriangle = triangle0.testPointInTriangle(point0);
	dealTest("BarycentricTriangle0.3:", inTriangle, true);

	return;
}

const testRayDistance = function(){
	console.log("testRayDistance");

	const distance0 = Geometry.rayDistance([1.0, 2.0, 3.0], [-1.0, 4.0, 7.0], [1.0, 0.0, 0.0]);
	dealTestAlmost("testRayDistance.0:", distance0, 2, 0.000001);

	return;
}

const testInside = function(){
	console.log("testInside");

	const pointA = [0.0, 0.0, 0.0];
	const pointB = [1.0, 0.0, 0.0];
	const pointC = [0.0, 1.0, 0.0];
	const pointD = [0.0, 0.0, 1.0];
	const arrayTriangle = [];
	arrayTriangle.push(BarycentricTriangle.factory(pointA, pointC, pointB));
	arrayTriangle.push(BarycentricTriangle.factory(pointB, pointC, pointD));
	arrayTriangle.push(BarycentricTriangle.factory(pointA, pointB, pointD));
	arrayTriangle.push(BarycentricTriangle.factory(pointA, pointD, pointC));

	const spaceInvestigator = SpaceInvestigator.factory(arrayTriangle);

	const dataOfInterest0 = spaceInvestigator.calculateDataOfInterestOnRayX(0.5, 0.1);

	const inside0 = spaceInvestigator.isPointInsideOnRayX([-0.1, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.0:", inside0, false);

	const inside1 = spaceInvestigator.isPointInsideOnRayX([0.0, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.1:", inside1, false);

	const inside1b = spaceInvestigator.isPointInsideOnRayX([0.001, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.1b:", inside1b, true);

	const inside2 = spaceInvestigator.isPointInsideOnRayX([0.25, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.2:", inside2, true);

	const inside3 = spaceInvestigator.isPointInsideOnRayX([1.0, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.3:", inside3, false);

	return;
}

const run = function(){
	testGeometryRayPlaneIntersect();
	testBarycentricTriangle0();
	testRayDistance();
	testInside();

	console.log("done");
}

module.exports = {
	"run" : run
}
