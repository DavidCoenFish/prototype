const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_resourceManager, in_webGLState, in_state){
	const m_componentWorldGrid = WebGL.ComponentWorldGrid.factory(in_resourceManager, in_webGLState, in_state, 1.0, 10);
	
	const that = Object.create({
		"run" : function(in_input){
			m_componentWorldGrid.draw();
			return in_input;
		}
	});

	return that;
}


module.exports = {
	"factory" : factory,
};
