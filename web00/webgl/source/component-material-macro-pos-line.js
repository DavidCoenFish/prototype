const ShaderWrapper = require("./shaderwrapper.js");
const MaterialWrapper = require("./materialwrapper.js");
const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js");

const sVertexShader = `
attribute vec3 a_position;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec3 u_cameraFovhFovvFar;
uniform vec3 u_modelOrigin;

void main() {
	vec3 cameraToAtom = a_position + u_modelOrigin - u_cameraPos;

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
}
`;

const sFragmentShader = `
precision mediump float;
uniform vec4 u_modelColour;
void main() {
	gl_FragColor = u_modelColour;
}
`;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = ["u_viewportWidthHeightWidthhalfHeighthalf", "u_cameraAt", "u_cameraUp", "u_cameraLeft", "u_cameraPos", "u_cameraFovhFovvFar", "u_modelColour", "u_modelOrigin"];

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

const sShaderName = "componentShaderMacroPosLine";
const sMaterialName = "componentMaterialMacroPosLine";

const factory = function(in_resourceManager, in_webGLContextWrapper, in_dataServer){

	if (false === in_resourceManager.hasFactory(sShaderName)){
		in_resourceManager.addFactory(sShaderName, shaderFactory);
	}

	if (false === in_resourceManager.hasFactory(sMaterialName)){
		in_resourceManager.addFactory(sMaterialName, materialFactory);
	}

	const m_mapValues = {
		"u_viewportWidthHeightWidthhalfHeighthalf" : function(localWebGLContextWrapper, in_position){
			var viewportWidthHeightWidthhalfHeighthalf = in_dataServer.getViewportWidthHeightWidthhalfHeighthalf();
			WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, viewportWidthHeightWidthhalfHeighthalf.getRaw());
		},
		"u_cameraAt" : function(localWebGLContextWrapper, in_position){
			var cameraAt = in_dataServer.getCameraAt();
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraAt.getRaw());
		},
		"u_cameraUp" : function(localWebGLContextWrapper, in_position){
			var cameraUp = in_dataServer.getCameraUp();
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraUp.getRaw());
		},
		"u_cameraLeft" : function(localWebGLContextWrapper, in_position){
			var cameraLeft = in_dataServer.getCameraLeft();
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraLeft.getRaw());
		},
		"u_cameraPos" : function(localWebGLContextWrapper, in_position){
			var cameraPos = in_dataServer.getCameraPos();
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraPos.getRaw());
		},
		"u_cameraFovhFovvFar" : function(localWebGLContextWrapper, in_position){
			var cameraFovhFovvFar = in_dataServer.getCameraFovhFovvFar();
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, cameraFovhFovvFar.getRaw());
		},
		"u_modelColour" : function(localWebGLContextWrapper, in_position){
			var modelColour = in_dataServer.getModelColour();
			WebGLContextWrapperHelper.setUniformFloat4(localWebGLContextWrapper, in_position, modelColour.getRaw());
		},
		"u_modelOrigin" : function(localWebGLContextWrapper, in_position){
			var modelOrigin = in_dataServer.getModelOrigin();
			WebGLContextWrapperHelper.setUniformFloat3(localWebGLContextWrapper, in_position, modelOrigin.getRaw());
		},
	};
	const m_uniformServer = {
		"setUniform" : function(localWebGLContextWrapper, in_key, in_position){
			if (in_key in m_mapValues){
				m_mapValues[in_key](localWebGLContextWrapper, in_position);
			}
		}
	}
	var m_shader = in_resourceManager.getCommonReference(sShaderName, in_webGLContextWrapper, m_uniformServer);
	var m_material = in_resourceManager.getCommonReference(sMaterialName, m_shader);

	//public methods ==========================
	const result = Object.create({
		"getMaterial" : function(){
			return m_material;
		},
		"destroy" : function(){
			m_shader = undefined;
			m_material = undefined;
			in_resourceManager.releaseCommonReference(sShaderName);
		}
	})

	return result;

}

module.exports = {
	"factory" : factory
}
