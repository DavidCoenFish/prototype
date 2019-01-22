const BarycentricTriangle = require("./barycentric-triangle.js");
const RawTriangleScale = require("./raw-triangle-scale.js");
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

const rawTriangleToSphere = function(in_rawTriangle, in_sphereDiameter){
	const barycentricTriangleArray = makeBarycentricTriangleArray(in_rawTriangle);
	const dim = RawTriangleScale.getRawTiangleArrayDim(in_rawTriangle);
	const min = RawTriangleScale.getRawTiangleArrayMin(in_rawTriangle);

	const spaceInvestigator = SpaceInvestigator.factory(barycentricTriangleArray);
	const arraySphereInside = SampleGenerator.visit(spaceInvestigator, in_sphereDiameter, min, dim);

	return arraySphereInside;
}

module.exports = {
	"rawTriangleToSphere" : rawTriangleToSphere
};
