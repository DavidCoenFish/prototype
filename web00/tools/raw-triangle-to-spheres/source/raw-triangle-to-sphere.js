const BarycentricTriangle = require("./barycentric-triangle.js");
const SpaceInvestigator = require("./space-investigator.js");
const SampleGenerator = require("./sample-generator.js");

const makeBarycentricTriangleArray = function(in_rawTriangle) {
	const barycentricTriangleArray = [];
	for (var index = 0; index < in_rawTriangle.length; index += 9){
		barycentricTriangleArray.push(
			BarycentricTriangle.factory(
				[ 
					in_rawTriangle[index + 0], 
					in_rawTriangle[index + 1], 
					in_rawTriangle[index + 2]
				],
				[ 
					in_rawTriangle[index + 3], 
					in_rawTriangle[index + 4], 
					in_rawTriangle[index + 5]
				],
				[ 
					in_rawTriangle[index + 6], 
					in_rawTriangle[index + 7], 
					in_rawTriangle[index + 8]
				]
			)
		);
	}
	return barycentricTriangleArray;
};

const getRawTiangleArrayMin = function(in_rawTiangleArray){
	var low = [in_rawTiangleArray[0], in_rawTiangleArray[1], in_rawTiangleArray[2]];

	for (var index = 0; index < in_rawTiangleArray.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			low[subIndex] = Math.min(low[subIndex], in_rawTiangleArray[index + subIndex]);
		}
	}

	return low;
}

const getRawTiangleArrayDim = function(in_rawTiangleArray){
	var low = [in_rawTiangleArray[0], in_rawTiangleArray[1], in_rawTiangleArray[2]];
	var high = [in_rawTiangleArray[0], in_rawTiangleArray[1], in_rawTiangleArray[2]];

	for (var index = 0; index < in_rawTiangleArray.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			low[subIndex] = Math.min(low[subIndex], in_rawTiangleArray[index + subIndex]);
			high[subIndex] = Math.max(high[subIndex], in_rawTiangleArray[index + subIndex]);
		}
	}

	var dim = [
		(high[0] - low[0]), 
		(high[1] - low[1]), 
		(high[2] - low[2])
		];
	return dim;
}


const run = function(in_rawTriangle, in_sphereDiameter, in_debugIndexArray){
	const barycentricTriangleArray = makeBarycentricTriangleArray(in_rawTriangle);
	const dim = getRawTiangleArrayDim(in_rawTriangle);
	const min = getRawTiangleArrayMin(in_rawTriangle);

	const spaceInvestigator = SpaceInvestigator.factory(barycentricTriangleArray);
	const arraySphereInside = SampleGenerator.visit(spaceInvestigator, in_sphereDiameter, min, dim, in_debugIndexArray);

	return arraySphereInside;
}

module.exports = {
	"run" : run
};
