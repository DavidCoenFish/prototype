// draw an array of quads on screen with textures
import ComponentScreenTextureQuadFactory from './component-screen-texture-quad.js';
import { factoryFloat32 as Vector2Float32Factory} from './../core/vector2.js';

export default function(in_resourceManager, in_webGLState, in_textureArray, in_screenDivisionCountOrUndefined){
	const m_screenQuadArray = [];

	//private methods ==========================
	const setup = function(){
		const screenDivisionCount = (undefined !== in_screenDivisionCountOrUndefined) ? in_screenDivisionCountOrUndefined : 4;
		const step = 2.0 / screenDivisionCount;
		for (var index = 0; index < in_textureArray.length; ++index){
			var xIndex = Math.floor(index / screenDivisionCount);
			var yIndex = index - (xIndex * screenDivisionCount);
			var low = Vector2Float32Factory(-1.0 + (xIndex * step), -1.0 + (yIndex * step));
			var high = Vector2Float32Factory(-1.0 + ((xIndex + 1) * step), -1.0 + ((yIndex + 1) * step));
			m_screenQuadArray.push(ComponentScreenTextureQuadFactory(in_resourceManager, in_webGLState, low, high, in_textureArray[index]));
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
				m_screenQuadArray[index].destroy();
			}
			m_screenQuadArray.length = 0;
		}
	})

	return that;
}
