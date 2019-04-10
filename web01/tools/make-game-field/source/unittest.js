const dealTest = function(testName, value, expected)
{
	var success = (value === expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expected:" + expected);
	}

	return;
}

const dealTestNot = function(testName, value, expected)
{
	var success = (value !== expected);
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " notExpected:" + expected);
	}

	return;
}

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

const dealTestRange = function(testName, value, expectedLow, expectedHigh)
{
	var success = ((expectedLow <= value) && (value < expectedHigh));
	if (true != success)
	{
		dealTestFail(testName + " value: " + value + " expectedLow:" + expectedLow + " expectedHigh:" + expectedHigh);
	}

	return;
}

const dealTestFail = function(testName)
{
	throw testName;
}

module.exports = {
	"dealTest" : dealTest,
	"dealTestNot" : dealTestNot,
	"dealTest" : dealTest,
	"dealTestAlmost" : dealTestAlmost,
	"dealTestRange" : dealTestRange,
	"dealTestFail" : dealTestFail,
};
