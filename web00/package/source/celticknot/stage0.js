const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_webGLContextWrapper, in_resourceManager, in_width, in_height, in_tileWidth, in_tileHeight){
	const m_shader = in_resourceManager.getCommonReference("shader0", in_webGLContextWrapper);
	const m_texture = in_resourceManager.getCommonReference("celticKnotTile", in_webGLContextWrapper, in_tileWidth, in_tileHeight, 4);
	const m_material = WebGL.MaterialWrapper.factoryDefault(m_shader, [m_texture]);
	const m_model = in_resourceManager.getCommonReference("modelCelticKnot", in_webGLContextWrapper, in_width, in_height, in_tileWidth, in_tileHeight);
	const m_clearColor = Core.Colour4.factoryFloat32(0.25, 0.25, 0.25, 1.0);

	const result = Object.create({
		"draw" : function(localWebGLContextWrapper, localWebGLState){
			WebGL.WebGLContextWrapperHelper.clear(localWebGLContextWrapper, m_clearColor);
			m_material.apply(localWebGLContextWrapper, localWebGLState);
			m_model.draw(localWebGLContextWrapper, localWebGLState.getMapVertexAttribute());

			WebGL.WebGLContextWrapperHelper.resetRenderTarget(localWebGLContextWrapper);
		},
		"getTexture" : function(){
			return m_renderTexture;
		}
	});

	return result;
}


module.exports = {
	"factory" : factory,
};
