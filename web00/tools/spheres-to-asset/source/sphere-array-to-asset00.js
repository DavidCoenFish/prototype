const FsExtra = require("fs-extra");

const makeTextureData = function(in_arraySphere, in_textureDim){
	var result = [];
	const count = in_textureDim * in_textureDim * 3;
	for (var index = 0; index < count; ++index){
		var value = 0.0;
		if (index < in_arraySphere.length){
			value = in_arraySphere[index];
		}
		result.push(value);
	}
	return result;
}

const makeUvData = function(in_sphereCount, in_textureDim){
	var result = [];
	for (var index = 0; index < in_sphereCount; ++index)
	{
		var y = Math.floor(index / in_textureDim);
		var x = index % in_textureDim;
		var u = (x + x + 1) / (in_textureDim + in_textureDim);
		var v = (y + y + 1) / (in_textureDim + in_textureDim);
		result.push(u);
		result.push(v);
	}
	return result;
}

const saveFile = function(in_filePath, in_fileData){
	FsExtra.writeFileSync(in_filePath, in_fileData);
	return;
}

//gModelUVData
//gTextureData
const saveAssetFile = function(in_outputFilePathAsset, in_textureDim){
	var data = `const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(gModelUVData), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gModelUVData.length / 2),
		{
			"a_uv" : m_uvDataStream
		}
		);
}

const factoryTexture = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGB(
		in_webGLContextWrapper, 
		${in_textureDim}, 
		${in_textureDim},
		new Float32Array(gTextureData)
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};
`;
	saveFile(in_outputFilePathAsset, data);
	return;
}


const saveDataFile = function(in_outputFilePathData, in_textureData, in_uvData){
	var data = `
const gModelUVData = ${JSON.stringify(in_uvData)};
const gTextureData = ${JSON.stringify(in_textureData)};
`;
	saveFile(in_outputFilePathData, data);
	return;
}


//make a asset file (model, texture) and data file (texture data, 
const run = function(in_arraySphere, in_outputFilePathAsset, in_outputFilePathData){
	console.log("sphere array to model:" + in_outputFilePathAsset + " " + in_outputFilePathData + " " + in_arraySphere.length);

	const sphereCount = in_arraySphere.length / 3;
	const textureDim = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(sphereCount))));
	const textureData = makeTextureData(in_arraySphere, textureDim);
	const uvData = makeUvData(sphereCount, textureDim);
	saveAssetFile(in_outputFilePathAsset, textureDim);
	saveDataFile(in_outputFilePathData, textureData, uvData);
	return;
}

module.exports = {
	"run" : run
}