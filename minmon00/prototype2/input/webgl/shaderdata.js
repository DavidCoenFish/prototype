//import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from "./shaderuniformtype.js"



export const ShaderDataUniformFactory = function(
	in_webGLContextWrapper,
	in_name,
	in_typeName
	){
	//public methods ==========================
	const that = Object.create({
		"getName" : function(){
			return in_name;
		},
		"apply" : function(in_uniformLocation, in_value){
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformLocation, in_value);
		}
	});

	return that;
}

export const ShaderDataUniformNormaliseFactory = function(
	in_webGLContextWrapper,
	in_name,
	in_typeName,
	in_normalise
	){

	//public methods ==========================
	const that = Object.create({
		"getName" : function(){
			return in_name;
		},
		"apply" : function(in_uniformLocation, in_value){
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformLocation, in_normalise, in_value);
		}
	});

	return that;
}
