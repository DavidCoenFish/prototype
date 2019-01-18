const Geometry = require("./geometry.js");

/*
https://en.wikipedia.org/wiki/Barycentric_coordinate_system
\lambda_0=(y_1-y_2)(x-x_2)+(x_2-x_1)(y-y_2) / (y_1-y_2)(x_0-x_2)+(x_2-x_1)(y_0-y_2)
\lambda_1=(y_2-y_0)(x-x_2)+(x_0-x_2)(y-y_2) / (y_1-y_2)(x_0-x_2)+(x_2-x_1)(y_0-y_2)

\lambda_3=1 - lambda_0 - lambda_1

 */

//if the intersection is this close to a edge by threshold, treat it as touching
const gDistanceToEdgeThreshold = 0.0001;

const factory = function(in_pos3PointA, in_pos3PointB, in_pos3PointC){

	const sharedEdgeTest = function(in_pos3PointA, in_pos3PointB){
		return (((Geometry.vec3Equal(in_pos3PointA, m_point3[0]) && (Geometry.vec3Equal(in_pos3PointB, m_point3[2])))) ||
			((Geometry.vec3Equal(in_pos3PointA, m_point3[1]) && (Geometry.vec3Equal(in_pos3PointB, m_point3[0])))) ||
			((Geometry.vec3Equal(in_pos3PointA, m_point3[2]) && (Geometry.vec3Equal(in_pos3PointB, m_point3[1])))));
	}

	var m_point3 = [in_pos3PointA, in_pos3PointB, in_pos3PointC];
	var m_normAtoB = Geometry.vec3LengthReturnNormal(Geometry.vec3Minus(in_pos3PointB, in_pos3PointA));
	var m_normAtoC = Geometry.vec3LengthReturnNormal(Geometry.vec3Minus(in_pos3PointC, in_pos3PointA));
	var m_trianglePlaneNorm = Geometry.vec3LengthReturnNormal(Geometry.vec3CrossProduct(m_normAtoB, m_normAtoC));

	const result = Object.create({
		"getDistanceToTrianglePlane" : function(in_point){
			const offset = Geometry.vec3Minus(in_point, m_point3[0]);
			const dotOffset = Geometry.vec3DotProduct(offset, m_trianglePlaneNorm);
			return dotOffset;
		},
		//can return undefined
		"projectRayOntoTrianglePlane" : function(in_rayOrigin, in_rayNormal){
			return Geometry.rayPlaneIntersection(in_rayOrigin, in_rayNormal, m_point3[0], m_trianglePlaneNorm);
		},
		"testPointInTriangle" : function(in_pointOrUndefined){
			if (undefined === in_pointOrUndefined){
				return false;
			}

			const pointReleativeToA = Geometry.vec3Minus(in_pointOrUndefined, m_point3[0]);

			const dotAB = Geometry.vec3DotProduct(m_normAtoB, pointReleativeToA) / m_normAtoB[3];
			if ((dotAB + Number.EPSILON < 0.0) || (1.0 < dotAB - Number.EPSILON)){
				return false;
			}
			const dotAC = Geometry.vec3DotProduct(m_normAtoC, pointReleativeToA) / m_normAtoC[3];
			if ((dotAC + Number.EPSILON < 0.0) || (1.0 < dotAC - Number.EPSILON)){
				return false;
			}
			var c = 1 - dotAB - dotAC;
			if ((c + Number.EPSILON < 0.0) || (1.0 < c - Number.EPSILON)){
				return false;
			}

			return true;
		},
		"addIfNotTouching" : function(in_arrayTriangles){
			for (var index = 0; index < in_arrayTriangles.length; index++) { 
				if (true === in_arrayTriangles[index].touchingTest(m_point3)){
					return;
				}
			}
			in_arrayTriangles.push(result);
		},
		"touchingTest" : function(in_point3){
			return ((true === sharedEdgeTest(in_point3[0], in_point3[1])) ||
				(true === sharedEdgeTest(in_point3[1], in_point3[2])) ||
				(true === sharedEdgeTest(in_point3[2], in_point3[0])));
		},
	});
	return result;
}

module.exports = {
	"factory" : factory
}