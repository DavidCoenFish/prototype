const calcScale = function(in_triangle, in_targetDim){
	var low = [in_triangle[0], in_triangle[1], in_triangle[2]];
	var high = [in_triangle[0], in_triangle[1], in_triangle[2]];

	for (var index = 0; index < in_triangle.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			low[subIndex] = Math.min(low[subIndex], in_triangle[index + subIndex]);
			high[subIndex] = Math.max(high[subIndex], in_triangle[index + subIndex]);
		}
	}

	var dim = [
		(high[0] - low[0]), 
		(high[1] - low[1]), 
		(high[2] - low[2])];

	var maxDim = Math.max(dim[0], dim[1], dim[2]);
	if (0.0 === maxDim){
		return [1.0, 1.0, 1.0];
	}
	var scale = in_targetDim / maxDim;
	return [dim[0] * scale, dim[1] * scale, dim[2] * scale];
}

const applyScale = function(in_scale, in_triangle){
	for (var index = 0; index < in_triangle.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			in_triangle[index + subIndex] *= in_scale[subIndex];
		}
	}
	return in_triangle;
}

const rawTriangleScale = function(in_rawTriangleArray, in_targetDim){
	const scale = calcScale(in_rawTriangleArray, in_targetDim);
	return applyScale(scale, in_rawTriangleArray);
}

module.exports = rawTriangleScale;

