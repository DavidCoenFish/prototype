//dataOfInterestOnRayX
const debugDataOfInterestOnRayX = function(in_dataOfInterestOnRayX){
	var message = "const gDataOfInterest = [\n";
	for (var index = 0; index < in_dataOfInterestOnRayX.length; ++index){
		var triangle = in_dataOfInterestOnRayX[index]["triangle"];
		var trianglePointArray = triangle.getPointArray();
		var intersectPoint = in_dataOfInterestOnRayX[index]["point"];

		message += debugPointPair(trianglePointArray[0], trianglePointArray[1]);
		message += debugPointPair(trianglePointArray[1], trianglePointArray[2]);
		message += debugPointPair(trianglePointArray[2], trianglePointArray[0]);
		message += debugPointPair(trianglePointArray[0], intersectPoint);

		break;
	}
	message += "];";
	//console.log(message);

	FsExtra.writeFileSync("debug.js", message);

	return;
}

const calculateX = function(in_min, in_xIndex, in_yIndex, in_zIndex, in_sphereDiameter){
	const zEven = (0 === (in_zIndex & 1));
	if (zEven){
		return in_min[0] + (in_xIndex * in_sphereDiameter);
	} else {
		return in_min[0] + ((0.5 + in_xIndex) * in_sphereDiameter);
	}
}

const calculateY = function(in_min, in_yIndex, in_zIndex, in_sphereDiameter){
	const zEven = (0 === (in_zIndex & 1));
	if (zEven){
		return in_min[1] + (in_yIndex * in_sphereDiameter);
	} else {
		return in_min[1] + ((0.5 + in_yIndex) * in_sphereDiameter);
	}
}

const calculateZ = function(in_min, in_zIndex, in_sphereDiameter){
	return in_min[2] + (in_zIndex * in_sphereDiameter * 0.5);
}

const visit = function(in_spaceInvestigator, in_sphereDiameter, in_min, in_dim, in_debugIndexArray){
	const floatArray = [];
	const xCount = Math.ceil(in_dim[0] / in_sphereDiameter) + 1;
	const yCount = Math.ceil(in_dim[1] / in_sphereDiameter) + 1;;
	const zCount = Math.ceil(in_dim[2] / (in_sphereDiameter * 0.5)) + 1;
	for (var zIndex = 0; zIndex <= zCount; ++zIndex){
		const localZ = calculateZ(in_min, zIndex, in_sphereDiameter);
		in_spaceInvestigator.filterZ(localZ);

		console.log(".");
		for (var yIndex = 0; yIndex <= yCount; ++yIndex){
			const localY = calculateY(in_min, yIndex, zIndex, in_sphereDiameter);
			in_spaceInvestigator.filterY(localY);
			const dataOfInterestOnRayX = in_spaceInvestigator.calculateDataOfInterestOnRayX(localY, localZ);

			for (var xIndex = 0; xIndex <= xCount; ++xIndex){
				const localX = calculateX(in_min, xIndex, yIndex, zIndex, in_sphereDiameter);
				if (true === in_spaceInvestigator.isPointInsideOnRayX([localX, localY, localZ], dataOfInterestOnRayX)){
					floatArray.push(localX);
					floatArray.push(localY);
					floatArray.push(localZ);
					floatArray.push(in_sphereDiameter);

					in_debugIndexArray.push(xIndex);
					in_debugIndexArray.push(yIndex);
					in_debugIndexArray.push(zIndex);
				}
			}
		}
	}
	return floatArray;
}

module.exports = {
	"visit" : visit,
}
