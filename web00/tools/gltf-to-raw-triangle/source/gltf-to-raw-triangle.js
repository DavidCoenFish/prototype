const NodeRfc2397 = require("node-rfc2397");
const GltfHelper = require("./gltf-helper.js");

const getBuffer = function(in_gltf, in_bufferIndex){
	const buffer = in_gltf.buffers[in_bufferIndex];
	return buffer;
}

/*
{"buffer":0,"byteLength":218232,"byteOffset":260328,"byteStride":12,"name":"floatBufferViews","target":34962}
 */
const getBufferView = function(in_gltf, in_bufferViewIndex){
	const bufferView = in_gltf.bufferViews[in_bufferViewIndex];
	//console.log(JSON.stringify(bufferView));
	return bufferView;
}

/*
{"bufferView":2,"componentType":5126,"count":9093,"max":[1.8420699834823608,0.9078800082206726,4.608749866485596],"min":[-1.8420699834823608,-0.6549100279808044,-4.343979835510254],"type":"VEC3","byteOffset":0}
 */
const getDataArray = function(in_gltf, in_accessorIndex){
	const accessor = in_gltf.accessors[in_accessorIndex];
	const bufferView = getBufferView(in_gltf, accessor.bufferView);
	const buffer = getBuffer(in_gltf, bufferView.buffer);

	var info;
	try{
		info = NodeRfc2397.parseSync(buffer.uri);
	} catch(in_error) {
		console.log("in_error:" + in_error);
		return;
	}

	var componentCount = 1;
	switch (accessor.type){
	case "SCALAR":
		componentCount = 1;
		break;
	case "VEC2":
		componentCount = 2;
		break;
	case "VEC3":
		componentCount = 3;
		break;
	case "VEC4":
		componentCount = 4;
		break;
	case "MAT2":
		componentCount = 4;
		break;
	case "MAT3":
		componentCount = 9;
		break;
	case "MAT4":
		componentCount = 16;
		break;
	}

	var bufferData = new ArrayBuffer(info.data.length);
	var bufferDataView = new DataView(bufferData);
	for (var index = 0; index < info.data.length; ++index){
		bufferDataView.setInt8(index, info.data[index]);
	}
	var result = [];
	switch (accessor.componentType){
	case 5120: // (BYTE)	1
		var byteStride = (undefined === bufferView.byteStride) ? 1 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 1);
				result.push(bufferDataView.getInt8(byteBase, true));
			}
		}
		break;
	case 5121: // (UNSIGNED_BYTE)	1
		var byteStride = (undefined === bufferView.byteStride) ? 1 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 1);
				result.push(bufferDataView.getUint8(byteBase, true));
			}
		}
		break;
	case 5122: // (SHORT)	2
		var byteStride = (undefined === bufferView.byteStride) ? 2 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 2);
				result.push(bufferDataView.getInt16(byteBase, true));
			}
		}
		break;
	case 5123: // (UNSIGNED_SHORT)	2
		var byteStride = (undefined === bufferView.byteStride) ? 2 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 2);
				result.push(bufferDataView.getUint16(byteBase, true));
			}
		}
		break;
	case 5124: // (INT)	4
		var byteStride = (undefined === bufferView.byteStride) ? 4 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 4);
				result.push(bufferDataView.getInt32(byteBase, true));
			}
		}
		break;
	case 5125: // (UNSIGNED_INT)	4
		var byteStride = (undefined === bufferView.byteStride) ? 4 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 4);
				result.push(bufferDataView.getUint32(byteBase, true));
			}
		}
		break;
	case 5126: // (FLOAT)	4
		var byteStride = (undefined === bufferView.byteStride) ? 4 : bufferView.byteStride;
		for (var index = 0; index < accessor.count; ++index){
			for (var subIndex = 0; subIndex < componentCount; ++subIndex){
				var byteBase = accessor.byteOffset + bufferView.byteOffset + (index * byteStride) + (subIndex * 4);
				result.push(bufferDataView.getFloat32(byteBase, true));
			}
		}
		break;
	}

	return result;
}

const addPos = function(inout_rawArray, in_pos, in_matrix){
	var newPos = GltfHelper.matrixTransformPosition(in_matrix, in_pos);
	inout_rawArray.push(newPos[0]);
	inout_rawArray.push(newPos[1]);
	inout_rawArray.push(newPos[2]);
	return;
}

/*
5120 (BYTE)	1
5121(UNSIGNED_BYTE)	1
5122 (SHORT)	2
5123 (UNSIGNED_SHORT)	2
5125 (UNSIGNED_INT)	4
5126 (FLOAT)	4

"SCALAR"	1
"VEC2"	2
"VEC3"	3
"VEC4"	4
"MAT2"	4
"MAT3"	9
"MAT4"	16

0 POINTS
1 LINES
2 LINE_LOOP
3 LINE_STRIP
4 TRIANGLES
5 TRIANGLE_STRIP
6 TRIANGLE_FAN
 */
const primitiveToRawTriangleArray = function (inout_rawArray, in_primitives, in_gltf, in_matrix){
	console.log(" attributes POSITION:" + in_primitives.attributes.POSITION + " indices:" + in_primitives.indices);

	var indices = in_primitives.indices;
	if (false === "POSITION" in in_primitives.attributes){
		return;
	}
	var posIndex = in_primitives.attributes.POSITION;
	if (undefined !== indices){
		var indexArray = getDataArray(in_gltf, indices);
		var posArray = getDataArray(in_gltf, posIndex);
		for (var index = 0; index < indexArray.length; ++index){
			var posIndex = indexArray[index] * 3;
			addPos(inout_rawArray, [posArray[posIndex + 0], posArray[posIndex + 1], posArray[posIndex + 2]], in_matrix);
		}
	} else {
		var posArray = getDataArray(in_gltf, posIndex);
		for (var index = 0; index < posArray.length; index += 3){
			addPos(inout_rawArray, [posArray[index + 0], posArray[index + 1], posArray[index + 2]], in_matrix);
		}
	}

	return inout_rawArray;
}

const gltfToRawTriangleArray = function(in_gltf){
	var result = [];

	GltfHelper.visitNodes(in_gltf, function(in_gltf, in_node, in_matrix){
		if ("mesh" in in_node){
			var mesh = in_gltf.meshes[in_node.mesh];
			if (("primitives" in mesh) && (undefined != mesh.primitives)){
				for (var subIndex = 0; subIndex < mesh.primitives.length; ++subIndex){
					primitiveToRawTriangleArray(result, mesh.primitives[subIndex], in_gltf, in_matrix);
				}
			}
		}
	});

	return result;
}

module.exports = {
 "gltfToRawTriangleArray" : gltfToRawTriangleArray
}

