const dealTest = function(testName, value, expected)
{
	var success = (value === expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected);
	}

	return;
}
module.exports.dealTest = dealTest;

const dealTestNot = function(testName, value, expected)
{
	var success = (value !== expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " notExpected:" + expected);
	}

	return;
}
module.exports.dealTestNot = dealTestNot;

const dealTestAlmost = function(testName, value, expected, epsilonOrUndefined)
{
	const epsilon = (undefined === epsilonOrUndefined) ? Number.MIN_VALUE : epsilonOrUndefined;
	var success = (Math.abs(expected - value) <= epsilon);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected + " epsilon:" + epsilon);
	}

	return;
}
module.exports.dealTest = dealTest;


const dealTestRange = function(testName, value, expectedLow, expectedHigh)
{
	var success = ((expectedLow <= value) && (value < expectedHigh));
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expectedLow:" + expectedLow + " expectedHigh:" + expectedHigh);
	}

	return;
}
module.exports.dealTestRange = dealTestRange;

const dealTestFail = function(testName)
{
	throw testName;
}
module.exports.dealTestFail = dealTestFail;
