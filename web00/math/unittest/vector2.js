const Q = require('q');
const Unittest = require("unittest");
const Vector2 = require("./../source/vector2.js");

function runCreate(){
	return Q(true).then(function(){
		const test = Vector2.factoryFloat32(3.5, 4.5);
		Unittest.dealTest("Vector2::RunCreate::0", test.getX(), 3.5);
		Unittest.dealTest("Vector2::RunCreate::1", test.getY(), 4.5);
		test.setX(2.5);
		test.setY(3.25);
		Unittest.dealTest("Vector2::RunCreate::2", test.getX(), 2.5);
		Unittest.dealTest("Vector2::RunCreate::3", test.getY(), 3.25);
	});
}

function runDotProduct(){
	return Q(true).then(function(){
		const vector0 = Vector2.factoryFloat32(1.5, 2.5);
		const vector1 = Vector2.factoryFloat32(3, 4);
		const result = vector0.dotProduct(vector1);
		Unittest.dealTest("Vector2::runDotProduct::0", result, 14.5);
	});
}

function runCrossProduct(){
	return Q(true).then(function(){
		const vector0 = Vector2.factoryFloat32(1.5, 2.5);
		const vector1 = vector0.crossProduct(); 
		Unittest.dealTest("Vector2::runCrossProduct::0", vector0.getX(), 1.5);
		Unittest.dealTest("Vector2::runCrossProduct::1", vector0.getY(), 2.5);
		Unittest.dealTest("Vector2::runCrossProduct::2", vector1.getX(), 2.5);
		Unittest.dealTest("Vector2::runCrossProduct::3", vector1.getY(), -1.5);
	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runCreate);
	in_promiseArray.push(runDotProduct);
	in_promiseArray.push(runCrossProduct);

	return;
}
