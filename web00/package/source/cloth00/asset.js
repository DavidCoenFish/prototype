const Core = require("core");
const WebGL = require("webgl");

const debugModelFactory = function(in_webGLState){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array([
		0.25, 0.25,
		0.75, 0.25,
	]), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLState, 
		"POINTS",
		m_uvDataStream.getVertexCount(),
		{
			"a_uv" : m_uvDataStream
		}
	);
}

const debugTexturePosFactory = function(in_webGLState){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLState, 
		2, 
		2,
		new Float32Array([
			-0.5, 0.0, 0.5, 1.0, //0.25, 0.25
			0.5, 0.0, 0.5, 1.0, //0.75, 0.25
			0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0,
		])
	);
}

//const materialFactory = function(){
//	return WebGL.MaterialWrapper.factory();
//}

const sModelName = "model";
const sTexturePosName = "texturePos";
//const sMaterial = "material";

const registerAssets = function(in_resourceManager){
	if (false === in_resourceManager.hasFactory(sModelName)){
		in_resourceManager.addFactory(sModelName, debugModelFactory);
	}
	if (false === in_resourceManager.hasFactory(sTexturePosName)){
		in_resourceManager.addFactory(sTexturePosName, debugTexturePosFactory);
	}
	//if (false === in_resourceManager.hasFactory(sMaterial)){
	//	in_resourceManager.addFactory(sMaterial, materialFactory);
	//}

	return;
}


module.exports = {
	"registerAssets" : registerAssets,
	"sModelName" : sModelName,
	"sTexturePosName" : sTexturePosName,
	//"sMaterial" : sMaterial
};