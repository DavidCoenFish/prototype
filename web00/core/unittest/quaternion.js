const Q = require('q');
const Unittest = require("unittest");
const Quaternion = require("./../source/quaternion.js");
const Matrix33 = require("./../source/matrix33.js");

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

		Unittest.dealTestAlmost("Quaternion::runYawPitchRoll::0", result.getX(), yaw, 0.000001);
		Unittest.dealTestAlmost("Quaternion::runYawPitchRoll::1", result.getY(), pitch, 0.000001);
		Unittest.dealTestAlmost("Quaternion::runYawPitchRoll::2", result.getZ(), roll, 0.000001);

		return;
	});
}

function runMatrix33(){
	return Q(true).then(function(){
		const quaternionSource = Quaternion.factoryYawPitchRoll(0.2, 0.1, 0.05);
		const matrix = Matrix33.factoryQuaternion(quaternionSource);
		const quaternionDest = Quaternion.factoryMatrix33(matrix);

		Unittest.dealTestAlmost("Quaternion::runMatrix33::0", quaternionSource.getW(), quaternionDest.getW(), 0.000001);
		Unittest.dealTestAlmost("Quaternion::runMatrix33::1", quaternionSource.getX(), quaternionDest.getX(), 0.000001);
		Unittest.dealTestAlmost("Quaternion::runMatrix33::2", quaternionSource.getY(), quaternionDest.getY(), 0.000001);
		Unittest.dealTestAlmost("Quaternion::runMatrix33::3", quaternionSource.getZ(), quaternionDest.getZ(), 0.000001);

		return;
	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);
	in_promiseArray.push(runYawPitchRoll);
	in_promiseArray.push(runMatrix33);

	return;
}
