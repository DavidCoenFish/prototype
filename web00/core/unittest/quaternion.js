const Q = require('q');
const Unittest = require("unittest");
const Quaternion = require("./../source/quaternion.js");

function runSanity(){
	return Q(true).then(function(){

		const value = Quaternion.factoryFloat32(1.0, 0.0, 0.0, 0.0);

		Unittest.dealTestAlmost("Quaternion::runSanity::0", value.getW(), 1.0);
		Unittest.dealTestAlmost("Quaternion::runSanity::1", value.getX(), 0.0);
		Unittest.dealTestAlmost("Quaternion::runSanity::2", value.getY(), 0.0);
		Unittest.dealTestAlmost("Quaternion::runSanity::3", value.getZ(), 0.0);

		value.setW(0.125);
		value.setX(0.25);
		value.setY(0.5);
		value.setZ(0.75);

		Unittest.dealTestAlmost("Quaternion::runSanity::0", value.getW(), 0.125);
		Unittest.dealTestAlmost("Quaternion::runSanity::1", value.getX(), 0.25);
		Unittest.dealTestAlmost("Quaternion::runSanity::2", value.getY(), 0.5);
		Unittest.dealTestAlmost("Quaternion::runSanity::3", value.getZ(), 0.75);

	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);

	return;
}
