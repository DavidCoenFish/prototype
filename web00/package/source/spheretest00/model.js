const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper){
	const m_posDataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(gDataFemaleAnatomy), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(gDataFemaleAnatomy.length / 3),
		{
			"a_position" : m_posDataStream
		}
		);
}

module.exports = {
	"factory" : factory,
};