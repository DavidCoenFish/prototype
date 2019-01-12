const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper){
	const posDataArray = gModelDataPosArray;
	const m_posDataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array(posDataArray), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"POINTS",
		Math.floor(posDataArray.length / 3),
		{
			"a_position" : m_posDataStream
		}
		);
}

module.exports = {
	"factory" : factory,
};