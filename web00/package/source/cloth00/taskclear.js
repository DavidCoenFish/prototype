const Core = require("core");

const factory = function(in_resourceManager, in_webGLState, in_state){
	const m_clearColour = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 1.0);

	const that = Object.create({
		"run" : function(in_input){
			in_webGLState.resetRenderTarget();

			in_webGLState.clear(m_clearColour);
			return in_input;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
