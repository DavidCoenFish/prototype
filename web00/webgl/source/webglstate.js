/*
 */
const Core = require("core");
const CoreTypes = require("coretypes");

const factory = function(in_webGLContextWrapper){
	var m_materialOrUndefined;
	var m_mapVertexAttributeOrUndefined;
	var m_cullFaceEnabled;
	var m_cullFaceEnum;
	var m_frontFaceEnum;
	var m_blendModeEnabled;
	var m_sourceBlendEnum;
	var m_destinationBlendEnum;
	var m_depthFlagEnabled;
	var m_depthFuncEnum;
	var m_mapIndexTexture;

	var m_viewportX;
	var m_viewportY; 
	var m_viewportWidth;
	var m_viewportHeight;

	const result = Object.create({
		// material is just a reference to the last "applied" material, if context is restored, we all apply on is again....
		"setMaterialOrUndefined" : function(in_materialOrUndefined){
			m_materialOrUndefined = in_materialOrUndefined;
			return;
		},
		"setMapVertexAttributeOrUndefined" : function(in_mapVertexAttributeOrUndefined){
			m_mapVertexAttributeOrUndefined = in_mapVertexAttributeOrUndefined;
		},
		"getMapVertexAttribute" : function(){
			return m_mapVertexAttributeOrUndefined;
		},

		"setTextureOrUndefined" : function(in_webGLContextWrapper, in_index, in_texture){
			if ((in_index in m_mapIndexTexture) && (in_texture === m_mapIndexTexture[in_index])){
				return;
			}
			m_mapIndexTexture[in_index] = in_texture;
			if (undefined !== in_texture){
				in_texture.apply(in_webGLContextWrapper, in_index);
			} else {
				in_webGLContextWrapper.callMethod("deactivateTexture", in_index);
			}
		},
		
		//FRONT, BACK, FRONT_AND_BACK
		"setTriangleCull" : function(in_webGLContextWrapper, in_enabled, in_cullFaceEnum){
			if (m_cullFaceEnabled !== in_enabled){
				const enableCullFaceEnum = in_webGLContextWrapper.getEnum("CULL_FACE");
				if (true === in_enabled){
					in_webGLContextWrapper.callMethod("enable", enableCullFaceEnum);
				} else {
					in_webGLContextWrapper.callMethod("disable", enableCullFaceEnum);
				}
				m_cullFaceEnabled = in_enabled;
			}
			if (true === m_cullFaceEnabled){
				if (m_cullFaceEnum !== in_cullFaceEnum){
					in_webGLContextWrapper.callMethod("cullFace", in_cullFaceEnum);
					m_cullFaceEnum = in_cullFaceEnum;
				}
			}
			return;
		},
		//CW, CCW
		"setFrontFace" : function(in_webGLContextWrapper, in_frontFaceEnum){
			if (m_frontFaceEnum !== in_frontFaceEnum){
				in_webGLContextWrapper.callMethod("frontFace", in_frontFaceEnum);
				m_frontFaceEnum = in_frontFaceEnum;
			}
			return;
		},
		//https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
		// ZERO ONE SRC_COLOR ONE_MINUS_SRC_COLOR DST_COLOR ONE_MINUS_DST_COLOR SRC_ALPHA ONE_MINUS_SRC_ALPHA DST_ALPHA ONE_MINUS_DST_ALPHA CONSTANT_COLOR ONE_MINUS_CONSTANT_COLOR CONSTANT_ALPHA ONE_MINUS_CONSTANT_ALPHA SRC_ALPHA_SATURATE
		"setBlendMode" : function(in_webGLContextWrapper, in_enabled, in_sourceBlendEnum, in_destinationBlendEnum){
			if (m_blendModeEnabled !== in_enabled){
				const enableBlendEnum = in_webGLContextWrapper.getEnum("BLEND");
				if (true === in_enabled){
					in_webGLContextWrapper.callMethod("enable", enableBlendEnum);
				} else {
					in_webGLContextWrapper.callMethod("disable", enableBlendEnum);
				}
				m_blendModeEnabled = in_enabled;
			}

			if (true === m_blendModeEnabled){
				if ((m_sourceBlendEnum !== in_sourceBlendEnum) || 
					(m_destinationBlendEnum !== in_destinationBlendEnum)){

					in_webGLContextWrapper.callMethod("blendFunc", m_sourceBlendEnum, m_destinationBlendEnum);

					m_sourceBlendEnum = in_sourceBlendEnum;
					m_destinationBlendEnum = in_destinationBlendEnum;
				}
			}
			return;
		},
		//NEVER LESS EQUAL LEQUAL GREATER NOTEQUAL GEQUAL ALWAYS 
		"setDepthFunc" : function(in_webGLContextWrapper, in_enabled, in_depthFuncEnum){
			if (m_depthFlagEnabled !== in_enabled){
				const enableDepthTestEnum = in_webGLContextWrapper.getEnum("DEPTH_TEST");
				if (true === in_enabled){
					in_webGLContextWrapper.callMethod("enable", enableDepthTestEnum);
				} else {
					in_webGLContextWrapper.callMethod("disable", enableDepthTestEnum);
				}
				m_depthFlagEnabled = in_enabled;
			}
			if (true === m_depthFlagEnabled){
				if (m_depthFuncEnum !== in_depthFuncEnum){
					in_webGLContextWrapper.callMethod("depthFunc", in_depthFuncEnum);
					m_depthFuncEnum = in_depthFuncEnum;
				}
			}
			return;
		},

		"setViewport" : function(in_webGLContextWrapper, in_x, in_y, in_width, in_height){
			if ((m_viewportX !== in_x) ||
				(m_viewportY !== in_y) ||
				(m_viewportWidth !== in_width) ||
				(m_viewportHeight !== in_height)) {
				in_webGLContextWrapper.callMethod("viewport", in_x, in_y, in_width, in_height);
				m_viewportX = in_x;
				m_viewportY = in_y;
				m_viewportWidth = in_width;
				m_viewportHeight = in_height;
			}

			return;
		},

		"getViewport" : function(in_webGLContextWrapper){
			const param = in_webGLContextWrapper.callMethod("getParameter", viewportEnum);
			var result;
			if (undefined === param){
				result = CoreTypes.Vector4.factoryInt32(param[0], param[1], param[2], param[3]);
				m_viewportX = param[0];
				m_viewportY = param[1];
				m_viewportWidth = param[2];
				m_viewportHeight = param[3];
			}
			return result;
		},

	});

	//private methods ==========================
	const aquireWebGLResources = function(in_webGLContextWrapper){
		m_mapIndexTexture = {};
		if (undefined !== m_materialOrUndefined){
			m_materialOrUndefined.apply(in_webGLContextWrapper, this);
		}
		return;
	}

	const releaseWebGLResources = function(in_webGLContextWrapper){
		m_mapVertexAttributeOrUndefined = undefined;
		m_mapIndexTexture = undefined;
		m_cullFaceEnabled = undefined;
		m_cullFaceEnum = undefined;
		m_frontFaceEnum = undefined;
		m_blendModeEnabled = undefined;
		m_sourceBlendEnum = undefined;
		m_destinationBlendEnum = undefined;
		m_depthFlagEnabled = undefined;
		m_depthFuncEnum = undefined;
		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return result;
}

module.exports = {
	"factory" : factory
};
