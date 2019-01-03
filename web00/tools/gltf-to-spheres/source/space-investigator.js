const factory = function(in_barycentricTriangleArray){
	const result = Object.create({
		"isPointInside" : function(in_pos3){
			const arrayPositive = [];
			const arrayNegative = [];
			const rayNormal = [1.0, 0.0, 0.0];
			for (var index = 0; index < in_barycentricTriangleArray.length; ++index){
				in_barycentricTriangleArray[index].dealIntersection(arrayPositive, arrayNegative, rayNormal, in_pos3);
			}
			const inside = (arrayPositive.length !== arrayNegative.length);
			return inside;
		}
	});
	return result;
}

module.exports = {
	"factory" : factory
};
