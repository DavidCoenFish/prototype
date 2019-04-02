import ModelDataStreamFactory from "./modeldatastream.js";
import ModelWrapperFactory from "./modelwrapper.js";

const modelFactory = function(in_webGLState){
	const posDataStream = ModelDataStreamFactory(
		in_webGLState, 
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
	const uvDataStream = ModelDataStreamFactory(
		in_webGLState, 
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

	return ModelWrapperFactory(
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
export default function(in_resourceManager, in_webGLState){
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
