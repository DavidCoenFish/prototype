const vec3Equal = function(in_pos3PointA, in_pos3PointB){
	return ((in_pos3PointA[0] === in_pos3PointB[0]) && 
		(in_pos3PointA[1] === in_pos3PointB[1]) && 
		(in_pos3PointA[2] === in_pos3PointB[2]));
}


	//return [n0, n1, n2, length]
const vec3LengthReturnNormal = function(in_vec3){
	const length = Math.sqrt(vec3DotProduct(in_vec3, in_vec3));
	const mul = (0.0 !== length) ? 1.0 / length : 0.0;
	return vec3MultiplyScalar(in_vec3, mul).concat(length);
}


const vec3CrossProduct = function(in_vec3A, in_vec3B){
	return [
		(in_vec3A[1] * in_vec3B[2]) - (in_vec3A[2] * in_vec3B[1]),
		(in_vec3A[2] * in_vec3B[0]) - (in_vec3A[0] * in_vec3B[2]),
		(in_vec3A[0] * in_vec3B[1]) - (in_vec3A[1] * in_vec3B[0])
	];
}

const vec3Minus = function(in_lhs, in_rhs){
	return [
		in_lhs[0] - in_rhs[0], 
		in_lhs[1] - in_rhs[1], 
		in_lhs[2] - in_rhs[2]
	];
}

const vec3DotProduct = function(in_lhs, in_rhs){
	return (
		(in_lhs[0] * in_rhs[0]) +
		(in_lhs[1] * in_rhs[1]) +  
		(in_lhs[2] * in_rhs[2])
	);
}
const vec3Plus = function(in_lhs, in_rhs){
	return [
		in_lhs[0] + in_rhs[0], 
		in_lhs[1] + in_rhs[1], 
		in_lhs[2] + in_rhs[2]
	];
}

const vec3MultiplyScalar = function(in_lhs, in_rhs){
	return [
		in_lhs[0] * in_rhs, 
		in_lhs[1] * in_rhs, 
		in_lhs[2] * in_rhs
	];
}

const rayPlaneIntersection = function(in_rayOrigin, in_rayNormal, in_planeOrigin, in_planeNormal){
	const denom = vec3DotProduct(in_rayNormal, in_planeNormal);
	if (Math.abs(denom) <= Number.EPSILON){
		return undefined;
	}
	const offset = vec3Minus(in_planeOrigin, in_rayOrigin);
	const t = vec3DotProduct(offset, in_planeNormal) / denom;
	const intersection = vec3Plus(in_rayOrigin, vec3MultiplyScalar(in_rayNormal, t));
	return intersection;
}

const rayDistance = function(in_testPoint, in_rayOrigin, in_rayNormal){
	const offset = vec3Minus(in_testPoint, in_rayOrigin);
	const t = vec3DotProduct(offset, in_rayNormal);
	return t;
}

const vec3Min = function(in_pos3PointA, in_pos3PointB, in_pos3PointC){
	return [
		Math.min(in_pos3PointA[0], in_pos3PointB[0], in_pos3PointC[0]),
		Math.min(in_pos3PointA[1], in_pos3PointB[1], in_pos3PointC[1]),
		Math.min(in_pos3PointA[2], in_pos3PointB[2], in_pos3PointC[2])
	];
}

const vec3Max = function(in_pos3PointA, in_pos3PointB, in_pos3PointC){
	return [
		Math.max(in_pos3PointA[0], in_pos3PointB[0], in_pos3PointC[0]),
		Math.max(in_pos3PointA[1], in_pos3PointB[1], in_pos3PointC[1]),
		Math.max(in_pos3PointA[2], in_pos3PointB[2], in_pos3PointC[2])
	];
}

/*
float denom = normal.dot(ray.direction);
if (abs(denom) > 0.0001f) // your favorite epsilon
{
    float t = (center - ray.origin).dot(normal) / denom;
    if (t >= 0) return true; // you might want to allow an epsilon here too
}
return false;
 */

module.exports = {
	"rayPlaneIntersection" : rayPlaneIntersection,
	"rayDistance" : rayDistance,
	"vec3Equal" : vec3Equal,
	"vec3LengthReturnNormal" : vec3LengthReturnNormal,
	"vec3CrossProduct" : vec3CrossProduct,
	"vec3Minus" : vec3Minus,
	"vec3DotProduct" : vec3DotProduct,
	"vec3Plus" : vec3Plus,
	"vec3MultiplyScalar" : vec3MultiplyScalar,
	"vec3Min" : vec3Min,
	"vec3Max" : vec3Max
}
