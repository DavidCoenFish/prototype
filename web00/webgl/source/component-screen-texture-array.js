// draw a quad on screen with a texture
const Core = require("core");
const ComponentScreenTextureQuad = require("./component-screen-texture-quad.js");

const factory = function(in_resourceManager, in_webGLState, in_textureArray, in_screenDivisionCountOrUndefined){
	const m_screenQuadArray = [];

	//private methods ==========================
	const setup = function(){
		const screenDivisionCount = (undefined !== in_screenDivisionCountOrUndefined) ? in_screenDivisionCountOrUndefined : 4;
		const step = 2.0 / screenDivisionCount;
		for (var index = 0; index < in_textureArray.length; ++index){
			var xIndex = Math.floor(index / screenDivisionCount);
			var yIndex = index - (xIndex * screenDivisionCount);
			var low = Core.Vector2.factoryFloat32(-1.0 + (xIndex * step), -1.0 + (yIndex * step));
			var high = Core.Vector2.factoryFloat32(-1.0 + ((xIndex + 1) * step), -1.0 + ((yIndex + 1) * step));
			m_screenQuadArray.push(ComponentScreenTextureQuad.factory(in_resourceManager, in_webGLState, low, high, in_textureArray[index]));
		}
	}

	setup();

	//public methods ==========================
	const that = Object.create({
		"setTexture" : function(in_index, in_texture){
			m_screenQuadArray[in_index].setTexture(in_texture);
		},
		"draw" : function(){
			for (var index = 0; index < m_screenQuadArray.length; ++index){
				m_screenQuadArray[index].draw();
			}
		},
		"destroy" : function(){
			for (var index = 0; index < m_screenQuadArray.length; ++index){
				m_screenQuadArray[index].release();
			}
			m_screenQuadArray.length = 0;
		}
	})

	return that;
}

module.exports = {
	"factory" : factory
}