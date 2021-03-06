const Core = require("core");
const WebGL = require("webgl");

const factory = function(in_shader){
	//return WebGL.MaterialWrapper.factoryDefault(in_shader);
	const material = WebGL.MaterialWrapper.factory(
		in_shader,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		"LESS"
	);
	material.setDepthMask(true);
	return material;
}

module.exports = {
	"factory" : factory,
};