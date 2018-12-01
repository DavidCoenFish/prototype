/*
the data needed to construct a model data stream wrapper
 */
const factory = function(
	in_typeName, //string
	in_elementsPerVertex, //int
	in_arrayData,
	in_dynamicFlagName, //string //STATIC_DRAW, 
	in_normalise //bool
	){
	const m_typeName = in_typeName;
	const m_elementsPerVertex = in_elementsPerVertex;
	const in_arrayData = in_arrayData.slice();
	const m_dynamicFlagName = in_dynamicFlagName;
	const m_normalise = in_normalise;

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
	const aquireWebGLResources = function(in_webGLContextWrapper){
	 	return;
	}
	const releaseWebGLResources = function(in_webGLContextWrapper){
	 	return;
	}

	return result;
}


module.exports = {
	"factory" : factory
};
