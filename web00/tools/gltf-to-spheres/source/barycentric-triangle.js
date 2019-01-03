/*
https://en.wikipedia.org/wiki/Barycentric_coordinate_system
\lambda_0=(y_1-y_2)(x-x_2)+(x_2-x_1)(y-y_2) / (y_1-y_2)(x_0-x_2)+(x_2-x_1)(y_0-y_2)
\lambda_1=(y_2-y_0)(x-x_2)+(x_0-x_2)(y-y_2) / (y_1-y_2)(x_0-x_2)+(x_2-x_1)(y_0-y_2)

\lambda_3=1 - lambda_0 - lambda_1

 */

//if the intersection is this close to a edge by threshold, treat it as touching
const gDistanceToEdgeThreshold = 0.0001;

const factory = function(in_pos3PointA, in_pos3PointB, in_pos3PointC){
	const dotProduct = function(in_vec3A, in_vec3B){
		return ((in_vec3A[0] * in_vec3B[0]) + (in_vec3A[1] * in_vec3B[1]) + (in_vec3A[2] * in_vec3B[2]));
	}

	const crossProduct = function(in_vec3A, in_vec3B){
		return [
			(in_vec3A[1] * in_vec3B[2]) - (in_vec3A[2] * in_vec3B[1]),
			(in_vec3A[2] * in_vec3B[0]) - (in_vec3A[0] * in_vec3B[2]),
			(in_vec3A[0] * in_vec3B[1]) - (in_vec3A[1] * in_vec3B[0])
		];
	}

	const mulScalar = function(in_vec3, in_scalar){
		return [in_vec3[0] * in_scalar, in_vec3[1] * in_scalar, in_vec3[2] * in_scalar];
	}

	const add = function(in_vec3Lhs, in_vecRhs){
		return [in_vec3Lhs[0] + in_vecRhs[0], in_vec3Lhs[1] + in_vecRhs[1], in_vec3Lhs[2] + in_vecRhs[2]];
	}

	const subtract = function(in_vec3Lhs, in_vecRhs){
		return [in_vec3Lhs[0] - in_vecRhs[0], in_vec3Lhs[1] - in_vecRhs[1], in_vec3Lhs[2] - in_vecRhs[2]];
	}

	//return [n0, n1, n2, length]
	const returnNormalAndLength = function(in_vec3){
		const length = Math.sqrt(dotProduct(in_vec3, in_vec3));
		const mul = (0.0 !== length) ? 1.0 / length : 0.0;
		return mulScalar(in_vec3, mul).concat(length);
	}

	const point3Equal = function(in_pos3PointA, in_pos3PointB){
		return ((in_pos3PointA[0] === in_pos3PointB[0]) && 
			(in_pos3PointA[1] === in_pos3PointB[1]) && 
			(in_pos3PointA[2] === in_pos3PointB[2]));
	}

	const sharedEdgeTest = function(in_pos3PointA, in_pos3PointB){
		return (((point3Equal(in_pos3PointA, m_point3[0]) && (point3Equal(in_pos3PointB, m_point3[2])))) ||
			((point3Equal(in_pos3PointA, m_point3[1]) && (point3Equal(in_pos3PointB, m_point3[0])))) ||
			((point3Equal(in_pos3PointA, m_point3[2]) && (point3Equal(in_pos3PointB, m_point3[1])))));
	}

	const projectOntoPlane = function(in_planeNormal, in_rayNormal, in_rayOrigin){
		var denom = dotProduct(in_planeNormal, in_rayNormal);
		if (Math.abs(denom) < Number.EPSILON){
			return undefined;
		}
		var rayDist = dotProduct(in_planeNormal, in_rayOrigin) / denom;
		var projected = add(in_rayOrigin, mulScalar(in_rayNormal, rayDist));
		return projected.concat(rayDist);
	}

	const addSelfIfNotTouching = function(inout_array, in_result){
		for (var index = 0; index < inout_array.length; ++index){
			if (true === inout_array[index].touchingTest(m_point3)){
				return;
			}
		}
		inout_array.push(in_result);
	}

	var m_point3 = [in_pos3PointA, in_pos3PointB, in_pos3PointC];
	var m_normAtoB = returnNormalAndLength(subtract(in_pos3PointB, in_pos3PointA));
	var m_normAtoC = returnNormalAndLength(subtract(in_pos3PointC, in_pos3PointA));
	//var m_normBtoC = returnNormalAndLength(subtract(in_pos3PointC, in_pos3PointB)); // for close to edge check
	var m_trianglePlaneNorm = returnNormalAndLength(crossProduct(m_normAtoB, m_normAtoC));
	//var m_trianglePlaneDistance = dotProduct(m_trianglePlaneNorm, in_pos3PointA);

	const result = Object.create({
		"dealIntersection" : function(inout_arrayPositive, inout_arrayNegative, in_rayNormal, in_rayOrigin){
			const onPlane = projectOntoPlane(m_trianglePlaneNorm, in_rayNormal, in_rayOrigin);
			if (undefined === onPlane){
				return;
			}
			if (onPlane[3] + Number.EPSILON < 0.0){
				return; //behind ray
			}

			const dotAB = dotProduct(m_normAtoB, onPlane) / m_normAtoB[3];
			if ((dotAB - Number.EPSILON < 0.0) || (1.0 < dotAB + Number.EPSILON)){
				return;
			}
			const dotAC = dotProduct(m_normAtoC, onPlane) / m_normAtoC[3];
			if ((dotAC - Number.EPSILON < 0.0) || (1.0 < dotAC + Number.EPSILON)){
				return;
			}
			var c = 1 - dotAB - dotAC;
			if ((c - Number.EPSILON < 0.0) || (1.0 < c + Number.EPSILON)){
				return;
			}

			const isPositive = (0.0 < dotProduct(m_trianglePlaneNorm, in_rayNormal));
			if (true === isPositive){
				addSelfIfNotTouching(inout_arrayPositive, result);
			} else {
				addSelfIfNotTouching(inout_arrayNegative, result);
			}


		},
		"touchingTest" : function(in_point3){
			return ((true === sharedEdgeTest(in_point3[0], in_point3[1])) ||
				(true === sharedEdgeTest(in_point3[1], in_point3[2])) ||
				(true === sharedEdgeTest(in_point3[2], in_point3[0])));
		}
	});
	return result;
}

module.exports = {
	"factory" : factory
}