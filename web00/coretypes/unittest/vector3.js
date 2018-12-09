const Q = require('q');
const Unittest = require("unittest");
const Vector3 = require("./../source/vector3.js");

function runCreate(){
	return Q(true).then(function(){
		const test = Vector3.factoryFloat32(3.5, 4.5, 5.5);
		Unittest.dealTest("Vector3::RunCreate::0", test.getX(), 3.5);
		Unittest.dealTest("Vector3::RunCreate::1", test.getY(), 4.5);
		Unittest.dealTest("Vector3::RunCreate::2", test.getZ(), 5.5);
		test.setX(2.5);
		test.setY(3.25);
		test.setZ(4.25);
		Unittest.dealTest("Vector3::RunCreate::3", test.getX(), 2.5);
		Unittest.dealTest("Vector3::RunCreate::4", test.getY(), 3.25);
		Unittest.dealTest("Vector3::RunCreate::5", test.getZ(), 4.25);
	});
}

function runDotProduct(){
	return Q(true).then(function(){
		const vector0 = Vector3.factoryFloat32(1.5, 2.5, 3.5);
		const vector1 = Vector3.factoryFloat32(3, 4, 2);
		const result = vector0.dotProduct(vector1);
		Unittest.dealTest("Vector3::runDotProduct::0", result, 21.5);
	});
}

function runCrossProduct(){
	return Q(true).then(function(){
		const vector0 = Vector3.factoryFloat32(1.5, 2.5, 3,5);
		const vector1 = Vector3.factoryFloat32(0, 1, 0);
		const vector2 = vector0.crossProduct(vector1); 
		Unittest.dealTest("Vector3::runCrossProduct::0", vector2.getX(), -3);
		Unittest.dealTest("Vector3::runCrossProduct::1", vector2.getY(), 0);
		Unittest.dealTest("Vector3::runCrossProduct::2", vector2.getZ(), 1.5);
	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runCreate);
	in_promiseArray.push(runDotProduct);
	in_promiseArray.push(runCrossProduct);

	return;
}
