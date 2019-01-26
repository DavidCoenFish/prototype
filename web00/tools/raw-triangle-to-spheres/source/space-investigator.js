const Geometry = require("./geometry.js");

const factory = function(in_barycentricTriangleArray){
	const m_xRayNormal = [1.0, 0.0, 0.0];
	var m_zFilterTriangleArray = in_barycentricTriangleArray;
	const result = Object.create({
		"filterZ" : function(in_z){
			m_zFilterTriangleArray = [];
			for (var index = 0; index < in_barycentricTriangleArray.length; ++index){
				var triangle = in_barycentricTriangleArray[index];
				if (true === triangle.boundsTestZ(in_z)){
					m_zFilterTriangleArray.push(triangle);
				}
			}
			// changed over to cache intersection on ray
			return false;
		},
		"calculateDataOfInterestOnRayX" : function(in_y, in_z){
			//console.log("calculateDataOfInterestOnRayX");
			var result = [];
			const rayOrigin = [0.0, in_y, in_z];
			for (var index = 0; index < m_zFilterTriangleArray.length; ++index){
				var triangle = m_zFilterTriangleArray[index];
				if (false === triangle.boundsTestYZ(in_y, in_z)){
					continue;
				}
				var projectedPointOnPlane = triangle.projectRayOntoTrianglePlane(rayOrigin, m_xRayNormal);
				if (true === triangle.testPointInTriangle(projectedPointOnPlane)){
					result.push({ "triangle" : triangle, "point" : [projectedPointOnPlane[0], projectedPointOnPlane[1], projectedPointOnPlane[2]] });
				}
			}
			return result;
		},

		"isPointInsideOnRayX" : function(in_pos3, in_dataOfInterestOnRayX){
			var arrayFacesInfront = [];
			var arrayFacesBehind = [];
			for (var index = 0; index < in_dataOfInterestOnRayX.length; ++index){
				var triangle = in_dataOfInterestOnRayX[index].triangle;
				var point = in_dataOfInterestOnRayX[index].point;
				var t = Geometry.rayDistance(point, in_pos3, m_xRayNormal);
				if (t < 0.0){
					continue;
				}
				var rayDistanceRelativeToTriangle = triangle.getDistanceToTrianglePlane(in_pos3);
				if (0.0 < rayDistanceRelativeToTriangle){
					triangle.addIfNotTouching(arrayFacesInfront);
				} else if (rayDistanceRelativeToTriangle < 0.0){
					triangle.addIfNotTouching(arrayFacesBehind);
				}
			}
			const inside = (arrayFacesInfront.length !== arrayFacesBehind.length);
			return inside;
		}

	});
	return result;
}

module.exports = {
	"factory" : factory
};
