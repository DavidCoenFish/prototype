//https://www.mathwarehouse.com/geometry/triangles/area/herons-formula-triangle-area.php
const vec3AreaTriangle = function(in_vecA, in_vec3B, in_vec3C){
	const A = vec3Distance(in_vecA, in_vec3B);
	const B = vec3Distance(in_vecB, in_vec3C);
	const C = vec3Distance(in_vecC, in_vec3A);
	const S = (A + B + C) / 2;
	const area = Math.sqrt(S * (S - A) * (S - B) * (S - C));
	return area;
}

const vec3Cross = function(in_vecA, in_vecB){
	return [
		(in_vecA[1] * in_vecB[2]) - (in_vecA[2] * in_vecB[1]),
		(in_vecA[2] * in_vecB[0]) - (in_vecA[0] * in_vecB[2]),
		(in_vecA[0] * in_vecB[1]) - (in_vecA[1] * in_vecB[0])
	];
}

const vec3Dot = function(in_vecA, in_vecB){
	return (in_vecA[0] * in_vecB[0]) + (in_vecA[1] * in_vecB[1]) + (in_vecA[2] * in_vecB[2]);
}

const vec3Distance = function(in_vec3A, in_vec3B){
	var a = in_vec3A[0] - in_vec3B[0];
	var b = in_vec3A[1] - in_vec3B[1];
	var c = in_vec3A[2] - in_vec3B[2];
	var result = Math.sqrt((a * a) + (b * b) + (c * c));
	return result;
}

const vec3Normalise = function(in_vec3){
	const a = in_vec3[0];
	const b = in_vec3[1];
	const c = in_vec3[2];
	var length = Math.sqrt((a * a) + (b * b) + (c * c));
	if (0.0 === length){
		return [0.0, 0.0, 0.0];
	}
	return [a/length, b/length, c/length];
}

const vec3Subtract = function(in_vec3A, in_vec3B){
	return [ in_vec3A[0] - in_vec3B[0],
		in_vec3A[1] - in_vec3B[1],
		in_vec3A[2] - in_vec3B[2]];
}

const vec3Volume = function(in_offsetA, in_offsetB, in_offsetC){
	const volume = vec3Dot(in_offsetA, vec3Cross(in_offsetB, in_offsetC)) / 6.0;
	return volume;
}

module.exports = {
	"vec3AreaTriangle" : vec3AreaTriangle,
	"vec3Cross" : vec3Cross,
	"vec3Dot" : vec3Dot,
	"vec3Distance" : vec3Distance,
	"vec3Normalise" : vec3Normalise,
	"vec3Subtract" : vec3Subtract,
	"vec3Volume" : vec3Volume
}