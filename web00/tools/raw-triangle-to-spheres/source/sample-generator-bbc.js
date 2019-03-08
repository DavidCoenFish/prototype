const FsExtra = require("fs-extra");
const Geometry = require("./geometry.js");

const gSqrt0_75 = 0.86602540378443864676372317075294;
const gSqrt0_66666 = 0.81649658092772603273242802490196;
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
		return in_min[1] + (gSqrt0_08333 + (in_yIndex * gSqrt0_75)) * in_sphereDiameter;
	}
}

const calculateZ = function(in_min, in_zIndex, in_sphereDiameter){
	return in_min[2] + (in_zIndex * in_sphereDiameter * gSqrt0_66666);
}

const visit = function(in_spaceInvestigator, in_sphereDiameter, in_min, in_dim, in_debugIndexArray){
	const floatArray = [];
	const xCount = Math.ceil(in_dim[0] / in_sphereDiameter) + 1;
	const yCount = Math.ceil(in_dim[1] / (in_sphereDiameter * gSqrt0_75)) + 1;
	const zCount = 10; //Math.ceil(in_dim[2] / (in_sphereDiameter * gSqrt0_66666)) + 1;
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
					floatArray.push(in_sphereDiameter / 2.0);

					in_debugIndexArray.push(xIndex);
					in_debugIndexArray.push(yIndex);
					in_debugIndexArray.push(zIndex);
				}
			}
		}
	}
	return floatArray;
}

const visitDebug = function(in_sphereDiameter, in_dimCount, in_debugIndexArray){
	const floatArray = [];
	const min = [0.0, 0.0, 0.0];
	for (var zIndex = 0; zIndex < in_dimCount; ++zIndex){
		const localZ = calculateZ(min, zIndex, in_sphereDiameter);
		for (var yIndex = 0; yIndex < in_dimCount; ++yIndex){
			const localY = calculateY(min, yIndex, zIndex, in_sphereDiameter);
			for (var xIndex = 0; xIndex < in_dimCount; ++xIndex){
				const localX = calculateX(min, xIndex, yIndex, zIndex, in_sphereDiameter);
				floatArray.push(localX);
				floatArray.push(localY);
				floatArray.push(localZ);
				floatArray.push(in_sphereDiameter / 2.0);

				in_debugIndexArray.push(xIndex);
				in_debugIndexArray.push(yIndex);
				in_debugIndexArray.push(zIndex);
			}
		}
	}
	return floatArray;
}

const debugSimpleGetPass = function(in_needle, in_origin, in_offsetArray){
	for( var index = 0; index < in_offsetArray.length; ++index){
		var offset = in_offsetArray[index];
		if ((in_needle[0] === (in_origin[0] + offset[0])) &&
			(in_needle[1] === (in_origin[1] + offset[1])) &&
			(in_needle[2] === (in_origin[2] + offset[2]))){
				return true;
		}
	}
	return false;
}

const visitDebugSimple = function(in_sphereDiameter, in_dimCount, in_debugIndexArray){
	const floatArray = [];
	const radius = in_dimCount * in_sphereDiameter * 0.5;
	const min = [-radius, -radius, -radius];

	for (var zIndex = 0; zIndex < in_dimCount; ++zIndex){
		const localZ = calculateZ(min, zIndex, in_sphereDiameter);
		for (var yIndex = 0; yIndex < in_dimCount; ++yIndex){
			const localY = calculateY(min, yIndex, zIndex, in_sphereDiameter);
			for (var xIndex = 0; xIndex < in_dimCount; ++xIndex){
				const localX = calculateX(min, xIndex, yIndex, zIndex, in_sphereDiameter);
				var pass = debugSimpleGetPass([xIndex, yIndex, zIndex], [1,1,1],
					[[0,0,0],
					[0,1,1],
					[-1,0,1],
					[0,0,1],
					[-1,1,0],
					[0,1,0],
					[-1,0,0],
					[1,0,0],
					[-1,-1,0],
					[0,-1,0],
					[0,1,-1],
					[-1,0,-1],
					[0,0,-1]]);

				if (true === pass){
					floatArray.push(localX);
					floatArray.push(localY);
					floatArray.push(localZ + radius);
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

const visitDebugSphere = function(in_sphereDiameter, in_dimCount, in_debugIndexArray){
	const floatArray = [];
	const radius = in_dimCount * in_sphereDiameter * 0.5;
	const min = [-radius, -radius, -radius];

	const xCount = in_dimCount + 1;
	const yCount = Math.ceil(in_dimCount / gSqrt0_75) + 1;
	const zCount = Math.ceil(in_dimCount / gSqrt0_66666) + 1;

	for (var zIndex = 0; zIndex < zCount; ++zIndex){
		const localZ = calculateZ(min, zIndex, in_sphereDiameter);
		for (var yIndex = 0; yIndex < yCount; ++yIndex){
			const localY = calculateY(min, yIndex, zIndex, in_sphereDiameter);
			for (var xIndex = 0; xIndex < xCount; ++xIndex){
				const localX = calculateX(min, xIndex, yIndex, zIndex, in_sphereDiameter);
				const length = Geometry.vec3Length([localX, localY, localZ]);
				if (length <= radius){
					floatArray.push(localX);
					floatArray.push(localY);
					floatArray.push(localZ + radius);
					floatArray.push(in_sphereDiameter / 2.0);

					in_debugIndexArray.push(xIndex);
					in_debugIndexArray.push(yIndex);
					in_debugIndexArray.push(zIndex);
				}
			}
		}
	}
	return floatArray;
}

const visitDebugCloth = function(in_sphereDiameter, in_xCount, in_yCount, in_zCount, in_debugIndexArray, in_origin){
	const floatArray = [];
	// const in_origin = [
	// 	-(in_xCount * in_sphereDiameter * 0.5), 
	// 	-(in_yCount * in_sphereDiameter * gSqrt0_75 * 0.5), 
	// 	-(in_zCount * in_sphereDiameter * gSqrt0_66666 * 0.5)
	// 	];

	for (var zIndex = 0; zIndex < in_zCount; ++zIndex){
		const localZ = calculateZ(in_origin, zIndex, in_sphereDiameter);
		for (var yIndex = 0; yIndex < in_yCount; ++yIndex){
			const localY = calculateY(in_origin, yIndex, zIndex, in_sphereDiameter);
			for (var xIndex = 0; xIndex < in_xCount; ++xIndex){
				const localX = calculateX(in_origin, xIndex, yIndex, zIndex, in_sphereDiameter);
				floatArray.push(localX);
				floatArray.push(localY);
				floatArray.push(localZ);
				floatArray.push(in_sphereDiameter / 2.0);

				in_debugIndexArray.push(xIndex);
				in_debugIndexArray.push(yIndex);
				in_debugIndexArray.push(zIndex);
			}
		}
	}
	return floatArray;
}

module.exports = {
	"visit" : visit,
	"visitDebug" : visitDebug,
	"visitDebugSimple" : visitDebugSimple,
	"visitDebugSphere" : visitDebugSphere, 
	"visitDebugCloth" : visitDebugCloth, 
}
