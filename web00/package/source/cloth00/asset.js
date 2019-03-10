const Core = require("core");
const WebGL = require("webgl");
const AssetCloth = require("./asset_cloth_model_texture_link12.js");

const debugModelFactory = function(in_webGLState){
	const m_uvDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array([
		0.25, 0.25,
		0.75, 0.25,
		0.25, 0.75,
		0.75, 0.75,
	]), "STATIC_DRAW", false);
	const m_uvLink0DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.75, 0.25, 1.0,
		0.25, 0.25, 1.0,
		0.75, 0.25, 1.0,
		0.25, 0.75, 1.0
	]), "STATIC_DRAW", false);
	const m_uvLink1DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.25, 0.75, 1.0,
		0.75, 0.75, 1.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink2DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink3DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink4DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink5DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink6DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink7DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink8DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink9DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink10DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_uvLink11DataStream = WebGL.ModelDataStream.factory("FLOAT", 3, new Float32Array([
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
		0.0, 0.0, 0.0,
	]), "STATIC_DRAW", false);
	const m_canMove = WebGL.ModelDataStream.factory("FLOAT", 1, new Float32Array([
		0.0,
		1.0,
		1.0,
		1.0,
	]), "STATIC_DRAW", false);


	return WebGL.ModelWrapper.factory(
		in_webGLState, 
		"POINTS",
		m_uvDataStream.getVertexCount(),
		{
			"a_uv" : m_uvDataStream,
			"a_link0" : m_uvLink0DataStream,
			"a_link1" : m_uvLink1DataStream,
			"a_link2" : m_uvLink2DataStream,
			"a_link3" : m_uvLink3DataStream,
			"a_link4" : m_uvLink4DataStream,
			"a_link5" : m_uvLink5DataStream,
			"a_link6" : m_uvLink6DataStream,
			"a_link7" : m_uvLink7DataStream,
			"a_link8" : m_uvLink8DataStream,
			"a_link9" : m_uvLink9DataStream,
			"a_link10" : m_uvLink10DataStream,
			"a_link11" : m_uvLink11DataStream,
			"a_canMove" : m_canMove
		}
	);
}

const debugTexturePosFactory = function(in_webGLState){
	return WebGL.TextureWrapper.factoryFloatRGBA(
		in_webGLState, 
		2, 
		2,
		new Float32Array([
			-1.5, 0.0, 2.0, 0.5, //0.25, 0.25
			-0.5, 0.0, 2.0, 0.5, //0.75, 0.25
			0.5, 0.0, 2.0, 0.5, //0.25, 0.75
			1.5, 0.0, 2.0, 0.5, //0.75, 0.75
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
