const Geometry = require("./geometry.js");

/*
https://en.wikipedia.org/wiki/Barycentric_coordinate_system
\lambda_0=(y_1-y_2)(x-x_2)+(x_2-x_1)(y-y_2) / (y_1-y_2)(x_0-x_2)+(x_2-x_1)(y_0-y_2)
\lambda_1=(y_2-y_0)(x-x_2)+(x_0-x_2)(y-y_2) / (y_1-y_2)(x_0-x_2)+(x_2-x_1)(y_0-y_2)

\lambda_3=1 - lambda_0 - lambda_1

https://gamedev.stackexchange.com/questions/23743/whats-the-most-efficient-way-to-find-barycentric-coordinates
void Barycentric(Point p, Point a, Point b, Point c, float &u, float &v, float &w)
{
    Vector v0 = b - a, v1 = c - a, v2 = p - a;
    float d00 = Dot(v0, v0);
    float d01 = Dot(v0, v1);
    float d11 = Dot(v1, v1);
    float d20 = Dot(v2, v0);
    float d21 = Dot(v2, v1);
    float denom = d00 * d11 - d01 * d01;
    v = (d11 * d20 - d01 * d21) / denom;
    w = (d00 * d21 - d01 * d20) / denom;
    u = 1.0f - v - w;
}

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
	var m_v0 = Geometry.vec3Minus(in_pos3PointB, in_pos3PointA);
	var m_v1 = Geometry.vec3Minus(in_pos3PointC, in_pos3PointA);
	var m_d00 = Geometry.vec3DotProduct(m_v0, m_v0);
	var m_d01 = Geometry.vec3DotProduct(m_v0, m_v1);
	var m_d11 = Geometry.vec3DotProduct(m_v1, m_v1);
	var m_denom = m_d00 * m_d11 - m_d01 * m_d01;

	var m_min = Geometry.vec3Min(in_pos3PointA, in_pos3PointB, in_pos3PointC);
	var m_max = Geometry.vec3Max(in_pos3PointA, in_pos3PointB, in_pos3PointC);

	var m_trianglePlaneNorm = Geometry.vec3LengthReturnNormal(Geometry.vec3CrossProduct(m_v0, m_v1));

	const result = Object.create({
		"getPointArray" : function(){
			return m_point3;
		},
		"getTrianglePlaneNorm" : function(){
			return m_trianglePlaneNorm;
		},

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

			const v2 = Geometry.vec3Minus(in_pointOrUndefined, m_point3[0]);
			const d20 = Geometry.vec3DotProduct(v2, m_v0);
			const d21 = Geometry.vec3DotProduct(v2, m_v1);

			const v = (m_d11 * d20 - m_d01 * d21) / m_denom;
			const w = (m_d00 * d21 - m_d01 * d20) / m_denom;
			const u = 1.0 - v - w;

			if ((v + Number.EPSILON < 0.0) || (1.0 < v - Number.EPSILON)){
				return false;
			}

			if ((w + Number.EPSILON < 0.0) || (1.0 < w - Number.EPSILON)){
				return false;
			}

			if ((u + Number.EPSILON < 0.0) || (1.0 < u - Number.EPSILON)){
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
		"boundsTestYZ" : function(in_y, in_z){
			return ((m_min[1] <= in_y) && 
				(in_y <= m_max[1]) &&
				(m_min[2] <= in_z) &&
				(in_z <= m_max[2]));
		}
	});
	return result;
}

module.exports = {
	"factory" : factory
}