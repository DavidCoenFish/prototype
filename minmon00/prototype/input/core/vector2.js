/*
Float32Array
 */
import VectorPrototype from "./vectorprototype.js";

export const factory = function(in_x, in_y, in_baseArrayClass){
	const data = new in_baseArrayClass([in_x, in_y]);
	const result = Object.create({
		"getX" : function(){
			return data[0];
		},
		"getY" : function(){
			return data[1];
		},
		"setX" : function(in_value){
			data[0] = in_value;
			return;
		},
		"setY" : function(in_value){
			data[1] = in_value;
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

export const factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	return factory(x, y, Float32Array);
}

export const factoryInt32 = function(in_xOrUndefined, in_yOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	return factory(x, y, Int32Array);
}

export const factorySubtract = function(in_lhs, in_rhs){
	return factory(in_lhs.getX() - in_rhs.getX(), in_lhs.getY() - in_rhs.getY(), in_lhs.getRawClass());
}

export const crossProduct = function(in_vector2){
	const x = in_vector2.getY();
	const y = -(in_vector2.getX());
	return factory(x, y, in_vector2.getRawClass());
}

export const cmpAlmost = function(in_lhs, in_rhs, in_epsilonOrUndefined){
	var dataLhs = in_lhs.getRaw();
	var dataRhs = in_rhs.getRaw();
	return ((true === CoreMathCmpAlmost(dataLhs[0], dataRhs[0], in_epsilonOrUndefined)) &&
		(true === CoreMathCmpAlmost(dataLhs[1], dataRhs[1], in_epsilonOrUndefined)));
}

