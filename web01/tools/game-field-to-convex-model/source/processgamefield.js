const Q = require("q");
const Base64 = require("./base64.js");

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

/*
https://www.gamedev.net/forums/topic/90414-calculate-where-3-planes-intersect/
	D3DXVECTOR3 Normal = (&Plane->a, &Plane->b, &Plane->c);
	D3DXVECTOR3 Normal2 = (&Plane2->a, &Plane2->b, &Plane2->c);
	D3DXVECTOR3 Normal3 = (&Plane3->a, &Plane3->b, &Plane3->c);
	D3DXVECTOR3 CrossProduct;
	D3DXVECTOR3 CrossProduct2;
	D3DXVECTOR3 CrossProduct3;
	D3DXVECTOR3 DotProduct;
	float DotProduct2;
	float DotProduct3;
	D3DXVECTOR3 IntersectCoordinate;
	D3DXVECTOR3 Num1, Num2, Num3;
	D3DXVec3Cross( &CrossProduct , &Normal2 , &Normal3 );
	D3DXVec3Cross( &CrossProduct2 , &Normal3 , &Normal );
	D3DXVec3Cross( &CrossProduct3 , &Normal , &Normal2 );

	float XPos;
	float YPos;
	float ZPos;

	float denom = D3DXVec3Dot (&Normal, &CrossProduct);
	if( denom == 0 ) {
		return FALSE;
	}
	
	Num1 = -(Plane->d * CrossProduct);
	Num2 = -(Plane2->d * CrossProduct2);
	Num3 = -(Plane3->d * CrossProduct3);
	
	IntersectCoordinate =  (Num1 + Num2 + Num3) / denom;

	X = IntersectCoordinate.x;
	Y = IntersectCoordinate.y;
	Z = IntersectCoordinate.z;

	return TRUE;


 */
const intersectPlanePlanePlane = function(in_planeA, in_planeB, in_planeC){
	const crossA = crossProduct(in_planeB, in_planeC);
	const denom = dotProduct(in_planeA, crossA);
	if (Math.abs(denom) <= Number.EPSILON){
		return undefined;
	}
	const crossB = crossProduct(in_planeC, in_planeA);
	const crossC = crossProduct(in_planeA, in_planeB);

	const vecA = vecScalarMultiply(crossA, in_planeA[3]);
	const vecB = vecScalarMultiply(crossB, in_planeB[3]);
	const vecC = vecScalarMultiply(crossC, in_planeC[3]);

	const result = [
		(vecA[0] + vecB[0] + vecC[0]) / denom,
		(vecA[1] + vecB[1] + vecC[1]) / denom,
		(vecA[2] + vecB[2] + vecC[2]) / denom
	];
	return result;
}

const pointInsideAllOtherPlanes = function(in_point, in_convexhullArray, in_ignoreA, in_ignoreB, in_ignoreC){
	const count = in_convexhullArray.length;
	for (var i = 0; i < count; ++i){
		if ((in_ignoreA === i) ||
			(in_ignoreB === i) ||
			(in_ignoreC === i)){
			continue;
		}

		var plane = in_convexhullArray[i];
		var d = dotProduct(plane, in_point);
		if (plane[3] <= d){
			return false;
		}
	}
	return true;
}

const convexHullToPointCloud = function(in_convexhullArray){
	var pointCloud = [];
	const count = in_convexhullArray.length;
	for (var i = 0; i < count; ++i){
		for (var j = i + 1; j < count; ++j){
			for (var k = j + 1; k < count; ++k){
				var intersectionPoint = intersectPlanePlanePlane(in_convexhullArray[i], in_convexhullArray[j], in_convexhullArray[k]);
				if (undefined === intersectionPoint){
					continue;
				}
				if (true !== pointInsideAllOtherPlanes(intersectionPoint, in_convexhullArray, i, j, k)){
					continue;
				}
				pointCloud.push(intersectionPoint);
			}
		}
	}
	return pointCloud;
}

const pointDistanceSquared = function(in_pointA, in_pointB){
	var AB = [in_pointB[0] - in_pointA[0], in_pointB[1] - in_pointA[1], in_pointB[2] - in_pointA[2]];
	var dSquared = dotProduct(AB, AB);
	return dSquared;
}

const expandSphere = function(inout_sphere, in_point){
	var AB = pointDistanceSquared(inout_sphere, in_point);
	var rSquared = inout_sphere[3] * inout_sphere[3];
	if (rSquared < AB){
		inout_sphere[3] = Math.sqrt(AB);
	}
	return;
}

const makeSphereToFitPointColud = function(in_pointCloud){
	const count = in_pointCloud.length;
	var pointA = undefined;
	var pointB = undefined;
	var pointC = undefined;
	var pointD = undefined;
	var bestDistance;
	var bestIndexA;
	var bestIndexB;
	for (var index = 0; index < count; ++index){
		for (var subIndex = index + 1; subIndex < count; ++subIndex){
			var d = pointDistanceSquared(in_pointCloud[index], in_pointCloud[subIndex]);
			if ((bestDistance === undefined) || 
				(bestDistance < d)){
				bestDistance = d;
				pointA = in_pointCloud[index];
				bestIndexA = index;
				pointB = in_pointCloud[subIndex];
				bestIndexB = subIndex;
			}
		}
	}
	//just expand from midpoint
	var sphere = [(pointA[0] + pointB[0]) * 0.5, (pointA[1] + pointB[1]) * 0.5, (pointA[2] + pointB[2]) * 0.5, Math.sqrt(bestDistance) * 0.5];
	//want the 2 points furthest away from the mid other than the best index
	for (var index = 0; index < count; ++index){
		if ((bestIndexA === index) ||
			(bestIndexB === index)){
			continue;
		}
		expandSphere(sphere, in_pointCloud[index]); 
	}
	return sphere;
}


const appendArray = function(in_dest, in_src){
	for (var index = 0; index < in_src.length; ++index){
		in_dest.push(in_src[index])
	}
}

const appendArrayUint16ToUint8 = function(in_dest, in_src){
	in_dest.push(in_src >> 8);
	in_dest.push(in_src & 255);
}

const appendArrayColourToUint8 = function(in_dest, in_src){
	for (var index = 0; index < in_src.length; ++index){
		var value = Math.round(in_src[index] * 255);
		value = Math.max(0, Math.min(255, value));
		in_dest.push(value)
	}
}

const appendNodeToModel = function(inout_model, in_node){
	const pointCloud = convexHullToPointCloud(in_node.convexhull);
	const sphere = makeSphereToFitPointColud(pointCloud);

	appendArray(inout_model.modelSphereData, sphere);
	appendArrayUint16ToUint8(inout_model.objectID, in_node.objectid);
	appendArrayColourToUint8(inout_model.colour, in_node.colour);
	appendArray(inout_model.modelPlane0, in_node.convexhull[0]);
	appendArray(inout_model.modelPlane1, in_node.convexhull[1]);
	appendArray(inout_model.modelPlane2, in_node.convexhull[2]);
	appendArray(inout_model.modelPlane3, in_node.convexhull[3]);
	appendArray(inout_model.modelPlane4, in_node.convexhull[4]);
	appendArray(inout_model.modelPlane5, in_node.convexhull[5]);
	appendArray(inout_model.modelPlane6, in_node.convexhull[6]);
	appendArray(inout_model.modelPlane7, in_node.convexhull[7]);

	return;
}

const printModel = function(in_model){
	const elementCount = Math.round(in_model.modelSphereData.length / 4);
	const result = `
import { Base64ToUint8Array, Base64ToFloat32Array } from './../core/base64.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';

export default function(in_webGLState){
	return ModelWrapperFactory(
		in_webGLState, "POINTS", ${elementCount}, {
			"a_sphere" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelSphereData)}"), "STATIC_DRAW", false),
			"a_objectID" : ModelDataStream(in_webGLState, "BYTE", 2, Base64ToUint8Array("${Base64.Uint8ArrayToBase64(in_model.objectID)}"), "STATIC_DRAW", true),
			"a_colour" : ModelDataStream(in_webGLState, "BYTE", 3, Base64ToUint8Array("${Base64.Uint8ArrayToBase64(in_model.colour)}"), "STATIC_DRAW", true),
			"a_plane0" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane0)}"), "STATIC_DRAW", false),
			"a_plane1" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane1)}"), "STATIC_DRAW", false),
			"a_plane2" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane2)}"), "STATIC_DRAW", false),
			"a_plane3" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane3)}"), "STATIC_DRAW", false),
			"a_plane4" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane4)}"), "STATIC_DRAW", false),
			"a_plane5" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane5)}"), "STATIC_DRAW", false),
			"a_plane6" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane6)}"), "STATIC_DRAW", false),
			"a_plane7" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelPlane7)}"), "STATIC_DRAW", false)
		}
	);
}
`;
	return result;
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