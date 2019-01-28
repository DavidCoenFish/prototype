const factory = function(in_resourceManager, in_webGLContextWrapper, in_webGLState, in_dataServer){

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			in_dataServer.cycleTextures();
		},
	})

	return result;
}

module.exports = {
	"factory" : factory
}