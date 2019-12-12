//import {sFloat, sFloat2, sFloat3, sFloat4, sInt, sMat4} from "./shaderuniformtype.js"

export const shaderUniformDataFactory = function(
	in_factory, //shaderUniform or shaderUniformNormaliseFalse for sMat4
	in_typeName,
	in_dagNode
	)
{
	return function(in_webGLContextWrapper, in_uniformLocation){
		return in_factory(
			in_webGLContextWrapper, 
			in_uniformLocation, 
			in_typeName,
			in_dagNode
			);
	}
}

export const shaderUniform = function(
	in_webGLContextWrapper,
	in_uniformLocation,
	in_typeName,
	in_dagNode
	){

	var m_uniformLocation = undefined;
	//public methods ==========================
	const that = Object.create({
		"apply" : function(){
			const value = in_dagNode.getValue();
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformLocation, value);
		}
	});

	return that;
}

export const shaderUniformNormaliseFalse = function(
	in_webGLContextWrapper,
	in_uniformLocation,
	in_typeName,
	in_dagNode
	){

	var m_uniformLocation = undefined;
	//public methods ==========================
	const that = Object.create({
		"apply" : function(){
			const value = in_dagNode.getValue();
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformLocation, false, value);
		}
	});

	return that;
}
