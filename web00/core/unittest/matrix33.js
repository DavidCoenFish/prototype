const Q = require('q');
const Unittest = require("unittest");

// function runSanity(){
// 	return Q(true).then(function(){
// 		const value0 = "abcd";
// 		const value1 = value0;
// 		const value2 = StringUtil.deepCopyString(value0);
// 		value0 += "Z";

// 		Unittest.dealTest("StringUtil::runSanity::0", value0, "abcdZ");
// 		Unittest.dealTest("StringUtil::runSanity::1", value1, "abcd");
// 		Unittest.dealTest("StringUtil::runSanity::2", value2, "abcd");
// 	});
// }

module.exports = function(in_promiseArray) {
	//in_promiseArray.push(runSanity);

	return;
}
