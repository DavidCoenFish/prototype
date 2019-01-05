const Q = require('q');
const Unittest = require("unittest");
const Matrix33 = require("./../source/matrix33.js");

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

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);

	return;
}
