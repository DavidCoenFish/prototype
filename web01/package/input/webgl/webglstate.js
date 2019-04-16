/*
 */
import WebGLContextWrapper from './webglcontextwrapper.js';
import { cmpAlmost as Colour4CmpAlmost } from './../core/colour4.js';
import { cmpAlmost as Vector2CmpAlmost } from './../core/vector2';
import { cmpAlmost as Vector3CmpAlmost } from './../core/vector3';
import { cmpAlmost as Vector4CmpAlmost, factoryInt32 as Vector4FactoryInt32 } from './../core/vector4';

const sTextureStateName = [];
for (var index = 0; index < 128; ++index){
	sTextureStateName.push("TEXTURE" + index);
}

export default function(
	in_html5CanvasElement,
	in_alphaOrUndefined, 
	in_depthOrUndefined, 
	in_antialiasOrUndefined, 
	in_extentionsOrUndefined,
	in_preserveDrawingBufferOrUndefined
){
	var m_webGLContextWrapper = WebGLContextWrapper(
		in_html5CanvasElement, 
		in_alphaOrUndefined, 
		in_depthOrUndefined, 
		in_antialiasOrUndefined, 
		in_extentionsOrUndefined,
		in_preserveDrawingBufferOrUndefined
		);

	// keep a copy of what we think the webgl state is, if values don't change, we don't need to tell webgl to change
	var m_state = {};
	var m_lastShaderMapVertexAttribute = {};

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
			if (true === Colour4CmpAlmost(stateValue, in_value)){
				return true;
			}
		}
		m_state[in_valueName] = in_value;
		return false;
	}

	const stateValueCmpVector4 = function(in_valueName, in_value){
		if (in_valueName in m_state){
			var stateValue = m_state[in_valueName];
			if (true === Vector4CmpAlmost(stateValue, in_value)){
				return true;
			}
		}
		m_state[in_valueName] = in_value;
		return false;
	}

	const setTexture = function(in_index, in_textureOrUndefined){
		if (false === stateValueCmp(sTextureStateName[in_index], in_textureOrUndefined)){
			if (undefined !== in_textureOrUndefined){
				in_textureOrUndefined.apply(m_webGLContextWrapper, in_index);
			} else {
				console.assert(false, "setTexture undefined:" + in_index);
			}
		}
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
			const frontFaceEnum = m_webGLContextWrapper.getEnum(in_frontFaceEnumName);
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

		//if (false === stateValueCmp("depthFunc", in_depthFuncEnumName)){
			const depthFuncEnum = m_webGLContextWrapper.getEnum(in_depthFuncEnumName);
			m_webGLContextWrapper.callMethod("depthFunc", depthFuncEnum);
		//}
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

	const that = Object.create({
		"addResourceContextCallbacks" : function(in_restoredCallback, in_lostCallback){
			m_webGLContextWrapper.addResourceContextCallbacks(in_restoredCallback, in_lostCallback);
		},

		"removeResourceContextCallbacks" : function(in_restoredCallback, in_lostCallback){
			m_webGLContextWrapper.removeResourceContextCallbacks(in_restoredCallback, in_lostCallback);
		},

		"flush" : function(){
			m_webGLContextWrapper.callMethod("flush");
			return;
		},

		"clear" : function(in_colourOrUndefined, in_depthOrUndefined, in_stencilOrUndefined){
			var clearFlag = 0;

			if (undefined !== in_colourOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("COLOR_BUFFER_BIT");
				setColorMask(true, true, true, true);
				if (false === stateValueCmpColour4("clearColor", in_colourOrUndefined)){
					m_webGLContextWrapper.callMethod(
						"clearColor", 
						in_colourOrUndefined.getRed(),
						in_colourOrUndefined.getGreen(),
						in_colourOrUndefined.getBlue(),
						in_colourOrUndefined.getAlpha()
						);
				}
			}

			if (undefined !== in_depthOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("DEPTH_BUFFER_BIT");
				setDepthMask(true);
				if (false === stateValueCmp("clearDepth", in_depthOrUndefined)){
					m_webGLContextWrapper.callMethod("clearDepth", in_depthOrUndefined);
				}
			}

			if (undefined !== in_stencilOrUndefined){
				clearFlag |= m_webGLContextWrapper.getEnum("STENCIL_BUFFER_BIT");
				setStencilMask(true);
				if (false === stateValueCmp("clearStencil", in_stencilOrUndefined)){
					m_webGLContextWrapper.callMethod("clearStencil", in_stencilOrUndefined);
				}
			}

			if (0 !== clearFlag){
				m_webGLContextWrapper.callMethod("clear", clearFlag);
			}

			return;
		},

		"resetRenderTarget" : function(){
			const targetEnum = m_webGLContextWrapper.getEnum("FRAMEBUFFER");
			m_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, null);

			that.setViewport(0, 0, m_webGLContextWrapper.getCanvasWidth(), m_webGLContextWrapper.getCanvasHeight());

			return;
		},

		"applyRenderTarget" : function(in_renderTarget){
			if (undefined === in_renderTarget){
				that.resetRenderTarget()
				return;
			}
			const targetEnum = m_webGLContextWrapper.getEnum("FRAMEBUFFER");
			const frameBufferObject = in_renderTarget.getFrameBufferObject();
			m_webGLContextWrapper.callMethod("bindFramebuffer", targetEnum, frameBufferObject);
			const width = in_renderTarget.getWidth();
			const height = in_renderTarget.getHeight();
			that.setViewport(0, 0, width, height);
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
			m_lastShaderMapVertexAttribute = in_shader.getMapVertexAttribute();
	
			return;
		},

		"applyMaterial" : function(in_material){
			const textureArray = in_material.getTextureArray();
			for (var index = 0; index < textureArray.length; ++index){
				var texture = textureArray[index];
				setTexture(index, texture);
			}

			setFrontFace(in_material.getFrontFaceEnumName());
			setTriangleCull(in_material.getTriangleCullEnabled(), in_material.getTriangleCullEnumName());
			setBlendMode(in_material.getBlendModeEnabled(), in_material.getSourceBlendEnumName(), in_material.getDestinationBlendEnumName());
			setDepthFunc(in_material.getDepthFuncEnabled(), in_material.getDepthFuncEnumName());
			setColorMask(in_material.getColorMaskRed(), in_material.getColorMaskGreen(), in_material.getColorMaskBlue(), in_material.getColorMaskAlpha());
			setDepthMask(in_material.getDepthMask());
			setStencilMask(in_material.getStencilMask());

			return;
		},

		"drawModel" : function(in_model, in_firstOrUndefined, in_countOrUndefined){
			in_model.draw(m_webGLContextWrapper, m_lastShaderMapVertexAttribute, in_firstOrUndefined, in_countOrUndefined);
			return;
		},
		
		"setViewport" : function(in_x, in_y, in_width, in_height){
			var param = Vector4FactoryInt32(in_x, in_y, in_width, in_height);
			if (false === stateValueCmpVector4("viewport", param)){
				m_webGLContextWrapper.callMethod("viewport", in_x, in_y, in_width, in_height);
			}

			return;
		},

		"getViewport" : function(in_vec4OrUndefined){
			const viewportEnum = m_webGLContextWrapper.getEnum("VIEWPORT");
			const param = m_webGLContextWrapper.callMethod("getParameter", viewportEnum);
			var result;
			if (undefined !== param){
				if (undefined !== in_vec4OrUndefined){
					in_vec4OrUndefined.setX(param[0]);
					in_vec4OrUndefined.setY(param[1]);
					in_vec4OrUndefined.setZ(param[2]);
					in_vec4OrUndefined.setW(param[3]);
				}
				result = Vector4FactoryInt32(param[0], param[1], param[2], param[3], m_state["viewport"]);
				m_state["viewport"] = result;
			}
			return result;
		},

		"createBuffer" : function(){
			const bufferHandle = m_webGLContextWrapper.callMethod("createBuffer");
			return bufferHandle;
		},

		"updateBuffer" : function(in_bufferHandle, in_arrayData, in_bufferObjectTypeName, in_usageName){
			const bufferObjectType = m_webGLContextWrapper.getEnum(in_bufferObjectTypeName);
			m_webGLContextWrapper.callMethod("bindBuffer", bufferObjectType, in_bufferHandle);
			const usage = m_webGLContextWrapper.getEnum(in_usageName);
			m_webGLContextWrapper.callMethod("bufferData", bufferObjectType, in_arrayData, usage);
			return;
		},

		"deleteBuffer" : function(in_bufferHandle){
			m_webGLContextWrapper.callMethod("deleteBuffer", in_bufferHandle);
			return;
		},

		"getExtention" : function(in_extentionName){
			const result = m_webGLContextWrapper.callMethod("getExtension", in_extentionName);
			return result;
		},

		"getCanvasWidth" : function(){
			return m_webGLContextWrapper.getCanvasWidth();
		},

		"getCanvasHeight" : function(){
			return m_webGLContextWrapper.getCanvasHeight();
		},

		"destroy" : function(){
			m_webGLContextWrapper.removeResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);
		},

	});

	//private methods ==========================
	const aquireWebGLResources = function(){
		m_state = {};
		m_lastShaderMapVertexAttribute = {};
		return;
	}

	const releaseWebGLResources = function(){
		return;
	}

	m_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return that;
}

