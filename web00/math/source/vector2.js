/*
Float32Array
 */
const Vector = require("./vector.js");

module.exports.factory = function(in_x, in_y, in_baseArrayClass){
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
		"crossProduct" : function() {
			const x = this.getY();
			const y = -(this.getX());
			return module.exports.factory(x, y, in_baseArrayClass);
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

module.exports.factoryFloat32 = function(in_xOrUndefined, in_yOrUndefined){
	const x = (undefined === in_xOrUndefined) ? 0.0 : in_xOrUndefined;
	const y = (undefined === in_yOrUndefined) ? 0.0 : in_yOrUndefined;
	return module.exports.factory(x, y, Float32Array);
}
