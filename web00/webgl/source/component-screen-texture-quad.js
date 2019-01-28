// draw a quad on screen with a texture
const ModelWrapper = require("./modelwrapper.js");
const ModelDataStream = require("./modeldatastream.js");

const ComponentMaterialScreenPosUvTriangle = require("./component-material-screen-pos-uv-triangle.js");

const factory = function(in_resourceManager, in_webGLContextWrapper, in_texture, in_vec2Low, in_vec2High){

	var m_materialComponent = ComponentMaterialScreenPosUvTriangle.factory(in_resourceManager, in_webGLContextWrapper, in_texture);
	var m_material = m_materialComponent.getMaterial();

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

	var m_model = ModelWrapper.factory(
		in_webGLContextWrapper, 
		"TRIANGLES", 
		6, 
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream
		}
	);

	//public methods ==========================
	const result = Object.create({
		"setTexture" : function(in_texture){
			m_material.setTextureArray([in_texture]);
		},
		"draw" : function(in_innerWebGLContextWrapper, in_innerWebGLState){
			m_material.apply(in_innerWebGLContextWrapper, in_innerWebGLState);
			m_model.draw(in_innerWebGLContextWrapper, in_innerWebGLState.getMapVertexAttribute());
		},
		"destroy" : function(){
			m_materialComponent.destroy();
			m_model.destroy();
		}
	})

	return result;
}

module.exports = {
	"factory" : factory
}