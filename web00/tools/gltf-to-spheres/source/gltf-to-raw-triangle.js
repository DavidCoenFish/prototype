const NodeRfc2397 = require("node-rfc2397");

//const sourceGltf = FsExtra.readJsonSync("input\\female_anatomy\\scene.gltf");

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
		console.log("in_err:" + in_err);
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
const primitiveToRawTriangleArray = function (inout_rawArray, in_primitives, in_gltf){
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
			inout_rawArray.push(posArray[posIndex + 0]);
			inout_rawArray.push(posArray[posIndex + 1]);
			inout_rawArray.push(posArray[posIndex + 2]);
		}
	} else {
		var posArray = getDataArray(in_gltf, posIndex);
		for (var index = 0; index < posArray.length; index += 3){
			inout_rawArray.push(posArray[index + 0]);
			inout_rawArray.push(posArray[index + 1]);
			inout_rawArray.push(posArray[index + 2]);
		}
	}

	return inout_rawArray;
}

const gltfToRawTriangleArray = function(in_gltf){
	var result = [];
	for (var index = 0; index < in_gltf.meshes.length; ++index){
		var mesh = in_gltf.meshes[index];
		if (("primitives" in mesh) && (undefined != mesh.primitives)){
			for (var subIndex = 0; subIndex < mesh.primitives.length; ++subIndex){
				primitiveToRawTriangleArray(result, mesh.primitives[subIndex], in_gltf);
			}
		}
	}
	return result;
}

module.exports = gltfToRawTriangleArray;

