/*
Float32Array
 */
const CoreMath = require("./coremath.js")

const factory = function(in_red, in_green, in_blue, in_alpha, in_baseArrayClass){
	const data = new in_baseArrayClass([in_red, in_green, in_blue, in_alpha]);
	const that = Object.create({
		"getRed" : function(){
			return data[0];
		},
		"getGreen" : function(){
			return data[1];
		},
		"getBlue" : function(){
			return data[2];
		},
		"getAlpha" : function(){
			return data[3];
		},
		"setRed" : function(in_value){
			data[0] = in_value;
			return;
		},
		"setGreen" : function(in_value){
			data[1] = in_value;
			return;
		},
		"setBlue" : function(in_value){
			data[2] = in_value;
			return;
		},
		"setAlpha" : function(in_value){
			data[3] = in_value;
			return;
		},
		"getRaw" : function(){
			return data;
		},
		"getRawClass" : function(){
			return in_baseArrayClass;
		}
	});

	//Object.assign(that, VectorPrototype);
	
	return that;
}

const factoryFloat32 = function(in_redOrUndefined, in_greenOrUndefined, in_blueOrUndefined, in_alphaOrUndefined){
	const red = (undefined === in_redOrUndefined) ? 0.0 : in_redOrUndefined;
	const green = (undefined === in_greenOrUndefined) ? 0.0 : in_greenOrUndefined;
	const blue = (undefined === in_blueOrUndefined) ? 0.0 : in_blueOrUndefined;
	const alpha = (undefined === in_alphaOrUndefined) ? 0.0 : in_alphaOrUndefined;
	return factory(red, green, blue, alpha, Float32Array);
}

const clampUnsignedByte = function(in_value){
	return Math.min(255, Math.max(0, in_value));
}

const factoryUnsignedByte = function(in_redOrUndefined, in_greenOrUndefined, in_blueOrUndefined, in_alphaOrUndefined){
	const red = (undefined === in_redOrUndefined) ? 0.0 : clampUnsignedByte(in_redOrUndefined);
	const green = (undefined === in_greenOrUndefined) ? 0.0 : clampUnsignedByte(in_greenOrUndefined);
	const blue = (undefined === in_blueOrUndefined) ? 0.0 : clampUnsignedByte(in_blueOrUndefined);
	const alpha = (undefined === in_alphaOrUndefined) ? 0.0 : clampUnsignedByte(in_alphaOrUndefined);
	return factory(red, green, blue, alpha, Uint8Array);
}

const cmpAlmost = function(in_lhs, in_rhs, in_epsilonOrUndefined){
	var dataLhs = in_lhs.getRaw();
	var dataRhs = in_rhs.getRaw();
	return ((true === CoreMath.cmpAlmost(dataLhs[0], dataRhs[0], in_epsilonOrUndefined)) &&
		(true === CoreMath.cmpAlmost(dataLhs[1], dataRhs[1], in_epsilonOrUndefined)) &&
		(true === CoreMath.cmpAlmost(dataLhs[2], dataRhs[2], in_epsilonOrUndefined)) &&
		(true === CoreMath.cmpAlmost(dataLhs[3], dataRhs[3], in_epsilonOrUndefined)));
}

module.exports = {
	"factory" : factory,
	"factoryFloat32" : factoryFloat32,
	"factoryUnsignedByte" : factoryUnsignedByte,
	"cmpAlmost" : cmpAlmost,
	"sRed" : factoryFloat32(1.0, 0.0, 0.0, 1.0),
	"sGreen" : factoryFloat32(0.0, 1.0, 0.0, 1.0),
	"sBlue" : factoryFloat32(0.0, 0.0, 1.0, 1.0),
	"sBlack" : factoryFloat32(0.0, 0.0, 0.0, 1.0),
}
