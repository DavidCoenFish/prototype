const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper){
	const m_posDataStream = WebGL.ModelDataStream.factory("FLOAT", 4, new Float32Array(gSpheresMaleAnatomy10k), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gSpheresMaleAnatomy10k.length / 4),
		{
			"a_position" : m_posDataStream
		}
		);
}

module.exports = {
	"factory" : factory,
};