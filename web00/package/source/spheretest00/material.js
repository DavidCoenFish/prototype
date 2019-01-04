const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_shader){
	return WebGL.MaterialWrapper.factoryDefault(in_shader);
}

module.exports = {
	"factory" : factory,
};