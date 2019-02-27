/*
Float32Array
 */
const VectorPrototype = require("./vectorprototype.js");

const factory = function(in_x, in_y, in_baseArrayClass){
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

const factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	return factory(x, y, Float32Array);
}

const factoryInt32 = function(in_xOrUndefined, in_yOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	return factory(x, y, Int32Array);
}

const factorySubtract = function(in_lhs, in_rhs){
	return factory(in_lhs.getX() - in_rhs.getX(), in_lhs.getY() - in_rhs.getY(), in_lhs.getRawClass());
}

const crossProduct = function(in_vector2){
	const x = in_vector2.getY();
	const y = -(in_vector2.getX());
	return module.exports.factory(x, y, in_vector2.getRawClass());
}

module.exports = {
	"factory" : factory,
	"factoryFloat32" : factoryFloat32,
	"factoryInt32" : factoryInt32,
	"factorySubtract" : factorySubtract,
	"crossProduct" : crossProduct
}
