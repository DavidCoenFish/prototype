const ModelWrapper = require("./modelwrapper.js");
const ModelDataStream = require("./modeldatastream.js");

const factory = function(in_webGLState){
	const posDataStream = ModelDataStream.factory(
		"FLOAT",
		2,
		new Float32Array([
			-1, -1,
			-1, 1,
			1, -1,
			-1, 1,
			1, -1,
			1, 1
			]),
		"STATIC_DRAW",
		false
		);
	const uvDataStream = ModelDataStream.factory(
		"UNSIGNED_BYTE",
		2,
		new Uint8Array([
			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 0,
			1, 1
			]),
		"STATIC_DRAW",
		false
		);

	return ModelWrapper.factory(
		in_webGLState, 
		"TRIANGLES", 
		6, 
		{
			"a_position" : posDataStream,
			"a_uv" : uvDataStream
		}
	);
}

module.exports = {
	"factory" : factory
}