const matrixFromQuaternion = function(in_quaternion){
	const X = in_quaternion[0]; //I
	const Y = in_quaternion[1]; //J
	const Z = in_quaternion[2]; //K
	const W = in_quaternion[3];

	const xx      = X * X;
	const xy      = X * Y;
	const xz      = X * Z;
	const xw      = X * W;
	const yy      = Y * Y;
	const yz      = Y * Z;
	const yw      = Y * W;
	const zz      = Z * Z;
	const zw      = Z * W;

	return [
		1 - 2 * ( yy + zz ),
		2 * ( xy - zw ),
		2 * ( xz + yw ),
		0.0,

		2 * ( xy + zw ),
		1 - 2 * ( xx + zz ),
		2 * ( yz - xw ),
		0.0,

		2 * ( xz - yw ),
		2 * ( yz + xw ),
		1 - 2 * ( xx + yy ),
		0.0,

		0.0,
		0.0,
		0.0,
		1.0
		];
}

const matrixFromScale = function(in_scale){
	return [
		in_scale[0],
		0.0,
		0.0,
		0.0,

		0.0,
		in_scale[1],
		0.0,
		0.0,

		0.0,
		0.0,
		in_scale[2],
		0.0,

		0.0,
		0.0,
		0.0,
		1.0
		];
}

const matrixFromTranslation = function(in_translate){
	return [
		1.0,
		0.0,
		0.0,
		0.0,

		0.0,
		1.0,
		0.0,
		0.0,

		0.0,
		0.0,
		1.0,
		0.0,

		in_translate[0],
		in_translate[1],
		in_translate[2],
		1.0
		];
}

const matrixIdentity = function(){
	return [
		1.0,
		0.0,
		0.0,
		0.0,

		0.0,
		1.0,
		0.0,
		0.0,

		0.0,
		0.0,
		1.0,
		0.0,

		0.0,
		0.0,
		0.0,
		1.0
		];
}

const matrixFromNode = function(in_node){
	if ("matrix" in in_node){
		return in_node.matrix;
	}

	var base = matrixIdentity();
	if ("translation" in in_node){
		transMat = matrixFromTranslation(in_node.translation);
		base = matrixConcat(base, transMat);
	}

	if ("rotation" in in_node){
		rotMat = matrixFromQuaternion(in_node.rotation);
		base = matrixConcat(base, rotMat);
	}
	if ("scale" in in_node){
		scaleMat = matrixFromScale(in_node.scale);
		base = matrixConcat(base, scaleMat);
	}

	return base;
}

const matrixConcat = function(in_lhs, in_rhs){
	return [
		(in_lhs[0] * in_rhs[0]) + (in_lhs[4] * in_rhs[1]) + (in_lhs[8] * in_rhs[2]) + (in_lhs[12] * in_rhs[3]),
		(in_lhs[1] * in_rhs[0]) + (in_lhs[5] * in_rhs[1]) + (in_lhs[9] * in_rhs[2]) + (in_lhs[13] * in_rhs[3]),
		(in_lhs[2] * in_rhs[0]) + (in_lhs[6] * in_rhs[1]) + (in_lhs[10] * in_rhs[2]) + (in_lhs[14] * in_rhs[3]),
		(in_lhs[3] * in_rhs[0]) + (in_lhs[7] * in_rhs[1]) + (in_lhs[11] * in_rhs[2]) + (in_lhs[15] * in_rhs[3]),

		(in_lhs[0] * in_rhs[4]) + (in_lhs[4] * in_rhs[5]) + (in_lhs[8] * in_rhs[6]) + (in_lhs[12] * in_rhs[7]),
		(in_lhs[1] * in_rhs[4]) + (in_lhs[5] * in_rhs[5]) + (in_lhs[9] * in_rhs[6]) + (in_lhs[13] * in_rhs[7]),
		(in_lhs[2] * in_rhs[4]) + (in_lhs[6] * in_rhs[5]) + (in_lhs[10] * in_rhs[6]) + (in_lhs[14] * in_rhs[7]),
		(in_lhs[3] * in_rhs[4]) + (in_lhs[7] * in_rhs[5]) + (in_lhs[11] * in_rhs[6]) + (in_lhs[15] * in_rhs[7]),

		(in_lhs[0] * in_rhs[8]) + (in_lhs[4] * in_rhs[9]) + (in_lhs[8] * in_rhs[10]) + (in_lhs[12] * in_rhs[11]),
		(in_lhs[1] * in_rhs[8]) + (in_lhs[5] * in_rhs[9]) + (in_lhs[9] * in_rhs[10]) + (in_lhs[13] * in_rhs[11]),
		(in_lhs[2] * in_rhs[8]) + (in_lhs[6] * in_rhs[9]) + (in_lhs[10] * in_rhs[10]) + (in_lhs[14] * in_rhs[11]),
		(in_lhs[3] * in_rhs[8]) + (in_lhs[7] * in_rhs[9]) + (in_lhs[11] * in_rhs[10]) + (in_lhs[15] * in_rhs[11]),

		(in_lhs[0] * in_rhs[12]) + (in_lhs[4] * in_rhs[13]) + (in_lhs[8] * in_rhs[14]) + (in_lhs[12] * in_rhs[15]),
		(in_lhs[1] * in_rhs[12]) + (in_lhs[5] * in_rhs[13]) + (in_lhs[9] * in_rhs[14]) + (in_lhs[13] * in_rhs[15]),
		(in_lhs[2] * in_rhs[12]) + (in_lhs[6] * in_rhs[13]) + (in_lhs[10] * in_rhs[14]) + (in_lhs[14] * in_rhs[15]),
		(in_lhs[3] * in_rhs[12]) + (in_lhs[7] * in_rhs[13]) + (in_lhs[11] * in_rhs[14]) + (in_lhs[15] * in_rhs[15]),
		];
}

const matrixTransformPosition = function(in_matrix, in_position){
	const x = in_position[0];
	const y = in_position[1];
	const z = in_position[2];
	const w = 1.0;
	return [
		(x * in_matrix[0]) + (y * in_matrix[4]) + (z * in_matrix[8]) + (w * in_matrix[12]),
		(x * in_matrix[1]) + (y * in_matrix[5]) + (z * in_matrix[9]) + (w * in_matrix[13]),
		(x * in_matrix[2]) + (y * in_matrix[6]) + (z * in_matrix[10]) + (w * in_matrix[14]),
	];
}

const innerVisitNodes = function(in_gltf, in_callback, in_parentTransform, in_node){
	var nodeTransform = matrixFromNode(in_node);
	var localTransform = matrixConcat(in_parentTransform, nodeTransform);

	in_callback(in_gltf, in_node, localTransform);

	if ("children" in in_node){
		for (var index = 0; index < in_node.children.length; ++index){
			var nodeIndex = in_node.children[index];
			innerVisitNodes(in_gltf, in_callback, localTransform, in_gltf.nodes[nodeIndex]);
		}
	}

	return;
}

//in_callback(in_gltf, in_node, in_matrix)
const visitNodes = function(in_gltf, in_callback){
	var rootTransform = matrixIdentity();
	var sceneIndex = in_gltf.scene;
	var scene = in_gltf.scenes[sceneIndex];
	for (var index = 0; index < scene.nodes.length; ++index){
		var nodeIndex = scene.nodes[index];
		innerVisitNodes(in_gltf, in_callback, rootTransform, in_gltf.nodes[nodeIndex]);
	}
	return;
}

module.exports = {
	"matrixFromNode" : matrixFromNode,
	"matrixConcat" : matrixConcat,
	"matrixTransformPosition" : matrixTransformPosition,
	"visitNodes" : visitNodes
}