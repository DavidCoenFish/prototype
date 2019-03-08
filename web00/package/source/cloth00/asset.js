const Core = require("core");
const WebGL = require("webgl");
const AssetCloth = require("./asset_cloth_model_texture_link12.js");

const debugModelFactory = function(in_webGLState){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array([
		0.25, 0.25,
		0.75, 0.25,
	]), "STATIC_DRAW", false);
	const m_uvLink0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.75, 0.25, 1.0,
		0.25, 0.25, 1.0,
	]), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLState, 
		"POINTS",
		m_uvDataStream.getVertexCount(),
		{
			"a_uv" : m_uvDataStream,
			"a_uvLink0" : m_uvLink0DataStream
		}
	);
}

const debugTexturePosFactory = function(in_webGLState){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLState, 
		2, 
		2,
		new Float32Array([
			-0.75, 0.0, 1.0, 0.5, //0.25, 0.25
			0.75, 0.0, 1.0, 0.5, //0.75, 0.25
			0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0,
		])
	);
}

const sModelName = "model";
const sTexturePosName = "texturePos";

const registerAssets = function(in_resourceManager){
	if (false === in_resourceManager.hasFactory(sModelName)){
		//in_resourceManager.addFactory(sModelName, debugModelFactory);
		in_resourceManager.addFactory(sModelName, AssetCloth.factoryModel);
	}
	if (false === in_resourceManager.hasFactory(sTexturePosName)){
		//in_resourceManager.addFactory(sTexturePosName, debugTexturePosFactory);
		in_resourceManager.addFactory(sTexturePosName, AssetCloth.factoryTexture);
	}

	return;
}


module.exports = {
	"registerAssets" : registerAssets,
	"sModelName" : sModelName,
	"sTexturePosName" : sTexturePosName,
};
