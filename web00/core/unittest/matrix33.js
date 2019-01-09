const Q = require('q');
const Unittest = require("unittest");
const Matrix33 = require("./../source/matrix33.js");
const Quaternion = require("./../source/quaternion.js");
const Vector3 = require("./../source/vector3.js");

function runSanity(){
	return Q(true).then(function(){
		const value = Matrix33.factoryFloat32();

		Unittest.dealTestAlmost("Matrix33::runSanity::0", value.get00(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::1", value.get10(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::2", value.get20(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::3", value.get01(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::4", value.get11(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::5", value.get21(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::6", value.get02(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::7", value.get12(), 0.0);
		Unittest.dealTestAlmost("Matrix33::runSanity::8", value.get22(), 0.0);

		value.set00(0.125);
		value.set10(0.25);
		value.set20(0.375);
		value.set01(0.5);
		value.set11(0.625);
		value.set21(0.75);
		value.set02(0.875);
		value.set12(1.125);
		value.set22(1.25);

		Unittest.dealTestAlmost("Matrix33::runSanity::10", value.get00(), 0.125);
		Unittest.dealTestAlmost("Matrix33::runSanity::11", value.get10(), 0.25);
		Unittest.dealTestAlmost("Matrix33::runSanity::12", value.get20(), 0.375);
		Unittest.dealTestAlmost("Matrix33::runSanity::13", value.get01(), 0.5);
		Unittest.dealTestAlmost("Matrix33::runSanity::14", value.get11(), 0.625);
		Unittest.dealTestAlmost("Matrix33::runSanity::15", value.get21(), 0.75);
		Unittest.dealTestAlmost("Matrix33::runSanity::16", value.get02(), 0.875);
		Unittest.dealTestAlmost("Matrix33::runSanity::17", value.get12(), 1.125);
		Unittest.dealTestAlmost("Matrix33::runSanity::18", value.get22(), 1.25);

		return;
	});
}

const runAtUpRight0 = function(){
	return Q(true).then(function(){
		const quat = Quaternion.factoryYawPitchRoll(0.0, 0.0, 0.0);
		const mat = Matrix33.factoryQuaternion(quat);

		const at = mat.getAt();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::0", at.getX(), 1.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::1", at.getY(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::2", at.getZ(), 0.0);

		const left = mat.getLeft();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::3", left.getX(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::4", left.getY(), 1.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::5", left.getZ(), 0.0);

		const up = mat.getUp();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::6", up.getX(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::7", up.getY(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight0::8", up.getZ(), 1.0);

		return;
	});
}

//45deg yaw
const runAtUpRight1 = function(){
	return Q(true).then(function(){
		const quat = Quaternion.factoryYawPitchRoll(Math.PI * 0.25, 0.0, 0.0);
		const mat = Matrix33.factoryQuaternion(quat);

		const at = mat.getAt();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::0", at.getX(), 0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::1", at.getY(), 0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::2", at.getZ(), 0.0);

		const left = mat.getLeft();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::3", left.getX(), -0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::4", left.getY(), 0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::5", left.getZ(), 0.0);

		const up = mat.getUp();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::6", up.getX(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::7", up.getY(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight1::8", up.getZ(), 1.0);

		return;
	});
}

//45deg pitch
const runAtUpRight2 = function(){
	return Q(true).then(function(){
		const quat = Quaternion.factoryYawPitchRoll(0.0, Math.PI * 0.25, 0.0);
		const mat = Matrix33.factoryQuaternion(quat);

		const at = mat.getAt();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::0", at.getX(), 0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::1", at.getY(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::2", at.getZ(), -0.70710678118654752440084436210485, 0.0000001);

		const left = mat.getLeft();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::3", left.getX(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::4", left.getY(), 1.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::5", left.getZ(), 0.0);

		const up = mat.getUp();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::6", up.getX(), 0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::7", up.getY(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight2::8", up.getZ(), 0.70710678118654752440084436210485, 0.0000001);

		return;
	});
}

//45deg roll
const runAtUpRight3 = function(){
	return Q(true).then(function(){
		const quat = Quaternion.factoryYawPitchRoll(0.0, 0.0, Math.PI * 0.25);
		const mat = Matrix33.factoryQuaternion(quat);

		const at = mat.getAt();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::0", at.getX(), 1.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::1", at.getY(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::2", at.getZ(), 0);

		const left = mat.getLeft();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::3", left.getX(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::4", left.getY(), 0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::5", left.getZ(), 0.70710678118654752440084436210485, 0.0000001);

		const up = mat.getUp();
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::6", up.getX(), 0.0);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::7", up.getY(), -0.70710678118654752440084436210485, 0.0000001);
		Unittest.dealTestAlmost("Matrix33:: runAtUpRight3::8", up.getZ(), 0.70710678118654752440084436210485, 0.0000001);

		return;
	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);
	in_promiseArray.push(runAtUpRight0);
	in_promiseArray.push(runAtUpRight1);
	in_promiseArray.push(runAtUpRight2);
	in_promiseArray.push(runAtUpRight3);

	return;
}
