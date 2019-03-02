const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_resourceManager, in_webGLState, in_state){
	const m_screenTexture0 = WebGL.ComponentScreenTextureQuad.factory(in_resourceManager, in_webGLState, Core.Vector2.factoryFloat32(-1.0, -1.0), Core.Vector2.factoryFloat32(0.0, 0.0), in_state.m_textureForceA);
	const m_screenTexture1 = WebGL.ComponentScreenTextureQuad.factory(in_resourceManager, in_webGLState, Core.Vector2.factoryFloat32(-1.0, 0.0), Core.Vector2.factoryFloat32(0.0, 1.0), in_state.m_textureForceB);
	
	const that = Object.create({
		"run" : function(){
			m_screenTexture0.setTexture(in_state.m_textureForceA);
			m_screenTexture0.setTexture(in_state.m_textureForceB);

			m_screenTexture0.draw();
			m_screenTexture1.draw();
			return;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
