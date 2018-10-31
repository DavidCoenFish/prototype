const Unittest = require("unittest");
const Path = require("path");

console.log("dsc@core unittest");

const promiseArray = [];
const unittestPath = Path.join(__dirname, "/unittest");
Unittest.gatherUnitTestPromises(promiseArray, unittestPath);
Unittest.runUnitTests(promiseArray);