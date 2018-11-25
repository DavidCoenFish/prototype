/*
wrap the webgl handle, and everything required to recreate it
 */
const Core = require("core");

const factory = function(in_shaderWrapperOrUndefined, in_uniformServerOrUndefined){
	var m_uniformServerOrUndefined = in_uniformServerOrUndefined;
	var m_shaderWrapper = in_shaderWrapperOrUndefined;

	//public methods ==========================
	const result = Object.create({
		"apply" : function(){
			if (undefined !== m_shaderProgramObject){
				in_webGLContextApplyMethod("useProgram", m_shaderProgramObject);
			}
			return;
		},
		"destroy" : function(){
			releaseWebGLResources();
			in_webGLContextWrapper.removeEventListener(in_webGLContextWrapper.sTokenWebglContextLost, aquireWebGLResources);
			in_webGLContextWrapper.removeEventListener(in_webGLContextWrapper.sTokenWebglContextRestored, releaseWebGLResources);
		},
	});

	//private methods ==========================
	// const aquireWebGLResources = function(){
	// 	return;
	// }

	return result;
}


module.exports = {
	"factory" : factory
};
