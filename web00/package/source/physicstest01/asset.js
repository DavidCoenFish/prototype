const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(gUvSpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink0SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link1DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink1SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link2DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink2SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link3DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink3SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link4DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink4SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link5DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink5SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link6DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink6SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link7DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink7SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link8DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink8SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link9DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink9SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link10DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink10SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link11DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink11SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link12DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink12SpheresSkeleton10k), "STATIC_DRAW", false);
	const m_link13DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gLink13SpheresSkeleton10k), "STATIC_DRAW", false);


	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gUvSpheresSkeleton10k.length / 2),
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
			"a_link12" : m_link12DataStream,
			"a_link13" : m_link13DataStream,

		}
	);
}

const factoryTexture = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		128, 
		128,
		new Float32Array(gTexSpheresSkeleton10k)
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};