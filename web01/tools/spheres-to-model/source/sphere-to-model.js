const Q = require("q");
const FileSystem = require("fs");
const FsExtra = require("fs-extra");
const CamelCase = require("./camel-case.js");

const getModelText = function(in_posDataArrayName){
	return `const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper){
	const m_posDataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(${in_posDataArrayName}), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(${in_posDataArrayName}.length / 4),
		{
			"a_position" : m_posDataStream
		}
		);
}

module.exports = {
	"factory" : factory,
};`; 
}

const getDataArrayText = function(in_sphereArray, in_posDataArrayName){
	var posArrayText = `const ${in_posDataArrayName} = [`;
	for (var index = 0; index < in_sphereArray.length; index += 4){
		posArrayText += `${in_sphereArray[index + 0]}, ${in_sphereArray[index + 1]}, ${in_sphereArray[index + 2]}, ${in_sphereArray[index + 3]},\n`;
	}
	posArrayText += `]\n`;
	return posArrayText;
}

const run = function(in_sphereArray, in_fileAssetPath, in_fileDataPath, in_baseName){
	var posDataArrayName ="g" + CamelCase.uppercaseFirstLetter(CamelCase.toCamelCase(in_baseName));
	var modelText = getModelText(posDataArrayName);
	var dataText = getDataArrayText(in_sphereArray, posDataArrayName);

	return FsExtra.writeFile(in_fileAssetPath, modelText).then(function(){
		return FsExtra.writeFile(in_fileDataPath, dataText);
	});
}

module.exports = {
	"run" : run
}