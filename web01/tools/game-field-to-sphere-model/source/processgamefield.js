const Q = require("q");
const Base64 = require("./base64.js");

const appendArray = function(in_dest, in_src){
	for (var index = 0; index < in_src.length; ++index){
		in_dest.push(in_src[index])
	}
}

const appendArrayUint16ToUint8 = function(in_dest, in_src){
	if ((undefined === in_dest) || (undefined === in_src)){
		return;
	}
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
	appendArray(inout_model.modelSphereData, in_node.sphere);
	appendArrayUint16ToUint8(inout_model.objectID, in_node.objectid);
	appendArrayColourToUint8(inout_model.colour, in_node.colour);

	return;
}

const printModel = function(in_model){
	const elementCount = Math.round(in_model.modelSphereData.length / 4);
	var objectIDText = "";
	if (undefined !== in_model.objectID){
		objectIDText = `,
			"a_objectID" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 2, Base64ToUint8Array("${Base64.Uint8ArrayToBase64(in_model.objectID)}"), "STATIC_DRAW", true)
`;
	}
	const result = `
import { Base64ToUint8Array, Base64ToFloat32Array } from './../core/base64.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';

export default function(in_webGLState){
	return ModelWrapperFactory(
		in_webGLState, "POINTS", ${elementCount}, {
			"a_sphere" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("${Base64.Float32ArrayToBase64(in_model.modelSphereData)}"), "STATIC_DRAW", false),
			"a_colour" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 4, Base64ToUint8Array("${Base64.Uint8ArrayToBase64(in_model.colour)}"), "STATIC_DRAW", true)${objectIDText}
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
		"colour" : []
	};

	// nodearray
	for (var index = 0; index < in_gameField.nodearray.length; ++index){
		var node = in_gameField.nodearray[index];
		if (!("sphere" in node) || !("objectid" in node)){
			continue;
		}
		appendNodeToModel(tempModel, node);
	}

	var result = printModel(tempModel);

	return result;
}

const runVisualModel = function(){
	var tempModel = {
		"modelSphereData" : [],
		"colour" : []
	};

	for (var index = 0; index < in_gameField.nodearray.length; ++index){
		//{"objectid":1,"convexhull":[[0,0,1,0.9122472186352573],[0,0,-1,1],[1,0,0,-7.25],[-1,0,0,8.25],[0.5,0.28867513459481287,0,-5.583333333333333],[0.5,-0.28867513459481287,0,-1.8333333333333337],[-0.5,0.28867513459481287,0,2.166666666666667],[-0.5,-0.28867513459481287,0,5.916666666666666]],"colour":[0.2,0.2,0.5]}
		var node = in_gameField.nodearray[index];
		if (!("sphere" in node) || ("objectid" in node)){
			continue;
		}
		appendNodeToModel(tempModel, node);
	}

	var result = printModel(tempModel);

	return result;
}

module.exports = {
	"runObjectIDModel" : runObjectIDModel,
	"runVisualModel" : runVisualModel,
}