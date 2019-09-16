/*
Float32Array
 */
import VectorPrototype from "./vectorprototype.js";

export const factory = function(in_x, in_y, in_z, in_baseArrayClass){
	const data = new in_baseArrayClass([in_x, in_y, in_z]);
	const result = Object.create({
		"getX" : function(){
			return data[0];
		},
		"getY" : function(){
			return data[1];
		},
		"getZ" : function(){
			return data[2];
		},
		"set" : function(in_x, in_y, in_z){
			data[0] = in_x;
			data[1] = in_y;
			data[2] = in_z;
			return;
		},
		"setX" : function(in_value){
			data[0] = in_value;
			return;
		},
		"setY" : function(in_value){
			data[1] = in_value;
			return;
		},
		"setZ" : function(in_value){
			data[2] = in_value;
			return;
		},
		"getRaw" : function(){
			return data;
		},
		"getRawClass" : function(){
			return in_baseArrayClass;
		}
	});

	Object.assign(result, VectorPrototype);
	
	return result;
}

export const factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined, in_zOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	const z = (undefined === in_zOrUndefined) ? 0.0 : in_zOrUndefined;
	return factory(x, y, z, Float32Array);
}

export const crossProduct = function(in_vecA, in_vecB){
	const dataA = in_vecA.getRaw();
	const dataB = in_vecB.getRaw();
	return factory(
		(dataA[1] * dataB[2]) - (dataA[2] * dataB[1]),
		(dataA[2] * dataB[0]) - (dataA[0] * dataB[2]),
		(dataA[0] * dataB[1]) - (dataA[1] * dataB[0]),
		in_vecA.getRawClass()
	);
}

export const multiplyScalar = function(in_vec, in_scalar){
	const data = in_vec.getRaw();
	return factory(
		data[0] * in_scalar,
		data[1] * in_scalar,
		data[2] * in_scalar,
		in_vec.getRawClass()
	);
}

export const addition = function(in_vecA, in_vecB){
	const dataA = in_vecA.getRaw();
	const dataB = in_vecB.getRaw();
	return factory(
		(dataA[0] + dataB[0]),
		(dataA[1] + dataB[1]),
		(dataA[2] + dataB[2]),
		in_vecA.getRawClass()
	);
}

export const cmpAlmost = function(in_lhs, in_rhs, in_epsilonOrUndefined){
	var dataLhs = in_lhs.getRaw();
	var dataRhs = in_rhs.getRaw();
	return ((true === CoreMathCmpAlmost(dataLhs[0], dataRhs[0], in_epsilonOrUndefined)) &&
		(true === CoreMathCmpAlmost(dataLhs[1], dataRhs[1], in_epsilonOrUndefined)) &&
		(true === CoreMathCmpAlmost(dataLhs[2], dataRhs[2], in_epsilonOrUndefined)));
}

