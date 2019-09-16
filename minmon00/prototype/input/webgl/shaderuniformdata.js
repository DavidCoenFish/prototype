
/*
 */
export const sFloat = "uniform1f";
export const sFloat2 = "uniform2fv";
export const sFloat3 = "uniform3fv";
export const sFloat4 = "uniform4fv";
export const sInt = "uniform1i";
//const sFloat16 = "uniformMatrix4fv"; todo: matrix has a different func sig (transpose flag)
export const sMat4 = "uniformMatrix4fv";

export const factory = function(
	in_typeName,
	in_uniformHandle
	){
	//public methods ==========================
	const result = Object.create({
		"apply" : function(in_webGLContextWrapper, in_value){
			if ( sMat4 === in_typeName ){
				in_webGLContextWrapper.callMethod(in_typeName, in_uniformHandle, false, in_value);
			} else {
				in_webGLContextWrapper.callMethod(in_typeName, in_uniformHandle, in_value);
			}
		}
	});

	return result;
}

