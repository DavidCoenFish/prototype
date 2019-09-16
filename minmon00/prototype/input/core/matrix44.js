/*
Float32Array
 */
export const factory = function(
	in_00, in_10, in_20, in_30,
	in_01, in_11, in_21, in_31,
	in_02, in_12, in_22, in_32,
	in_03, in_13, in_23, in_33,
	in_baseArrayClass){
	const data = new in_baseArrayClass([
		in_00, in_10, in_20, in_30,
		in_01, in_11, in_21, in_31,
		in_02, in_12, in_22, in_32,
		in_03, in_13, in_23, in_33
	]);
	const result = Object.create({
		"get00" : function(){ return data[0]; return; },
		"set00" : function(in_value){ data[0] = in_value; return; },

		"get10" : function(){ return data[1]; return; },
		"set10" : function(in_value){ data[1] = in_value; return; },

		"get20" : function(){ return data[2]; return; },
		"set20" : function(in_value){ data[2] = in_value; return; },

		"get30" : function(){ return data[3]; return; },
		"set30" : function(in_value){ data[3] = in_value; return; },

		"get01" : function(){ return data[4]; return; },
		"set01" : function(in_value){ data[4] = in_value; return; },

		"get11" : function(){ return data[5]; return; },
		"set11" : function(in_value){ data[5] = in_value; return; },

		"get21" : function(){ return data[6]; return; },
		"set21" : function(in_value){ data[6] = in_value; return; },

		"get31" : function(){ return data[7]; return; },
		"set31" : function(in_value){ data[7] = in_value; return; },

		"get02" : function(){ return data[8]; return; },
		"set02" : function(in_value){ data[8] = in_value; return; },

		"get12" : function(){ return data[9]; return; },
		"set12" : function(in_value){ data[9] = in_value; return; },

		"get22" : function(){ return data[10]; return; },
		"set22" : function(in_value){ data[10] = in_value; return; },

		"get32" : function(){ return data[11]; return; },
		"set32" : function(in_value){ data[11] = in_value; return; },

		"get03" : function(){ return data[12]; return; },
		"set03" : function(in_value){ data[12] = in_value; return; },

		"get13" : function(){ return data[13]; return; },
		"set13" : function(in_value){ data[13] = in_value; return; },

		"get23" : function(){ return data[14]; return; },
		"set23" : function(in_value){ data[14] = in_value; return; },

		"get33" : function(){ return data[15]; return; },
		"set33" : function(in_value){ data[15] = in_value; return; },

		"getRaw" : function(){
			return data;
		},
		"getRawClass" : function(){
			return in_baseArrayClass;
		}
	});

	return result;
}

export const factoryFloat32 = function(
	in_00OrUndefined, in_10OrUndefined, in_20OrUndefined, in_30OrUndefined, 
	in_01OrUndefined, in_11OrUndefined, in_21OrUndefined, in_31OrUndefined, 
	in_02OrUndefined, in_12OrUndefined, in_22OrUndefined, in_32OrUndefined, 
	in_03OrUndefined, in_13OrUndefined, in_23OrUndefined, in_33OrUndefined
	){
	const in_00 = (undefined === in_00OrUndefined) ? 0.0 : in_00OrUndefined;
	const in_10 = (undefined === in_10OrUndefined) ? 0.0 : in_10OrUndefined;
	const in_20 = (undefined === in_20OrUndefined) ? 0.0 : in_20OrUndefined;
	const in_30 = (undefined === in_30OrUndefined) ? 0.0 : in_30OrUndefined;
	const in_01 = (undefined === in_01OrUndefined) ? 0.0 : in_01OrUndefined;
	const in_11 = (undefined === in_11OrUndefined) ? 0.0 : in_11OrUndefined;
	const in_21 = (undefined === in_21OrUndefined) ? 0.0 : in_21OrUndefined;
	const in_31 = (undefined === in_31OrUndefined) ? 0.0 : in_31OrUndefined;
	const in_02 = (undefined === in_02OrUndefined) ? 0.0 : in_02OrUndefined;
	const in_12 = (undefined === in_12OrUndefined) ? 0.0 : in_12OrUndefined;
	const in_22 = (undefined === in_22OrUndefined) ? 0.0 : in_22OrUndefined;
	const in_32 = (undefined === in_32OrUndefined) ? 0.0 : in_32OrUndefined;
	const in_03 = (undefined === in_03OrUndefined) ? 0.0 : in_03OrUndefined;
	const in_13 = (undefined === in_13OrUndefined) ? 0.0 : in_13OrUndefined;
	const in_23 = (undefined === in_23OrUndefined) ? 0.0 : in_23OrUndefined;
	const in_33 = (undefined === in_33OrUndefined) ? 0.0 : in_33OrUndefined;

	return factory(
		in_00, in_10, in_20, in_30, 
		in_01, in_11, in_21, in_31, 
		in_02, in_12, in_22, in_32, 
		in_03, in_13, in_23, in_33, 
		Float32Array);
}
