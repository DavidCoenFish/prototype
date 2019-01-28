const factory = function(in_resourceManager, in_webGLContextWrapper, in_webGLState, in_dataServer){

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			//prev_pos => prev_prev_pos
			var prevPos = in_dataServer.getTexturePrevPos();
			in_dataServer.getTexturePrevPrevPos(prevPos);
			//new_pos => prev_pos
			var newPos = in_dataServer.getTextureNewPos();
			in_dataServer.getTexturePrevPos(newPos);
		},
	})

	return result;
}

module.exports = {
	"factory" : factory
}