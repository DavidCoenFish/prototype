const Core = require("core");

const factory = function(in_state){
	const m_clearColour = Core.Colour4.factoryFloat32(0.5, 0.5, 0.5, 1.0);

	const that = Object.create({
		"run" : function(){
			in_state.m_webGLState.clear(m_clearColour);
			return undefined;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
