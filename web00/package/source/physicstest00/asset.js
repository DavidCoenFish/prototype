const WebGL = require("webgl");

const factoryModel = function(in_webGLContextWrapper){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(gUvSpheresSkeleton50k), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gUvSpheresSkeleton50k.length / 2),
		{
			"a_uv" : m_uvDataStream
		}
		);
}

const factoryTexture = function(in_webGLContextWrapper){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLContextWrapper, 
		256, 
		256,
		new Float32Array(gTexSpheresSkeleton50k)
	);
}

module.exports = {
	"factoryModel" : factoryModel,
	"factoryTexture" : factoryTexture,
};