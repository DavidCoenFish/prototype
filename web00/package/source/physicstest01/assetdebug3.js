const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	var uvData = [
		0.25, 0.25, //a
		0.75, 0.25, //b
		0.25, 0.75, //c
		0.75, 0.75, //d
	];
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(uvData), "STATIC_DRAW", false);

	const linkData0 = [
		0.75, 0.25, 0.010392304845413272, //b
		0.25, 0.25, 0.010392304845413272, //a
		0.25, 0.25, 0.010392304845413272, //a
		0.25, 0.25, 0.010392304845413272, //a
	];
	const m_link0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData0), "STATIC_DRAW", false);
	const linkData1 = [
		0.25, 0.75, 0.010392304845413272, //c
		0.25, 0.75, 0.010392304845413272, //c
		0.75, 0.25, 0.010392304845413272, //b
		0.75, 0.25, 0.010392304845413272, //b
	];
	const m_link1DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData1), "STATIC_DRAW", false);
	const linkData2 = [
		0.75, 0.75, 0.010392304845413272, //d
		0.75, 0.75, 0.010392304845413272, //d
		0.75, 0.75, 0.010392304845413272, //d
		0.25, 0.75, 0.010392304845413272, //c
	];
	const m_link2DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData2), "STATIC_DRAW", false);
	const linkData3 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link3DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData3), "STATIC_DRAW", false);
	const linkData4 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link4DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData4), "STATIC_DRAW", false);
	const linkData5 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link5DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData5), "STATIC_DRAW", false);
	const linkData6 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link6DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData6), "STATIC_DRAW", false);
	const linkData7 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link7DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData7), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(uvData.length / 2),
		{
			"a_uv" : m_uvDataStream,
			"a_link0" : m_link0DataStream,
			"a_link1" : m_link1DataStream,
			"a_link2" : m_link2DataStream,
			"a_link3" : m_link3DataStream,
			"a_link4" : m_link4DataStream,
			"a_link5" : m_link5DataStream,
			"a_link6" : m_link6DataStream,
			"a_link7" : m_link7DataStream,
		}
	);
}

const factoryTexture = function(in_webGLContextWrapper){
	var floatData = [
		0.0, 0.0, 0.25, 0.012,
		0.006, 0.0, 0.25, 0.012,
		0.0, 0.006, 0.25, 0.012,
		0.0, 0.0, 0.256, 0.012,
	];
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		2, 
		2,
		new Float32Array(floatData)
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};