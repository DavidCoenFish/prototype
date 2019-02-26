const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_state){
	const m_clearColour = Core.Colour4.factoryFloat32(1.0, 0.0, 0.0, 1.0);

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
