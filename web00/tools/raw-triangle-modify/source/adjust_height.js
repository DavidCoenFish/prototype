const gatherLowHight = function(inout_low, inout_high, in_rawTriangleArray){
	for (var index = 0; index < in_rawTriangleArray.length; index += 3){
		if (0 === index){
			inout_low[0] = in_rawTriangleArray[index + 0];
			inout_high[0] = in_rawTriangleArray[index + 0];
			inout_low[1] = in_rawTriangleArray[index + 1];
			inout_high[1] = in_rawTriangleArray[index + 1];
			inout_low[2] = in_rawTriangleArray[index + 2];
			inout_high[2] = in_rawTriangleArray[index + 2];
		} else {
			inout_low[0] = Math.min(inout_low[0], in_rawTriangleArray[index + 0]);
			inout_high[0] = Math.max(inout_high[0], in_rawTriangleArray[index + 0]);
			inout_low[1] = Math.min(inout_low[1], in_rawTriangleArray[index + 1]);
			inout_high[1] = Math.max(inout_high[1], in_rawTriangleArray[index + 1]);
			inout_low[2] = Math.min(inout_low[2], in_rawTriangleArray[index + 2]);
			inout_high[2] = Math.max(inout_high[2], in_rawTriangleArray[index + 2]);
		}
	}
	return;
}

const makeOffset = function(in_low, in_high){
	return [
		(in_high[0] + in_low[0]) * (0.5),
		(in_high[1] + in_low[1]) * (0.5),
		in_low[2]
	];
}

const applyOffset = function(in_rawTriangleArray, in_offset){
	var result = [];
	for (var index = 0; index < in_rawTriangleArray.length; index += 3){
		result.push(in_rawTriangleArray[index + 0] - in_offset[0]);
		result.push(in_rawTriangleArray[index + 1] - in_offset[1]);
		result.push(in_rawTriangleArray[index + 2] - in_offset[2]);
	}
	return result;
}

const makeScale = function(in_low, in_high, in_adjustHeight){
	var maxDim = Math.max(in_high[0] - in_low[0], in_high[1] - in_low[1], in_high[2] - in_low[2]);
	if (0.0 === maxDim){
		return 1.0;
	}
	return in_adjustHeight / maxDim;
}

const applyScale = function(in_rawTriangleArray, in_scale){
	var result = [];
	for (var index = 0; index < in_rawTriangleArray.length; ++index){
		result.push(in_rawTriangleArray[index] * in_scale);
	}
	return result;
}


const run = function(in_rawTriangleArray, in_adjustHeight){
	const low = [0.0, 0.0, 0.0];
	const high = [0.0, 0.0, 0.0];
	gatherLowHight(low, high, in_rawTriangleArray);
	const offset = makeOffset(low, high);
	var result = applyOffset(in_rawTriangleArray, offset);
	const scale = makeScale(low, high, in_adjustHeight);
	result = applyScale(result, scale);
	return result;
}

module.exports = {
	"run" : run
}