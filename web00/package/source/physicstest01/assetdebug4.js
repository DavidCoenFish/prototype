const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	var uvData = [
		0.125, 0.125, //a
		0.375, 0.125, //b
		0.625, 0.125, //c
		0.875, 0.125, //d
		0.125, 0.375, //e
		0.375, 0.375, //f
		0.625, 0.375, //g
		0.875, 0.375, //h
		0.125, 0.625, //i
	];
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(uvData), "STATIC_DRAW", false);

	const linkData0 = [
		0.375, 0.125, 0.012, //b
		0.125, 0.125, 0.012, //a
		0.375, 0.125, 0.012, //b
		0.125, 0.125, 0.012, //a
		0.125, 0.125, 0.0104, //a
		0.125, 0.125, 0.012, //a
		0.375, 0.125, 0.012, //b
		0.625, 0.125, 0.012, //c
		0.875, 0.125, 0.012, //d
	];
	const m_link0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData0), "STATIC_DRAW", false);
	const linkData1 = [
		0.875, 0.125, 0.012, //d
		0.625, 0.125, 0.012, //c
		0.875, 0.125, 0.012, //d
		0.625, 0.125, 0.012, //c
		0.375, 0.125, 0.0104, //b
		0.125, 0.375, 0.0104, //e
		0.125, 0.375, 0.0104, //e
		0.125, 0.375, 0.0104, //e
		0.125, 0.375, 0.0104, //e
	];
	const m_link1DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData1), "STATIC_DRAW", false);
	const linkData2 = [
		0.125, 0.375, 0.0104, //e
		0.125, 0.375, 0.0104, //e
		0.125, 0.375, 0.0104, //e
		0.125, 0.375, 0.0104, //e
		0.625, 0.125, 0.0104, //c
		0.625, 0.375, 0.012, //g
		0.375, 0.375, 0.012, //f
		0.625, 0.375, 0.012, //g
		0.375, 0.375, 0.012, //f
	];
	const m_link2DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData2), "STATIC_DRAW", false);
	const linkData3 = [
		0.375, 0.375, 0.012, //f
		0.625, 0.375, 0.012, //g
		0.875, 0.375, 0.012, //h
		0.125, 0.625, 0.012, //i
		0.875, 0.125, 0.0104, //d
		0.125, 0.625, 0.012, //i
		0.875, 0.375, 0.012, //h
		0.125, 0.625, 0.012, //i
		0.875, 0.375, 0.012, //h
	];
	const m_link3DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData3), "STATIC_DRAW", false);
	const linkData4 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.375, 0.375, 0.0104, //f
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
		0.625, 0.375, 0.0104, //g
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
		0.875, 0.375, 0.0104, //h
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
		0.125, 0.625, 0.0104, //i
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link7DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData7), "STATIC_DRAW", false);

	const linkData8 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link8DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData8), "STATIC_DRAW", false);

	const linkData9 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link9DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData9), "STATIC_DRAW", false);

	const linkData10 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link10DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData10), "STATIC_DRAW", false);

	const linkData11 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link11DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData11), "STATIC_DRAW", false);

	const linkData12 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link12DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData12), "STATIC_DRAW", false);

	const linkData13 = [
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	];
	const m_link13DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(linkData13), "STATIC_DRAW", false);

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

			"a_link8" : m_link7DataStream,
			"a_link9" : m_link7DataStream,
			"a_link10" : m_link7DataStream,
			"a_link11" : m_link7DataStream,
			"a_link12" : m_link7DataStream,
			"a_link13" : m_link7DataStream,

		}
	);
}

const factoryTexture = function(in_webGLContextWrapper){
	var floatData = [
		0.0, 0.0, 0.1, 0.012,
		0.012, 0.0, 0.1, 0.012,
		0.012, 0.012, 0.1, 0.012,
		0.0, 0.012, 0.1, 0.012,

		0.006, 0.006, 0.106, 0.012,
		0.0, 0.0, 0.112, 0.012,
		0.012, 0.0, 0.112, 0.012,
		0.012, 0.012, 0.112, 0.012,

		0.0, 0.012, 0.112, 0.012,
		0.0, 0.0, 0.0, 0.0, 
		0.0, 0.0, 0.0, 0.0, 
		0.0, 0.0, 0.0, 0.0, 

		0.0, 0.0, 0.0, 0.0, 
		0.0, 0.0, 0.0, 0.0, 
		0.0, 0.0, 0.0, 0.0, 
		0.0, 0.0, 0.0, 0.0, 
	];
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		4, 
		4,
		new Float32Array(floatData)
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};