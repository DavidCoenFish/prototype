const FsExtra = require("fs-extra");

const gSqrt0_75 = 0.86602540378443864676372317075294;
const gSqrt0_5 = 0.70710678118654752440084436210485;
const gSqrt0_33333 = 0.57735026918962576450914878050196;
const gSqrt0_08333 = 0.28867513459481288225457439025098;


const debugPointPair = function(in_pointA, in_pointB){
	var message = "";
	message += `	${in_pointA[0]}, ${in_pointA[1]}, ${in_pointA[2]},\n`;
	message += `	${in_pointB[0]}, ${in_pointB[1]}, ${in_pointB[2]},\n`;
	return message;
}

//dataOfInterestOnRayX
//result.push({ "triangle" : triangle, "point" : [projectedPointOnPlane[0], projectedPointOnPlane[1], projectedPointOnPlane[2]] });
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


	// float x = a_position.x + (mod(a_position.y, 2.0) * 0.5) - (mod(a_position.z, 2.0) * 0.5);
	// float y = (a_position.y * 0.86602540378443864676372317075294) + (mod(a_position.z, 2.0) * 0.28867513459481288225457439025098);
	// float z = 	a_position.z * 0.81649658092772603273242802490196;
const calculateX = function(in_min, in_xIndex, in_yIndex, in_zIndex, in_sphereDiameter){
	const yEven = (0 === (in_yIndex & 1));
	const zEven = (0 === (in_zIndex & 1));
	if (zEven){
		if (yEven){
			return in_min[0] + (in_xIndex * in_sphereDiameter);
		} else {
			return in_min[0] + ((in_xIndex + 0.5) * in_sphereDiameter);
		}
	} else {
		if (yEven){
			return in_min[0] + ((in_xIndex + 0.5) * in_sphereDiameter);
		} else {
			return in_min[0] + (in_xIndex * in_sphereDiameter);
		}
	}
	return;
}

const calculateY = function(in_min, in_yIndex, in_zIndex, in_sphereDiameter){
	const zEven = (0 === (in_zIndex & 1));
	if (zEven){
		return in_min[1] + (in_yIndex * in_sphereDiameter * gSqrt0_75);
	} else {
		return in_min[1] + ((gSqrt0_08333) + in_yIndex * in_sphereDiameter * gSqrt0_75);
	}
}

const calculateZ = function(in_min, in_zIndex, in_sphereDiameter){
	return in_min[2] + (in_zIndex * in_sphereDiameter * gSqrt0_5);
}

const visit = function(in_spaceInvestigator, in_sphereDiameter, in_min, in_dim){
	const floatArray = [];
	const xCount = Math.ceil(in_dim[0] / in_sphereDiameter) + 1;
	const yCount = Math.ceil(in_dim[1] / (in_sphereDiameter * gSqrt0_75)) + 1;
	const zCount = Math.ceil(in_dim[2] / (in_sphereDiameter * gSqrt0_5)) + 1;
	for (var zIndex = 0; zIndex <= zCount; ++zIndex){
		const localZ = calculateZ(in_min, zIndex, in_sphereDiameter);

		console.log(".");
		for (var yIndex = 0; yIndex <= yCount; ++yIndex){
			const localY = calculateY(in_min, yIndex, zIndex, in_sphereDiameter);
			const dataOfInterestOnRayX = in_spaceInvestigator.calculateDataOfInterestOnRayX(localY, localZ);

			for (var xIndex = 0; xIndex <= xCount; ++xIndex){
				const localX = calculateX(in_min, xIndex, yIndex, zIndex, in_sphereDiameter);
				if (true === in_spaceInvestigator.isPointInsideOnRayX([localX, localY, localZ], dataOfInterestOnRayX)){
					floatArray.push(localX);
					floatArray.push(localY);
					floatArray.push(localZ);
				}
			}
		}
	}
	return floatArray;
}


module.exports = {
	"visit" : visit
}
