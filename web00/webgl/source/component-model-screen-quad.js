const ModelWrapper = require("./modelwrapper.js");
const ModelDataStream = require("./modeldatastream.js");

const modelFactory = function(in_webGLState){
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

const sModelName = "componentModelScreenQuad";
const factory = function(in_resourceManager, in_webGLState){
	if (false === in_resourceManager.hasFactory(sModelName)){
		in_resourceManager.addFactory(sModelName, modelFactory);
	}

	var m_model = in_resourceManager.getCommonReference(sModelName, in_webGLState);

	//public methods ==========================
	const that = Object.create({
		"getModel" : function(){
			return m_model;
		},
		"destroy" : function(){
			m_model = undefined;
			in_resourceManager.releaseCommonReference(sModelName);
		}
	})

	return that;
}

module.exports = {
	"modelFactory" : modelFactory, 
	"sModelName" : sModelName,
	"factory" : factory
}