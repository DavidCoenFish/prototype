/*
Float32Array
 */
const VectorPrototype = require("./vectorprototype.js");
const Vector3 = require("./vector3.js");

const factory = function(
	in_00, in_10, in_20, 
	in_01, in_11, in_21, 
	in_02, in_12, in_22, 
	in_baseArrayClass){
	const data = new in_baseArrayClass([
		in_00, in_10, in_20, 
		in_01, in_11, in_21, 
		in_02, in_12, in_22, 
	]);
	const result = Object.create({
		"get00" : function(){ return data[0]; return; },
		"set00" : function(in_value){ data[0] = in_value; return; },

		"get10" : function(){ return data[1]; return; },
		"set10" : function(in_value){ data[1] = in_value; return; },

		"get20" : function(){ return data[2]; return; },
		"set20" : function(in_value){ data[2] = in_value; return; },

		"get01" : function(){ return data[3]; return; },
		"set01" : function(in_value){ data[3] = in_value; return; },

		"get11" : function(){ return data[4]; return; },
		"set11" : function(in_value){ data[4] = in_value; return; },

		"get21" : function(){ return data[5]; return; },
		"set21" : function(in_value){ data[5] = in_value; return; },

		"get02" : function(){ return data[6]; return; },
		"set02" : function(in_value){ data[6] = in_value; return; },

		"get12" : function(){ return data[7]; return; },
		"set12" : function(in_value){ data[7] = in_value; return; },

		"get22" : function(){ return data[8]; return; },
		"set22" : function(in_value){ data[8] = in_value; return; },

		"getAt" : function(){ return Vector3.factory(data[0], data[1], data[2], in_baseArrayClass); },
		"setAt" : function(in_vec){ data[0] = in_vec.getX(); data[1] = in_vec.getY(); data[2] = in_vec.getY(); return; },

		"getLeft" : function(){ return Vector3.factory(data[3], data[4], data[5], in_baseArrayClass); },
		"setLeft" : function(in_vec){ data[3] = in_vec.getX(); data[4] = in_vec.getY(); data[5] = in_vec.getY(); return; },

		"getUp" : function(){ return Vector3.factory(data[6], data[7], data[8], in_baseArrayClass); },
		"setUp" : function(in_vec){ data[6] = in_vec.getX(); data[7] = in_vec.getY(); data[8] = in_vec.getY(); return; },

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

const factoryFloat32 = function(
	in_00OrUndefined, in_10OrUndefined, in_20OrUndefined,
	in_01OrUndefined, in_11OrUndefined, in_21OrUndefined,
	in_02OrUndefined, in_12OrUndefined, in_22OrUndefined
	){
	const in_00 = (undefined === in_00OrUndefined) ? 0.0 : in_00OrUndefined;
	const in_10 = (undefined === in_10OrUndefined) ? 0.0 : in_10OrUndefined;
	const in_20 = (undefined === in_20OrUndefined) ? 0.0 : in_20OrUndefined;
	const in_01 = (undefined === in_01OrUndefined) ? 0.0 : in_01OrUndefined;
	const in_11 = (undefined === in_11OrUndefined) ? 0.0 : in_11OrUndefined;
	const in_21 = (undefined === in_21OrUndefined) ? 0.0 : in_21OrUndefined;
	const in_02 = (undefined === in_02OrUndefined) ? 0.0 : in_02OrUndefined;
	const in_12 = (undefined === in_12OrUndefined) ? 0.0 : in_12OrUndefined;
	const in_22 = (undefined === in_22OrUndefined) ? 0.0 : in_22OrUndefined;

	return factory(
		in_00, in_10, in_20, 
		in_01, in_11, in_21, 
		in_02, in_12, in_22, 
		Float32Array);
}

//http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
const factoryQuaternion = function(in_quaternion){
	const w = in_quaternion.getW();
	const x = in_quaternion.getX();
	const y = in_quaternion.getY();
	const z = in_quaternion.getZ();

	const xx      = x * x;
	const xy      = x * y;
	const xz      = x * z;
	const xw      = x * w;

	const yy      = y * y;
	const yz      = y * z;
	const yw      = y * w;

	const zz      = z * z;
	const zw      = z * w;

	const m00  = 1 - 2 * ( yy + zz );
	const m01  =     2 * ( xy - zw );
	const m02 =     2 * ( xz + yw );

	const m10  =     2 * ( xy + zw );
	const m11  = 1 - 2 * ( xx + zz );
	const m12  =     2 * ( yz - xw );

	const m20  =     2 * ( xz - yw );
	const m21  =     2 * ( yz + xw );
	const m22 = 1 - 2 * ( xx + yy );

	return factory(
		m00, m10, m20, 
		m01, m11, m21, 
		m02, m12, m22, 
		Float32Array);
}

const transformVector3 = function(in_matrix, in_vector3){
	const x = in_vector3.getX();
	const y = in_vector3.getY();
	const z = in_vector3.getZ();
	return Vector3.factoryFloat32(
		(x * in_matrix.get00()) + (y * in_matrix.get01()) + (z * in_matrix.get02()),
		(x * in_matrix.get10()) + (y * in_matrix.get11()) + (z * in_matrix.get12()),
		(x * in_matrix.get20()) + (y * in_matrix.get21()) + (z * in_matrix.get22())
	);
}


module.exports = {
	"factory" : factory,
	"factoryFloat32" : factoryFloat32,
	"factoryQuaternion" : factoryQuaternion,
	"transformVector3" : transformVector3
}
