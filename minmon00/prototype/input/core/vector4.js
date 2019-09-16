/*
Float32Array
 */
import {cmpAlmost as CoreMathCmpAlmost} from "./coremath.js"
import VectorPrototype from "./vectorprototype.js";

export const factory = function(in_x, in_y, in_z, in_w, in_baseArrayClass){
	const data = new in_baseArrayClass([in_x, in_y, in_z, in_w]);
	const that = Object.create({
		"getX" : function(){
			return data[0];
		},
		"getY" : function(){
			return data[1];
		},
		"getZ" : function(){
			return data[2];
		},
		"getW" : function(){
			return data[3];
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
		"setW" : function(in_value){
			data[3] = in_value;
			return;
		},
		"set" : function(in_vector4){
			data[0] = in_vector4.getX();
			data[1] = in_vector4.getY();
			data[2] = in_vector4.getZ();
			data[3] = in_vector4.getW();
			return;
		},
		"getRaw" : function(){
			return data;
		},
		"getRawClass" : function(){
			return in_baseArrayClass;
		}
	});

	Object.assign(that, VectorPrototype);
	
	return that;
}

export const factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined, in_zOrUndefined, in_wOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	const z = (undefined === in_zOrUndefined) ? 0.0 : in_zOrUndefined;
	const w = (undefined === in_wOrUndefined) ? 0.0 : in_wOrUndefined;
	return factory(x, y, z, w, Float32Array);
}

export const factoryInt32 = function(in_xOrUndefined, in_yOrUndefined, in_zOrUndefined, in_wOrUndefined, in_vector4OrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	const z = (undefined === in_zOrUndefined) ? 0.0 : in_zOrUndefined;
	const w = (undefined === in_wOrUndefined) ? 0.0 : in_wOrUndefined;
	if (undefined !== in_vector4OrUndefined){
		in_vector4OrUndefined.setX(x);
		in_vector4OrUndefined.setY(y);
		in_vector4OrUndefined.setZ(z);
		in_vector4OrUndefined.setW(w);
		return in_vector4OrUndefined;
	}
	return factory(x, y, z, w, Int32Array);
}

export const cmpAlmost = function(in_lhs, in_rhs, in_epsilonOrUndefined){
	var dataLhs = in_lhs.getRaw();
	var dataRhs = in_rhs.getRaw();
	return ((true === CoreMathCmpAlmost(dataLhs[0], dataRhs[0], in_epsilonOrUndefined)) &&
		(true === CoreMathCmpAlmost(dataLhs[1], dataRhs[1], in_epsilonOrUndefined)) &&
		(true === CoreMathCmpAlmost(dataLhs[2], dataRhs[2], in_epsilonOrUndefined)) &&
		(true === CoreMathCmpAlmost(dataLhs[3], dataRhs[3], in_epsilonOrUndefined)));
}

