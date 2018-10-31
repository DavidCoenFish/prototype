/*
common properties for the vector class
 */

module.exports.prototype = {
	"dotProduct" : function(in_vector){
		const dataLhs = this.getRaw();
		const dataRhs = in_vector.getRaw();
		var result = 0;
		const count = Math.min(dataLhs.length, dataRhs.length);
		for (var index = 0; index < count; ++index) { 
			result += (dataLhs[index] * dataRhs[index]);
		}
		return result;
	}
}
