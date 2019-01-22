const FsExtra = require("fs-extra");
const Path = require("path");
const CamelCase = require("./camel-case.js");

const getModelText = function(in_posDataArrayName, in_renderMode){
	return `const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper){
	const m_posDataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(${in_posDataArrayName}), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"${in_renderMode}",
		Math.floor(${in_posDataArrayName}.length / 3),
		{
			"a_position" : m_posDataStream
		}
		);
}

module.exports = {
	"factory" : factory,
};`; 
}


const makeHashA = function(in_ax, in_ay, in_az, in_bx, in_by, in_bz){
	return `${in_ax}_${in_ay}_${in_az}_${in_bx}_${in_by}_${in_bz}`
}

const makeHashB = function(in_ax, in_ay, in_az, in_bx, in_by, in_bz){
	return `${in_bx}_${in_by}_${in_bz}_${in_ax}_${in_ay}_${in_az}`
}

const addEdgeIfUnique = function(inout_edgeArray, inout_mapUsedEdge, in_ax, in_ay, in_az, in_bx, in_by, in_bz){
	const hashA = makeHashA(in_ax, in_ay, in_az, in_bx, in_by, in_bz);
	const hashB = makeHashB(in_ax, in_ay, in_az, in_bx, in_by, in_bz);
	if ((hashA in inout_mapUsedEdge) || (hashB in inout_mapUsedEdge)){
		return;
	}
	inout_mapUsedEdge[hashA] = true;

	inout_edgeArray.push(in_ax);
	inout_edgeArray.push(in_ay);
	inout_edgeArray.push(in_az);
	inout_edgeArray.push(in_bx);
	inout_edgeArray.push(in_by);
	inout_edgeArray.push(in_bz);

	return;
}

const rawTriangleToEdgeArray = function(in_rawTriangleArray){
	const edgeArray = [];
	const mapUsedEdge = {};
	for (var index = 0; index < in_rawTriangleArray.length; index += 9){
		addEdgeIfUnique(edgeArray, mapUsedEdge, 
			in_rawTriangleArray[index + 0], in_rawTriangleArray[index + 1], in_rawTriangleArray[index + 2], 
			in_rawTriangleArray[index + 3], in_rawTriangleArray[index + 4], in_rawTriangleArray[index + 5] );
		addEdgeIfUnique(edgeArray, mapUsedEdge, 
			in_rawTriangleArray[index + 3], in_rawTriangleArray[index + 4], in_rawTriangleArray[index + 5],
			in_rawTriangleArray[index + 6], in_rawTriangleArray[index + 7], in_rawTriangleArray[index + 8] );
		addEdgeIfUnique(edgeArray, mapUsedEdge, 
			in_rawTriangleArray[index + 6], in_rawTriangleArray[index + 7], in_rawTriangleArray[index + 8],
			in_rawTriangleArray[index + 0], in_rawTriangleArray[index + 1], in_rawTriangleArray[index + 2] ); 
	}
	return edgeArray;
}

const saveModelEdgeArray = function(in_edgeArray, in_outputFileModel, in_outputFileData, in_dataArrayName){
	var posArrayText = `const ${in_dataArrayName} = [`;
	for (var index = 0; index < in_edgeArray.length; index += 3){
		posArrayText += `${in_edgeArray[index + 0]}, ${in_edgeArray[index + 1]}, ${in_edgeArray[index + 2]},\n`;
	}
	posArrayText += `]\n`;
	FsExtra.writeFileSync(in_outputFileData, posArrayText);

	const text = getModelText(in_dataArrayName, "LINES");
	return FsExtra.writeFileSync(in_outputFileModel, text);
}

const makeHashC = function(in_ax, in_ay, in_az){
	return `${in_ax}_${in_ay}_${in_az}`
}

const rawTriangleToPointArray = function(in_rawTriangleArray){
	const pointArray = [];
	const mapUsedPoint = {};
	for (var index = 0; index < in_rawTriangleArray.length; index += 3){
		var hash = makeHashC(in_rawTriangleArray[index + 0], in_rawTriangleArray[index + 1], in_rawTriangleArray[index + 2]);
		if (hash in mapUsedPoint){
			continue;
		}
		mapUsedPoint[hash] = true;
		pointArray.push(in_rawTriangleArray[index + 0]);
		pointArray.push(in_rawTriangleArray[index + 1]);
		pointArray.push(in_rawTriangleArray[index + 2]);
	}
	return pointArray;
}
const saveModelPointArray = function(in_pointArray, in_outputFileModel, in_outputFileData, in_dataArrayName){
	var posArrayText = `const ${in_dataArrayName} = [`;
	for (var index = 0; index < in_pointArray.length; index += 3){
		posArrayText += `${in_pointArray[index + 0]}, ${in_pointArray[index + 1]}, ${in_pointArray[index + 2]},\n`;
	}
	posArrayText += `]\n`;
	FsExtra.writeFileSync(in_outputFileData, posArrayText);

	const text = getModelText(in_dataArrayName, "POINTS");
	return FsExtra.writeFileSync(in_outputFileModel, text);
}

const saveModelTriangleArray = function(in_rawTriangleArray, in_outputFileModel, in_outputFileData, in_dataArrayName){
	var posArrayText = `const ${in_dataArrayName} = [`;
	for (var index = 0; index < in_rawTriangleArray.length; index += 3){
		posArrayText += `${in_edgeArray[index + 0]}, ${in_edgeArray[index + 1]}, ${in_edgeArray[index + 2]},\n`;
	}
	posArrayText += `]\n`;
	FsExtra.writeFileSync(in_outputFileData, posArrayText);

	const text = getModelText(in_dataArrayName, "TRIANGLES");
	return FsExtra.writeFileSync(in_outputFileModel, text);
}

const run = function(in_rawTriangleArray, in_mode, in_outputFileModel, in_outputFileData){
	const dataArrayName = "g" + CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(Path.basename(in_outputFileData, ".js")));
	if ("edge" === in_mode){
		const edgeArray = rawTriangleToEdgeArray(in_rawTriangleArray);
		return saveModelEdgeArray(edgeArray, in_outputFileModel, in_outputFileData, dataArrayName);
	}
	if ("point" === in_mode){
		const pointArray = rawTriangleToPointArray(in_rawTriangleArray);
		return saveModelPointArray(pointArray, in_outputFileModel, in_outputFileData, dataArrayName);
	}
	return saveModelTriangleArray(in_rawTriangleArray, in_outputFileModel, in_outputFileData, dataArrayName);
}

module.exports = {
	"run" : run
}