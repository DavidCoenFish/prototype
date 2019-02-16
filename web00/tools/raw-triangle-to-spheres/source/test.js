const Geometry = require("./geometry.js");
const BarycentricTriangle = require("./barycentric-triangle.js");
const SpaceInvestigator = require("./space-investigator.js");
const SpaceGeneratorBbc = require("./sample-generator-bbc.js");
const FsExtra = require("fs-extra");

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

	const intersect2 = Geometry.rayPlaneIntersection([0,-0.13541964238048396,-0.875], [1,0,0], [0.04571287365044965,-0.1294732246360698,-0.8690733764450884], [-0.8905572216506746,-0.42512798849394023,0.16178389402201765]);
	dealTestAlmost("GeometryRayPlaneIntersect3:", intersect2[0], 0.04747486753378796, 0.000001);
	dealTestAlmost("GeometryRayPlaneIntersect4:", intersect2[1], -0.13541964238048396, 0.000001);
	dealTestAlmost("GeometryRayPlaneIntersect5:", intersect2[2], -0.875, 0.000001);

	return;
}

const testBarycentricTriangle0 = function(){
	console.log("testBarycentricTriangle0");

	const triangle0 = BarycentricTriangle.factory([0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 1.0]);
	const point0 = triangle0.projectRayOntoTrianglePlane([-1.0, 0.5, 0.5], [1.0, 0.0, 0.0]);

	dealTestAlmost("BarycentricTriangle0.0:", point0[0], -0.5, 0.000001);
	dealTestAlmost("BarycentricTriangle0.1:", point0[1], 0.5, 0.000001);
	dealTestAlmost("BarycentricTriangle0.2:", point0[2], 0.5, 0.000001);

	const inTriangle0 = triangle0.testPointInTriangle(point0);
	dealTest("BarycentricTriangle0.3:", inTriangle0, true);

	const triangle1 = BarycentricTriangle.factory([0.04571287365044965,-0.1294732246360698,-0.8690733764450884], [0.04987445147157945,-0.1383984275030379,-0.8696187357974481], [0.050585965535185046,-0.13814822257883855,-0.8650446519044901]);
	const point1 = triangle1.projectRayOntoTrianglePlane([0,-0.13541964238048396,-0.875], [1.0, 0.0, 0.0]);

	dealTestAlmost("BarycentricTriangle1.0:", point1[0], 0.04747486753378796, 0.000001);
	dealTestAlmost("BarycentricTriangle1.1:", point1[1], -0.13541964238048396, 0.000001);
	dealTestAlmost("BarycentricTriangle1.2:", point1[2], -0.875, 0.000001);

	const inTriangle1 = triangle1.testPointInTriangle(point1);
	dealTest("BarycentricTriangle1.3:", inTriangle1, false);

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

	const inside1 = spaceInvestigator.isPointInsideOnRayX([-0.001, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.1:", inside1, false);

	const inside1b = spaceInvestigator.isPointInsideOnRayX([0.0, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.1b:", inside1b, true);

	const inside2 = spaceInvestigator.isPointInsideOnRayX([0.25, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.2:", inside2, true);

	const inside3 = spaceInvestigator.isPointInsideOnRayX([1.0, 0.5, 0.1], dataOfInterest0);
	dealTest("testInside.3:", inside3, false);

	return;
}

const testSampleGeneratorBbc = function(){
	console.log("testSampleGeneratorBbc");

	const debugIndexArray = [];
	const sphereArray = SpaceGeneratorBbc.visitDebug(0.00725, 10, debugIndexArray);

	FsExtra.writeJSONSync(".\\output\\spheres_10x10x10.json", sphereArray);
	FsExtra.writeJSONSync(".\\output\\spheres_10x10x10_index.json", debugIndexArray);

	return;
}

const testSampleGeneratorBbcSimple = function(){
	console.log("testSampleGeneratorBbcSphere");

	const debugIndexArray = [];
	const sphereArray = SpaceGeneratorBbc.visitDebugSimple(1.0, 3, debugIndexArray);

	console.log(JSON.stringify(debugIndexArray));
	console.log(JSON.stringify(sphereArray));
}

const testSampleGeneratorBbcSphere = function(){
	console.log("testSampleGeneratorBbcSphere");

	const debugIndexArray = [];
	const sphereArray = SpaceGeneratorBbc.visitDebugSphere(0.00725, 10, debugIndexArray);

	FsExtra.writeJSONSync(".\\output\\sphere.json", sphereArray);
	FsExtra.writeJSONSync(".\\output\\sphere_index.json", debugIndexArray);

	return;
}

const run = function(){
	testGeometryRayPlaneIntersect();
	testBarycentricTriangle0();
	testRayDistance();
	testInside();
	testSampleGeneratorBbc();
	//testSampleGeneratorBbcSimple();
	testSampleGeneratorBbcSphere();

	console.log("done");
}

module.exports = {
	"run" : run
}
