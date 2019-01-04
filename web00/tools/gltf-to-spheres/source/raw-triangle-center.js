const calcOffset = function(in_triangle){
	var low = [in_triangle[0], in_triangle[1], in_triangle[2]];
	var high = [in_triangle[0], in_triangle[1], in_triangle[2]];

	for (var index = 0; index < in_triangle.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			low[subIndex] = Math.min(low[subIndex], in_triangle[index + subIndex]);
			high[subIndex] = Math.max(high[subIndex], in_triangle[index + subIndex]);
		}
	}

	return [
		(high[0] + low[0]) * (-0.5), 
		(high[1] + low[1]) * (-0.5), 
		(high[2] + low[2]) * (-0.5) ];
}

const applyOffset = function(in_offset, in_triangle){
	for (var index = 0; index < in_triangle.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			in_triangle[index + subIndex] += in_offset[subIndex];
		}
	}
	return in_triangle;
}

const rawTriangleCenter = function(in_rawTriangleArray){
	const offset = calcOffset(in_rawTriangleArray);
	in_rawTriangleArray = applyOffset(offset, in_rawTriangleArray);
	return in_rawTriangleArray;
}

module.exports = {
	"rawTriangleCenter": rawTriangleCenter
}

