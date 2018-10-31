/*
Float32Array
 */
const Vector = require("./vector.js");

const factory = function(in_x, in_y, in_z, in_baseArrayClass){
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
		"crossProduct" : function(in_rhs) {
			const x = (this.getY() * in_rhs.getZ()) - (this.getZ() * in_rhs.getY());
			const y = (this.getZ() * in_rhs.getX()) - (this.getX() * in_rhs.getZ());
			const z = (this.getX() * in_rhs.getY()) - (this.getY() * in_rhs.getX());
			return module.exports.factory(x, y, z, in_baseArrayClass);
		},
		"getRaw" : function(){
			return data;
		},
		"getRawClass" : function(){
			return in_baseArrayClass;
		}
	});

	Object.assign(result, Vector.prototype);
	
	return result;
}

const factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined, in_zOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	const z = (undefined === in_zOrUndefined) ? 0.0 : in_zOrUndefined;
	return factory(x, y, z, Float32Array);
}
module.exports = {
	"factory" : factory,
	"factoryFloat32" : factoryFloat32
}
