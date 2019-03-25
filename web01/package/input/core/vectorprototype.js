/*
common properties for the vector class
 */

export default {
	"dotProduct" : function(in_vector){
		const dataLhs = this.getRaw();
		const dataRhs = in_vector.getRaw();
		var result = 0;
		const count = Math.min(dataLhs.length, dataRhs.length);
		for (var index = 0; index < count; ++index) { 
			result += (dataLhs[index] * dataRhs[index]);
		}
		return result;
	},

	"length" : function(){
		const data = this.getRaw();
		var sum = 0;
		for (var index = 0; index < data.length; ++index) { 
			sum += (data[index] * data[index]);
		}
		const length = Math.sqrt(sum);
		return length;
	},

	//normalise self, return length
	"normaliseSelf" : function(){
		const data = this.getRaw();
		const length = this.length();
		if (0.0 !== length){
			const mul = 1.0 / length;
			for (var index = 0; index < data.length; ++index) { 
				data[index] *= mul;
			}
		}
		return length;
	},


}
