const getRawTiangleArrayMin = function(in_rawTiangleArray){
	var low = [in_rawTiangleArray[0], in_rawTiangleArray[1], in_rawTiangleArray[2]];

	for (var index = 0; index < in_rawTiangleArray.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			low[subIndex] = Math.min(low[subIndex], in_rawTiangleArray[index + subIndex]);
		}
	}

	return low;
}

const getRawTiangleArrayDim = function(in_rawTiangleArray){
	var low = [in_rawTiangleArray[0], in_rawTiangleArray[1], in_rawTiangleArray[2]];
	var high = [in_rawTiangleArray[0], in_rawTiangleArray[1], in_rawTiangleArray[2]];

	for (var index = 0; index < in_rawTiangleArray.length; index += 3){
		for (var subIndex = 0; subIndex < 3; ++subIndex){
			low[subIndex] = Math.min(low[subIndex], in_rawTiangleArray[index + subIndex]);
			high[subIndex] = Math.max(high[subIndex], in_rawTiangleArray[index + subIndex]);
		}
	}

	var dim = [
		(high[0] - low[0]), 
		(high[1] - low[1]), 
		(high[2] - low[2])
		];
	return dim;
}

const calcScale = function(in_rawTiangleArray, in_targetDim){
	var dim = getRawTiangleArrayDim(in_rawTiangleArray);
	var maxDim = Math.max(dim[0], dim[1], dim[2]);
	if (0.0 === maxDim){
		return [1.0, 1.0, 1.0];
	}
	var scale = in_targetDim / maxDim;
	return scale;
}

const applyScale = function(in_scale, in_rawTiangleArray){
	for (var index = 0; index < in_rawTiangleArray.length; ++index){
		in_rawTiangleArray[index] *= in_scale;
	}
	return in_rawTiangleArray;
}

const rawTriangleScale = function(in_rawTriangleArray, in_targetDim){
	const scale = calcScale(in_rawTriangleArray, in_targetDim);
	in_rawTriangleArray = applyScale(scale, in_rawTriangleArray);
	return in_rawTriangleArray;
}

module.exports = {
	"getRawTiangleArrayMin" : getRawTiangleArrayMin,
	"getRawTiangleArrayDim" : getRawTiangleArrayDim,
	"rawTriangleScale" : rawTriangleScale
};

