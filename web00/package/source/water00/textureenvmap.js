const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper){
	const m_posDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Int8Array([
				-1, -1,
				-1, 1,
				1, -1,

				1, -1,
				-1, 1,
				1, 1
				]),
			"STATIC_DRAW",
			false
		);

	return WebGL.ModelWrapper.factory(
		in_webGLContextWrapper, 
		"TRIANGLES",
		6,
		{
			"a_position" : m_posDataStream
		}

	);
}

module.exports = {
	"factory" : factory,
};