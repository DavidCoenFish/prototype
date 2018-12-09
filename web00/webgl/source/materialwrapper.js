//const Core = require("core");

const factory = function(
		in_shaderWrapperOrUndefined, 
		in_triangleCullEnabledOrUndefined,
		in_triangleCullEnumNameOrUndefined,
		in_blendModeEnabledOrUndefined,
		in_sourceBlendEnumNameOrUndefined,
		in_destinationBlendEnumNameOrUndefined,
		in_depthFuncEnabledOrUndefined,
		in_depthFuncEnumNameOrUndefined,
		){
	var m_shaderWrapper = in_shaderWrapperOrUndefined;
	var m_triangleCullEnabled = (undefined === in_triangleCullEnabledOrUndefined) ? false : in_triangleCullEnabledOrUndefined;
	var m_triangleCullEnumName = in_triangleCullEnumNameOrUndefined;
	var m_frontFaceEnumName = "CW";
	var m_blendModeEnabled = (undefined === in_blendModeEnabledOrUndefined) ? false : in_blendModeEnabledOrUndefined;
	var m_sourceBlendEnumName = in_sourceBlendEnumNameOrUndefined;
	var m_destinationBlendEnumName = in_destinationBlendEnumNameOrUndefined;
	var m_depthFuncEnabled = (undefined === in_depthFuncEnabledOrUndefined) ? false : in_depthFuncEnabledOrUndefined;
	var m_depthFuncEnumName = in_depthFuncEnumNameOrUndefined;

	//public methods ==========================
	const result = Object.create({
		// "getShader" : function(){
		// 	return m_shaderWrapper;
		// },
		"apply" : function(in_webGLContextWrapper, in_webGLState){
			if (undefined !== m_shaderWrapper){
				m_shaderWrapper.apply(in_webGLContextWrapper);
			}
			in_webGLState.setMaterialOrUndefined(result);
			in_webGLState.setMapVertexAttributeOrUndefined((undefined !== m_shaderWrapper)? m_shaderWrapper.getMapVertexAttribute():undefined);

			const triangleCullEnum = in_webGLContextWrapper.getEnum(m_triangleCullEnumName);
			in_webGLState.setTriangleCull(in_webGLContextWrapper, m_triangleCullEnabled, triangleCullEnum);

			const frontFaceEnum = in_webGLContextWrapper.getEnum(m_frontFaceEnumName);
			in_webGLState.setFrontFace(in_webGLContextWrapper, frontFaceEnum);

			const sourceBlendEnum = in_webGLContextWrapper.getEnum(m_sourceBlendEnumName);
			const destinationBlendEnum = in_webGLContextWrapper.getEnum(m_destinationBlendEnumName);
			in_webGLState.setBlendMode(in_webGLContextWrapper, m_blendModeEnabled, sourceBlendEnum, destinationBlendEnum);

			const depthFuncEnum = in_webGLContextWrapper.getEnum(m_depthFuncEnumName);
			in_webGLState.setDepthFunc(in_webGLContextWrapper, m_depthFuncEnabled, depthFuncEnum);

		}
	});

	return result;
}

const factoryDefault = function(in_shaderWrapperOrUndefined){
	return factory(
		in_shaderWrapperOrUndefined,
		true,
		"BACK",
		true,
		"ZERO",
		"ONE",
		false,
		undefined,
		);
}


module.exports = {
	"factory" : factory,
	"factoryDefault" : factoryDefault
};
