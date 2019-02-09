const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(gUvSpheres10x10x10), "STATIC_DRAW", false);
	const m_link0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink0Spheres10x10x10), "STATIC_DRAW", false);
	const m_link1DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink1Spheres10x10x10), "STATIC_DRAW", false);
	const m_link2DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink2Spheres10x10x10), "STATIC_DRAW", false);
	const m_link3DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink3Spheres10x10x10), "STATIC_DRAW", false);
	const m_link4DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink4Spheres10x10x10), "STATIC_DRAW", false);
	const m_link5DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink5Spheres10x10x10), "STATIC_DRAW", false);
	const m_link6DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink6Spheres10x10x10), "STATIC_DRAW", false);
	const m_link7DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink7Spheres10x10x10), "STATIC_DRAW", false);
	const m_link8DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink8Spheres10x10x10), "STATIC_DRAW", false);
	const m_link9DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink9Spheres10x10x10), "STATIC_DRAW", false);
	const m_link10DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink10Spheres10x10x10), "STATIC_DRAW", false);
	const m_link11DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink11Spheres10x10x10), "STATIC_DRAW", false);


	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gUvSpheres10x10x10.length / 2),
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
			"a_link8" : m_link8DataStream,
			"a_link9" : m_link9DataStream,
			"a_link10" : m_link10DataStream,
			"a_link11" : m_link11DataStream,

		}
	);
}

const factoryTexture = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexSpheres10x10x10)
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};