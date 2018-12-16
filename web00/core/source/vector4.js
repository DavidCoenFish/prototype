/*
Float32Array
 */
const VectorPrototype = require("./vectorprototype.js");

const factory = function(in_x, in_y, in_z, in_w, in_baseArrayClass){
	const data = new in_baseArrayClass([in_x, in_y, in_z, in_w]);
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

const factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined, in_zOrUndefined, in_wOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	const z = (undefined === in_zOrUndefined) ? 0.0 : in_zOrUndefined;
	const w = (undefined === in_wOrUndefined) ? 0.0 : in_wOrUndefined;
	return factory(x, y, z, w, Float32Array);
}

const factoryInt32 = function(in_xOrUndefined, in_yOrUndefined, in_zOrUndefined, in_wOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	const z = (undefined === in_zOrUndefined) ? 0.0 : in_zOrUndefined;
	const w = (undefined === in_wOrUndefined) ? 0.0 : in_wOrUndefined;
	return factory(x, y, z, w, Int32Array);
}

module.exports = {
	"factory" : factory,
	"factoryFloat32" : factoryFloat32,
	"factoryInt32" : factoryInt32
}
