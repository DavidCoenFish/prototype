const Q = require('q');
const Unittest = require("unittest");
const Vector3 = require("./../source/vector3.js");

function runSanity(){
	return Q(true).then(function(){

		const value = Vector3.factoryFloat32();

		Unittest.dealTestAlmost("Vector3::runSanity::1", value.getX(), 0.0);
		Unittest.dealTestAlmost("Vector3::runSanity::2", value.getY(), 0.0);
		Unittest.dealTestAlmost("Vector3::runSanity::3", value.getZ(), 0.0);

		value.setX(0.25);
		value.setY(0.5);
		value.setZ(0.75);

		Unittest.dealTestAlmost("Vector3::runSanity::1", value.getX(), 0.25);
		Unittest.dealTestAlmost("Vector3::runSanity::2", value.getY(), 0.5);
		Unittest.dealTestAlmost("Vector3::runSanity::3", value.getZ(), 0.75);

	});
}

const runCross = function(){
	return Q(true).then(function(){
		const at = Vector3.factoryFloat32(1.0, 0.0, 0.0);
		const left = Vector3.factoryFloat32(0.0, 1.0, 0.0);
		const up = Vector3.crossProduct(at, left);

		Unittest.dealTestAlmost("Vector3::runCross::0", up.getX(), 0.0);
		Unittest.dealTestAlmost("Vector3::runCross::1", up.getY(), 0.0);
		Unittest.dealTestAlmost("Vector3::runCross::2", up.getZ(), 1.0);
	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);
	in_promiseArray.push(runCross);

	return;
}
