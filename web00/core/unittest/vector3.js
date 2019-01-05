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

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);

	return;
}
