// draw a quad on screen with a texture
const ModelWrapper = require("./modelwrapper.js");
const ModelDataStream = require("./modeldatastream.js");

const ComponentMaterialScreenPosUv = require("./component-material-screen-pos-uv.js");

const factory = function(in_resourceManager, in_webGLState, in_vec2Low, in_vec2High, in_textureOrUndefined){

	const m_textureArray = [in_textureOrUndefined];
	var m_materialComponent = ComponentMaterialScreenPosUv.factory(in_resourceManager, in_webGLState, m_textureArray);
	var m_material = m_materialComponent.getMaterial();
	var m_shader = m_materialComponent.getShader();

	const m_posDataStream = ModelDataStream.factory(
			"FLOAT",
			2,
			new Float32Array([
				in_vec2Low.getX(), in_vec2Low.getY(),//-1, -1,
				in_vec2Low.getX(), in_vec2High.getY(),//-1, 1,
				in_vec2High.getX(), in_vec2Low.getY(),//1, -1,
				in_vec2Low.getX(), in_vec2High.getY(),//-1, 1,
				in_vec2High.getX(), in_vec2Low.getY(),//1, -1,
				in_vec2High.getX(), in_vec2High.getY(),//1, 1
				]),
			"STATIC_DRAW",
			false
			);
	const m_uvDataStream = ModelDataStream.factory(
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

	const m_model = ModelWrapper.factory(
		in_webGLState, 
		"TRIANGLES", 
		6, 
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream
		}
	);
	const m_state = {
		"u_sampler0" : 0
	};

	//public methods ==========================
	const that = Object.create({
		"setTexture" : function(in_texture){
			m_textureArray[0] = in_texture;
		},
		"draw" : function(){
			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);
		},
		"destroy" : function(){
			release();
		}
	})

	return that;
}

module.exports = {
	"factory" : factory
}