const Q = require('q');
const Unittest = require("unittest");
const Quaternion = require("./../source/quaternion.js");

function runSanity(){
	return Q(true).then(function(){

		const value = Quaternion.factoryFloat32();

		Unittest.dealTestAlmost("Quaternion::runSanity::0", value.getW(), 0.0);
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

		return;
	});
}

function runYawPitchRoll(){
	return Q(true).then(function(){
		const yaw = Math.PI / 8.0;
		const pitch = Math.PI / 9.0;
		const roll = Math.PI / 10.0;
		const value = Quaternion.factoryYawPitchRoll(yaw, pitch, roll);
		const result = Quaternion.quaternionToYawPitchRoll(value);

		Unittest.dealTestAlmost("Quaternion::runYawPitchRoll::0", result.getX(), yaw);
		Unittest.dealTestAlmost("Quaternion::runYawPitchRoll::1", result.getY(), pitch);
		Unittest.dealTestAlmost("Quaternion::runYawPitchRoll::2", result.getZ(), roll);

		return;
	});
}



module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);
	in_promiseArray.push(runYawPitchRoll);

	return;
}
