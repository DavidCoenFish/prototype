const ShaderWrapper = require("./shaderwrapper.js");
const MaterialWrapper = require("./materialwrapper.js");
const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js");

const sVertexShader = `
attribute vec3 a_position;
attribute vec4 a_colour;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec3 u_cameraFovhFovvFar;

varying vec4 v_colour;

void main() {
	vec3 cameraToAtom = a_position - u_cameraPos;

	float cameraSpaceX = -dot(cameraToAtom, u_cameraLeft);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = degrees(acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0)));

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float fovHHalf = u_cameraFovhFovvFar.x * 0.5;
	float width = u_viewportWidthHeightWidthhalfHeighthalf.x;
	float height = u_viewportWidthHeightWidthhalfHeighthalf.y;
	float widthHalf = u_viewportWidthHeightWidthhalfHeighthalf.z;
	float heightHalf = u_viewportWidthHeightWidthhalfHeighthalf.w;
	float screenR = polarR / fovHHalf; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = cameraSpaceLength / u_cameraFovhFovvFar.z;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	v_colour = a_colour;
}
`;

const sFragmentShader = `
precision mediump float;
varying vec4 v_colour;
void main() {
	gl_FragColor = v_colour;
}
`;

const sVertexAttributeNameArray = ["a_position", "a_colour"];
const sUniformNameArray = ["u_viewportWidthHeightWidthhalfHeighthalf", "u_cameraAt", "u_cameraUp", "u_cameraLeft", "u_cameraPos", "u_cameraFovhFovvFar"];

const shaderFactory = function(in_webGLContextWrapper, in_uniformServer){
	return ShaderWrapper.factory(
		in_webGLContextWrapper, 
		sVertexShader, 
		sFragmentShader, 
		in_uniformServer, 
		sVertexAttributeNameArray, 
		sUniformNameArray);

}

const materialFactory = function(in_shader){
	const material = MaterialWrapper.factory(
		in_shader,
		undefined, //in_textureArrayOrUndefined,
		undefined, //in_triangleCullEnabledOrUndefined,
		undefined, //in_triangleCullEnumNameOrUndefined,
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //"ONE",  //in_destinationBlendEnumNameOrUndefined,
		true, //in_depthFuncEnabledOrUndefined,
		"LESS", //in_depthFuncEnumNameOrUndefined
	);
	material.setDepthMask(false);
	material.setColorMask(true, true, true, true);
	return material;
}

const factory = function(in_resourceManager, in_webGLContextWrapper, in_dataServer){
	if (false === in_resourceManager.hasFactory("componentShaderMacroAlphaEdge")){
		in_resourceManager.addFactory("componentShaderMacroAlphaEdge", shaderFactory);
	}

	if (false === in_resourceManager.hasFactory("componentMaterialMacroAlphaEdge")){
		in_resourceManager.addFactory("componentMaterialMacroAlphaEdge", materialFactory);
	}

	const m_mapValues = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : function(localWebGLContextWrapper, in_position){
			var viewportWidthHeightWidthhalfHeighthalf = in_dataServer.getValue("viewportWidthHeightWidthhalfHeighthalf");
			WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, viewportWidthHeightWidthhalfHeighthalf.getRaw());
		},
		"u_cameraAt" : function(localWebGLContextWrapper, in_position){
			var cameraAt = in_dataServer.getValue("cameraAt");
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraAt.getRaw());
		},
		"u_cameraUp" : function(localWebGLContextWrapper, in_position){
			var cameraUp = in_dataServer.getValue("cameraUp");
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraUp.getRaw());
		},
		"u_cameraLeft" : function(localWebGLContextWrapper, in_position){
			var cameraLeft = in_dataServer.getValue("cameraLeft");
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraLeft.getRaw());
		},
		"u_cameraPos" : function(localWebGLContextWrapper, in_position){
			var cameraPos = in_dataServer.getValue("cameraPos");
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraPos.getRaw());
		},
		"u_cameraFovhFovvFar" : function(localWebGLContextWrapper, in_position){
			var cameraFovhFovvFar = in_dataServer.getValue("cameraFovhFovvFar");
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraFovhFovvFar.getRaw());
		}
	};
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key in m_mapValues){
				m_mapValues[in_key](localWebGLContextWrapper, in_position);
			}
		}
	}
	const m_shader = in_resourceManager.getCommonReference("componentShaderMacroAlphaEdge", in_webGLContextWrapper, m_uniformServer);
	const m_material = in_resourceManager.getCommonReference("componentMaterialMacroAlphaEdge", m_shader);

	//public methods ==========================
	const result = Object.create({
		"getMaterial" : function(){
			return m_material;
		},
	})

	return result;

}

module.exports = {
	"factory" : factory
}
