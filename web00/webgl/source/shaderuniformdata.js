
/*
 */
const sFloat = "uniform1f";
const sFloat2 = "uniform2fv";
const sFloat3 = "uniform3fv";
const sFloat4 = "uniform4fv";
//const sFloat16 = "uniformMatrix4fv"; todo: matrix has a different func sig (transpose flag)
const sInt = "uniform1i";

const factory = function(
	in_typeName,
	in_uniformHandle
	){
	//public methods ==========================
	const result = Object.create({
		"apply" : function(in_webGLContextWrapper, in_value){
			in_webGLContextWrapper.callMethod(in_typeName, in_uniformHandle, in_value);
		}
	});

	return result;
}

module.exports = {
	"factory" : factory,

	"sFloat" : sFloat,
	"sFloat2" : sFloat2,
	"sFloat3" : sFloat3,
	"sFloat4" : sFloat4,
	//"sFloat16" : sFloat16,
	"sInt" : sInt, 
};
