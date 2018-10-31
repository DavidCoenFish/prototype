const Q = require('q');
const Unittest = require("unittest");
const EventDispatcherDecorate = require("./../source/eventdispatcherdecorate.js");

function runSanity(){
	return Q(true).then(function(){
		const result = Object.create(null);
		EventDispatcherDecorate(result);

		var countA = 0;
		var countB = 0;
		const callbackIncrementA = function(){
			countA += 1;
		};
		const callbackIncrementB = function(){
			countB += 1;
		};
		result.addEventListener("a", callbackIncrementA);
		result.addEventListener("a", callbackIncrementA);
		result.addEventListener("b", callbackIncrementB);

		result.triggerEvent("a");
		Unittest.dealTest("EventDispatcherDecorate::runSanity::0", countA, 2);
		Unittest.dealTest("EventDispatcherDecorate::runSanity::1", countB, 0);

		result.triggerEvent("b");
		Unittest.dealTest("EventDispatcherDecorate::runSanity::2", countA, 2);
		Unittest.dealTest("EventDispatcherDecorate::runSanity::3", countB, 1);

		result.triggerEvent("c");
		Unittest.dealTest("EventDispatcherDecorate::runSanity::2", countA, 2);
		Unittest.dealTest("EventDispatcherDecorate::runSanity::3", countB, 1);

		result.removeEventListener("a", callbackIncrementA);
		result.triggerEvent("a");
		Unittest.dealTest("EventDispatcherDecorate::runSanity::4", countA, 3);
		Unittest.dealTest("EventDispatcherDecorate::runSanity::5", countB, 1);

		result.removeEventListener("a", callbackIncrementA);
		result.triggerEvent("a");
		Unittest.dealTest("EventDispatcherDecorate::runSanity::6", countA, 3);
		Unittest.dealTest("EventDispatcherDecorate::runSanity::7", countB, 1);

	});
}

module.exports = function(in_promiseArray) {
	in_promiseArray.push(runSanity);

	return;
}
