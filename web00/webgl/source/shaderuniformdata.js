
/*
 */
const sFloat = "uniform1f";
const sFloat2Array = "uniform2fv";
const sFloat3Array = "uniform3fv";
const sFloat4Array = "uniform4fv";
const sFloat16Array = "uniformMatrix4fv";
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
	"sFloat2Array" : sFloat2Array,
	"sFloat3Array" : sFloat3Array,
	"sFloat4Array" : sFloat4Array,
	"sFloat16Array" : sFloat16Array,
	"sInt" : sInt, 
};
