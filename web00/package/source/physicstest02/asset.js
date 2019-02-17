const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(gUvSphere), "STATIC_DRAW", false);
	const m_linkUv0DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gUvLink0), "STATIC_DRAW", false);
	const m_linkUv1DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gUvLink1), "STATIC_DRAW", false);
	const m_linkUv2DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gUvLink2), "STATIC_DRAW", false);
	const m_linkUv3DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gUvLink3), "STATIC_DRAW", false);
	const m_linkUv4DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gUvLink4), "STATIC_DRAW", false);
	const m_linkUv5DataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gUvLink5), "STATIC_DRAW", false);


	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gUvSphere.length / 2),
		{
			"a_uv" : m_uvDataStream,
			"a_linkUv0" : m_linkUv0DataStream,
			"a_linkUv1" : m_linkUv1DataStream,
			"a_linkUv2" : m_linkUv2DataStream,
			"a_linkUv3" : m_linkUv3DataStream,
			"a_linkUv4" : m_linkUv4DataStream,
			"a_linkUv5" : m_linkUv5DataStream,

		}
	);
}

const factoryTexSpherePos = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexSpherePosData)
	);
}
const factoryTexVolume0 = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexVolume0Data)
	);
}
const factoryTexVolume1 = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexVolume1Data)
	);
}
const factoryTexVolume2 = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexVolume2Data)
	);
}
const factoryTexVolume3 = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexVolume3Data)
	);
}
const factoryTexVolume4 = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		32, 
		32,
		new Float32Array(gTexVolume4Data)
	);
}


module.exports = {
	"factoryTexSpherePos" : factoryTexSpherePos,
	"factoryTexVolume0" : factoryTexVolume0,
	"factoryTexVolume1" : factoryTexVolume1,
	"factoryTexVolume2" : factoryTexVolume2,
	"factoryTexVolume3" : factoryTexVolume3,
	"factoryTexVolume4" : factoryTexVolume4,
	"factoryModel" : factoryModel
};