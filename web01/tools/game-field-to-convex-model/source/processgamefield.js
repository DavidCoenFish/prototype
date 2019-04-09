const determinant2x2 = function(in_matrix2x2){
	return (in_matrix2x2[0] * in_matrix2x2[3]) - (in_matrix2x2[1] * in_matrix2x2[2]);
}
/*
0 1 2
3 4 5
6 7 8
*/
const determinant3x3 = function(in_matrix3x3){
	return (in_matrix3x3[0] * determinant2x2([in_matrix3x3[4], in_matrix3x3[5], in_matrix3x3[7], in_matrix3x3[8]])) 
		- (in_matrix3x3[1] * determinant2x2([in_matrix3x3[3], in_matrix3x3[5], in_matrix3x3[6], in_matrix3x3[8]]))
		+ (in_matrix3x3[2] * determinant2x2([in_matrix3x3[3], in_matrix3x3[4], in_matrix3x3[6], in_matrix3x3[7]]));
}

/*
 0  1  2  3
 4  5  6  7
 8  9 10 11
12 13 14 15
*/
const determinant4x4 = function(m){
	return m[12] * m[9]  * m[6]  * m[3]   -  m[8] * m[13] * m[6]  * m[3]   -
         m[12] * m[5]  * m[10] * m[3]   +  m[4] * m[13] * m[10] * m[3]   +
         m[8]  * m[5]  * m[14] * m[3]   -  m[4] * m[9]  * m[14] * m[3]   -
         m[12] * m[9]  * m[2]  * m[7]   +  m[8] * m[13] * m[2]  * m[7]   +
         m[12] * m[1]  * m[10] * m[7]   -  m[0] * m[13] * m[10] * m[7]   -
         m[8]  * m[1]  * m[14] * m[7]   +  m[0] * m[9]  * m[14] * m[7]   +
         m[12] * m[5]  * m[2]  * m[11]  -  m[4] * m[13] * m[2]  * m[11]  -
         m[12] * m[1]  * m[6]  * m[11]  +  m[0] * m[13] * m[6]  * m[11]  +
         m[4]  * m[1]  * m[14] * m[11]  -  m[0] * m[5]  * m[14] * m[11]  -
         m[8]  * m[5]  * m[2]  * m[15]  +  m[4] * m[9]  * m[2]  * m[15]  +
         m[8]  * m[1]  * m[6]  * m[15]  -  m[0] * m[9]  * m[6]  * m[15]  -
         m[4]  * m[1]  * m[10] * m[15]  +  m[0] * m[5]  * m[10] * m[15];
}

const makeSphere = function(in_vecA, in_vecB, in_vecC, in_vecD){
	const tA = -(in_vecA[0] * in_vecA[0] + in_vecA[1] * in_vecA[1] + in_vecA[2] * in_vecA[2]);
	const tB = -(in_vecB[0] * in_vecB[0] + in_vecB[1] * in_vecB[1] + in_vecB[2] * in_vecB[2]);
	const tC = -(in_vecC[0] * in_vecC[0] + in_vecC[1] * in_vecC[1] + in_vecC[2] * in_vecC[2]);
	const tD = -(in_vecD[0] * in_vecD[0] + in_vecD[1] * in_vecD[1] + in_vecD[2] * in_vecD[2]);
	const determinant = determinant4x4([
		in_vecA[0], in_vecA[1], in_vecA[2], 1,
		in_vecB[0], in_vecB[1], in_vecB[2], 1,
		in_vecC[0], in_vecC[1], in_vecC[2], 1,
		in_vecD[0], in_vecD[1], in_vecD[2], 1
		]);
	if (Math.abs(determinant) <= Number.EPSILON){
		return undefined;
	}

	const D = determinant4x4([
		tA, in_vecA[1], in_vecA[2], 1,
		tB, in_vecB[1], in_vecB[2], 1,
		tC, in_vecC[1], in_vecC[2], 1,
		tD, in_vecD[1], in_vecD[2], 1
		]);
	const E = determinant4x4([
		in_vecA[0], tA, in_vecA[2], 1,
		in_vecB[0], tB, in_vecB[2], 1,
		in_vecC[0], tC, in_vecC[2], 1,
		in_vecD[0], tD, in_vecD[2], 1
		]);
	const F = determinant4x4([
		in_vecA[0], in_vecA[1], tA, 1,
		in_vecB[0], in_vecB[1], tB, 1,
		in_vecC[0], in_vecC[1], tC, 1,
		in_vecD[0], in_vecD[1], tD, 1
		]);
	const G = determinant4x4([
		in_vecA[0], in_vecA[1], in_vecA[2], tA,
		in_vecB[0], in_vecB[1], in_vecB[2], tB,
		in_vecC[0], in_vecC[1], in_vecC[2], tC,
		in_vecD[0], in_vecD[1], in_vecD[2], tD
		]);

	const result = [
		D * (-0.5),
		E * (-0.5),
		F * (-0.5),
		0.5 * Math.sqrt((D * D) + (E * E) + (F * F) - (4 * G))
	];
	return result;
}

const dotProduct = function(in_vecA, in_vecB){
	return (in_vecA[0] * in_vecB[0]) + (in_vecA[1] * in_vecB[1]) + (in_vecA[2] * in_vecB[2]);
}

const crossProduct = function(in_vecA, in_vecB){
	return [
		(in_vecA[1] * in_vecB[2]) - (in_vecA[2] * in_vecB[1]),
		(in_vecA[2] * in_vecB[0]) - (in_vecA[0] * in_vecB[2]),
		(in_vecA[0] * in_vecB[1]) - (in_vecA[1] * in_vecB[0])
	];
}

const vecScalarMultiply = function(in_vec, in_scalar){
	return [
		in_vec[0] * in_scalar,
		in_vec[1] * in_scalar,
		in_vec[2] * in_scalar
	];
}

const intersectPlanePlanePlane = function(in_planeA, in_planeB, in_planeC){
	const crossA = crossProduct(in_planeB, in_planeC);
	const denom = dotProduct(in_planeA, crossA);
	if (Math.abs(denom) <= Number.EPSILON){
		return undefined;
	}
	const crossB = crossProduct(in_planeC, in_planeA);
	const crossC = crossProduct(in_planeA, in_planeB);

	const vecA = vecScalarMultiply(crossA, -in_planeA[3]);
	const vecB = vecScalarMultiply(crossB, -in_planeB[3]);
	const vecC = vecScalarMultiply(crossC, -in_planeC[3]);

	const result = [
		(vecA[0] + vecB[0] + vecC[0]) / denom,
		(vecA[1] + vecB[1] + vecC[1]) / denom,
		(vecA[2] + vecB[2] + vecC[2]) / denom
	];
	return result;
}

const appendNodeToModel = function(inout_model, in_node){
}

const printModel = function(in_model){
}

const runObjectIDModel = function(in_gameField){
	var tempModel = {
		"modelSphereData" : [],
		"objectID" : [],
		"colour" : [],
		"modelPlane0" : [],
		"modelPlane1" : [],
		"modelPlane2" : [],
		"modelPlane3" : [],
		"modelPlane4" : [],
		"modelPlane5" : [],
		"modelPlane6" : [],
		"modelPlane7" : []
	};

	// nodearray
	for (var index = 0; index < in_gameField.nodearray.length; ++index){
		//{"objectid":1,"convexhull":[[0,0,1,0.9122472186352573],[0,0,-1,1],[1,0,0,-7.25],[-1,0,0,8.25],[0.5,0.28867513459481287,0,-5.583333333333333],[0.5,-0.28867513459481287,0,-1.8333333333333337],[-0.5,0.28867513459481287,0,2.166666666666667],[-0.5,-0.28867513459481287,0,5.916666666666666]],"colour":[0.2,0.2,0.5]}
		var node = in_gameField.nodearray[index];
		if (!("convexhull" in node) || !("objectid" in node)){
			continue;
		}
		appendNodeToModel(tempModel, node);
	}

	var result = printModel(tempModel);

	return result;
}

module.exports = {
	"runObjectIDModel" : runObjectIDModel
}