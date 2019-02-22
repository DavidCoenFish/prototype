/*
 */
const Core = require("core");
const WebGlContextWrapper = require("./webglcontextwrapper.js");

const factory = function(
	in_html5CanvasElement,
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_extentionsOrUndefined
){
	var m_webGlContextWrapper = WebGlContextWrapper.factory(
		in_html5CanvasElement, 
		in_alphaOrUndefined, 
		in_depthOrUndefined, 
		in_antialiasOrUndefined, 
		in_extentionsOrUndefined
		);

	var m_state = {};

	//return true if there is a matching value in state
	const stateValueCmp = function(in_valueName, in_value){
		if ((in_valueName in m_state) && (in_value === m_state[in_valueName])){
			return true;
		}
		m_state[in_valueName] = in_value;
		return false;
	}
	const stateValueCmpColour4 = function(in_valueName, in_value){
		if (in_valueName in m_state){
			var stateValue = m_state[in_valueName];
			if (true === Core.Colour4.cmpAlmost(stateValue, in_value)){
				return true;
			}
		}
		m_state[in_valueName] = in_value;
		return false;
	}

	const setTextureOrUndefined = function(in_index, in_texture){

	}

	//FRONT, BACK, FRONT_AND_BACK
	const setTriangleCull = function(in_enabled, in_cullFaceEnumName){
		if (false === stateValueCmp("cullFaceEnabled", in_enabled)){
			const enableCullFaceEnum = m_webGLContextWrapper.getEnum("CULL_FACE");
			if (true === in_enabled){
				m_webGLContextWrapper.callMethod("enable", enableCullFaceEnum);
			} else {
				m_webGLContextWrapper.callMethod("disable", enableCullFaceEnum);
			}
		}
		if (true === in_enabled){
			if (false === stateValueCmp("cullFaceEnum", in_cullFaceEnumName)){
				const triangleCullEnum = m_webGLContextWrapper.getEnum(in_cullFaceEnumName);
				m_webGLContextWrapper.callMethod("cullFace", triangleCullEnum);
			}
		}
		return;
	}

	//CW, CCW
	const setFrontFace = function(in_frontFaceEnumName){
		if (false === stateValueCmp("frontFace", in_frontFaceEnumName)){
			const frontFaceEnum = m_webGLContextWrapper.getEnum(in_cullFaceEnumName);
			m_webGLContextWrapper.callMethod("frontFace", frontFaceEnum);
		}
		return;
	}

	const setEnumEnabled = function(in_enabled, in_enum){
		if (true === in_enabled){
			m_webGLContextWrapper.callMethod("enable", in_enum);
		} else {
			m_webGLContextWrapper.callMethod("disable", in_enum);
		}
	}

	//https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
	// ZERO ONE SRC_COLOR ONE_MINUS_SRC_COLOR DST_COLOR ONE_MINUS_DST_COLOR SRC_ALPHA ONE_MINUS_SRC_ALPHA DST_ALPHA ONE_MINUS_DST_ALPHA CONSTANT_COLOR ONE_MINUS_CONSTANT_COLOR CONSTANT_ALPHA ONE_MINUS_CONSTANT_ALPHA SRC_ALPHA_SATURATE
	const setBlendMode = function(in_enabled, in_sourceBlendEnumName, in_destinationBlendEnumName){
		if (false === stateValueCmp("blendModeEnabled", in_enabled)){
			const enableBlendEnum = m_webGLContextWrapper.getEnum("BLEND");
			setEnumEnabled(in_enabled, enableBlendEnum);
		}

		if ((false === stateValueCmp("blendFuncSource", in_sourceBlendEnumName)) ||
			(false === stateValueCmp("blendFuncDestination", in_destinationBlendEnumName))){
			const sourceBlendEnum = m_webGLContextWrapper.getEnum(in_sourceBlendEnumName);
			const destinationBlendEnum = m_webGLContextWrapper.getEnum(in_destinationBlendEnumName);
			m_webGLContextWrapper.callMethod("blendFunc", sourceBlendEnum, destinationBlendEnum);
		}
		return;
	}

	//NEVER LESS EQUAL LEQUAL GREATER NOTEQUAL GEQUAL ALWAYS 
	const setDepthFunc = function(in_enabled, in_depthFuncEnumName){
		if (false === stateValueCmp("depthFuncEnabled", in_enabled)){
			const enableDepthTestEnum = m_webGLContextWrapper.getEnum("DEPTH_TEST");
			setEnumEnabled(in_enabled, enableDepthTestEnum);
		}

		if (false === stateValueCmp("depthFunc", in_depthFuncEnumName)){
			const depthFuncEnum = m_webGLContextWrapper.getEnum(in_depthFuncEnumName);
			m_webGLContextWrapper.callMethod("depthFunc", depthFuncEnum);
		}
		return;
	}

	const setColorMask = function(in_red, in_green, in_blue, in_alpha){
		const falseColorMaskRed = stateValueCmp("colorMaskRed", in_red);
		const falseColorMaskGreen = stateValueCmp("colorMaskGreen", in_green);
		const falseColorMaskBlue = stateValueCmp("colorMaskBlue", in_blue);
		const falseColorMaskAlpha = stateValueCmp("colorMaskAlpha", in_alpha);

		if ((false === falseColorMaskRed) ||
			(false === falseColorMaskGreen) ||
			(false === falseColorMaskBlue) ||
			(false === falseColorMaskAlpha)){
			m_webGLContextWrapper.callMethod("colorMask", in_red, in_green, in_blue, in_alpha);
		}
	}

	const setDepthMask = function(in_depthMask){
		if (false === stateValueCmp("depthMask", in_depthMask)){
			m_webGLContextWrapper.callMethod("depthMask", in_depthMask);
		}
	}

	const setStencilMask = function(in_stencilMask){
		if (false === stateValueCmp("stencilMask", in_stencilMask)){
			m_webGLContextWrapper.callMethod("stencilMask", in_stencilMask);
		}
	}

	const result = Object.create({
		"addResourceContextCallbacks" : function(in_restoredCallback, in_lostCallback){
			m_webGlContextWrapper.addResourceContextCallbacks(in_restoredCallback, in_lostCallback);
		},

		"flush" : function(){
			m_webGlContextWrapper.callMethod("flush");
			return;
		},

		"clear" : function(in_colourOrUndefined, in_depthOrUndefined, in_stencilOrUndefined){
			var clearFlag = 0;

			if ((undefined !== in_colourOrUndefined) && 
				(false === stateValueCmpColour4("clearColor", in_colourOrUndefined))){
				clearFlag |= m_webGlContextWrapper.getEnum("COLOR_BUFFER_BIT");
				m_webGlContextWrapper.callMethod(
					"clearColor", 
					in_colourOrUndefined.getRed(),
					in_colourOrUndefined.getGreen(),
					in_colourOrUndefined.getBlue(),
					in_colourOrUndefined.getAlpha()
					);
			}

			if ((undefined !== in_depthOrUndefined) &&
				(false === stateValueCmp("clearDepth", in_depthOrUndefined))){
				clearFlag |= m_webGlContextWrapper.getEnum("DEPTH_BUFFER_BIT");
				m_webGlContextWrapper.callMethod("clearDepth", in_depthOrUndefined);
			}

			if ((undefined !== in_stencilOrUndefined) &&
				(false === stateValueCmp("clearStencil", in_stencilOrUndefined))){
				clearFlag |= m_webGlContextWrapper.getEnum("STENCIL_BUFFER_BIT");
				m_webGlContextWrapper.callMethod("clearStencil", in_stencilOrUndefined);
			}

			if (0 !== clearFlag){
				m_webGlContextWrapper.callMethod("clear", clearFlag);
			}

			return;
		},
		"applyShader" : function(in_shader, in_uniformServerOrUndefined){
			const shaderProgramObject = in_shader.getShaderProgramObject();
			if (undefined !== shaderProgramObject){
				m_webGLContextWrapper.callMethod("useProgram", shaderProgramObject);
			}

			const mapUniform = in_shader.getMapUniform();
			if (undefined !== in_uniformServerOrUndefined){
				for (var key in mapUniform){
					if (key in in_uniformServerOrUndefined){
						var value = in_uniformServerOrUndefined[key];
						mapUniform[key].apply(m_webGLContextWrapper, value);
					}
				}
			}
	
			return;
		},

		"applyMaterial" : function(in_material){
			const textureArray = in_material.getTextureArray();
			for (var index = 0; index < textureArray.length; ++index){
				var texture = textureArray[index];
				setTextureOrUndefined(index, texture);
			}

			setTriangleCull(in_material.getTriangleCullEnabled(), in_material.getTriangleCullEnumName());

			const frontFaceEnum = in_webGLContextWrapper.getEnum(m_frontFaceEnumName);
			setFrontFace(in_webGLContextWrapper, frontFaceEnum);

			const sourceBlendEnum = in_webGLContextWrapper.getEnum(m_sourceBlendEnumName);
			const destinationBlendEnum = in_webGLContextWrapper.getEnum(m_destinationBlendEnumName);
			setBlendMode(in_webGLContextWrapper, m_blendModeEnabled, sourceBlendEnum, destinationBlendEnum);

			const depthFuncEnum = in_webGLContextWrapper.getEnum(m_depthFuncEnumName);
			setDepthFunc(in_webGLContextWrapper, m_depthFuncEnabled, depthFuncEnum);

			setColorMask(in_webGLContextWrapper, m_colorMaskRed, m_colorMaskGreen, m_colorMaskBlue, m_colorMaskAlpha);
			setDepthMask(in_webGLContextWrapper, m_depthMask);
			setStencilMask(in_webGLContextWrapper, m_stencilMask);
			return;
		},

		"setTextureOrUndefined" : function(in_index, in_texture){
			if ((in_index in m_mapIndexTexture) && (in_texture === m_mapIndexTexture[in_index])){
				return;
			}
			m_mapIndexTexture[in_index] = in_texture;
			if (undefined !== in_texture){
				in_texture.apply(m_webGlContextWrapper, in_index);
			} else {
				m_webGlContextWrapper.callMethod("deactivateTexture", in_index);
			}
		},
		
		"setViewport" : function(in_x, in_y, in_width, in_height){
			const falseX = stateValueCmp("viewportX", in_x);
			const falseY = stateValueCmp("viewportY", in_y);
			const falseWidth = stateValueCmp("viewportWidth", in_width);
			const falseHeight = stateValueCmp("viewportHeight", in_height);
			if ((false === falseX) ||
				(false === falseY) ||
				(false === falseWidth) ||
				(false === falseHeight)){
				in_webGLContextWrapper.callMethod("viewport", in_x, in_y, in_width, in_height);
			}

			return;
		},

		"getViewport" : function(in_webGLContextWrapper){
			const param = in_webGLContextWrapper.callMethod("getParameter", viewportEnum);
			var result;
			if (undefined !== param){
				result = Core.Vector4.factoryInt32(param[0], param[1], param[2], param[3]);
				m_state["viewportX"] = param[0];
				m_state["viewportY"] = param[1];
				m_state["viewportWidth"] = param[2];
				m_state["viewportHeight"] = param[3];
			}
			return result;
		},

	});

	//private methods ==========================
	const aquireWebGLResources = function(){
		return;
	}

	const releaseWebGLResources = function(){
		m_state = {};
		return;
	}

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return result;
}

module.exports = {
	"factory" : factory
};
