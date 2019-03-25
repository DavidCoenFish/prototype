const CelticKnot = require("./celticknot.js");

const distanceFunctionClassic = function(in_accumulator, in_distance){
	const m_halfWidth = (Math.sqrt((0.25 * 0.25) * 2)) / 2;
	if (in_distance < (m_halfWidth - 0.0001)){
		var temp = in_distance / m_halfWidth;
		temp = (temp * temp);
		var height = 1.0 - (0.5 * temp);
		in_accumulator.setKnotHeight(height);
	} else if (in_distance < (m_halfWidth * 2.0)){
		//"shadow" case
		var temp = in_distance - m_halfWidth;
		temp = (m_halfWidth - temp) / m_halfWidth;
		var temp2 = (temp * temp * temp);
		var height = temp2 * 0.5;
		in_accumulator.setSubtractBackgroundHeight(height);
		in_accumulator.setSubtractKnotHeight(temp * 0.25);
	}
	return;
}

const distanceFunction = function(in_accumulator, in_distance){
	const m_halfWidth = (Math.sqrt((0.25 * 0.25) * 2)) / 2;
	if (in_distance < (m_halfWidth - 0.0001)){
		var x = in_distance / m_halfWidth;
		var height = Math.sqrt(1.0 - (x * x));
		in_accumulator.setKnotHeight(height);
	} else if (in_distance < (m_halfWidth * 2.0)){
		//"shadow" case
		var temp = (1.0 - (in_distance - m_halfWidth) / m_halfWidth);
		var height = (1.0 - (temp * temp));
		in_accumulator.setSubtractKnotHeight(height);
	}
	return;
}

const sampleKnotAlpha = function(in_distanceFunction, in_accumulatorFactory, in_width, in_height, in_subSampleLevel){
	const celticKnot = CelticKnot.factory(in_distanceFunction);

	const arrayAlpha = [];
	for (var indexHeight = 0; indexHeight < in_height; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_width; ++indexWidth){
			//the square around the 
			const lowX = indexWidth / in_width;
			const highX = (indexWidth + 1) / in_width;
			const lowY = indexHeight / in_height;
			const highY = (indexHeight + 1) / in_height;
			const alphaRed = sampleKnotAlphaInternal(celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 1, in_subSampleLevel);
			const alphaGreen = sampleKnotAlphaInternal(celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 3, in_subSampleLevel);
			const alphaBlue = sampleKnotAlphaInternal(celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 15, in_subSampleLevel);
			arrayAlpha.push(alphaRed);
			arrayAlpha.push(alphaGreen);
			arrayAlpha.push(alphaBlue);
		}
	}
	return arrayAlpha;
}

const sampleKnot = function(in_distanceFunction, in_accumulatorFactory, in_width, in_height, in_subSampleLevel){
	const celticKnot = CelticKnot.factory(in_distanceFunction);

	const arrayHeight = [];
	for (var indexHeight = 0; indexHeight < in_height; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_width; ++indexWidth){
			//the square around the 
			const lowX = indexWidth / in_width;
			const highX = (indexWidth + 1) / in_width;
			const lowY = indexHeight / in_height;
			const highY = (indexHeight + 1) / in_height;
			const heightRed = sampleKnotInternal(celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 1, in_subSampleLevel);
			const heightGreen = sampleKnotInternal(celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 3, in_subSampleLevel);
			const heightBlue = sampleKnotInternal(celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 15, in_subSampleLevel);
			arrayHeight.push(heightRed);
			arrayHeight.push(heightGreen);
			arrayHeight.push(heightBlue);
		}
	}
	return arrayHeight;
}

const sampleKnotAlphaInternal = function(in_celticKnot, in_accumulatorFactory, in_lowX, in_lowY, in_highX, in_highY, in_tile, in_subsampleLevel){
	var trace = 0;
	var count = 0;

	for (var indexHeight = 0; indexHeight < in_subsampleLevel; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_subsampleLevel; ++indexWidth){
			var subRatioX = ((indexWidth * 2) + 1) / (in_subsampleLevel * 2);
			var uvX = (subRatioX * (in_highX - in_lowX)) + in_lowX;
			var subRatioY = ((indexHeight * 2) + 1) / (in_subsampleLevel * 2);
			var uvY = (subRatioY * (in_highY - in_lowY)) + in_lowY;
			var accumulator = in_accumulatorFactory();
			in_celticKnot.sampleHeight(accumulator, uvX, uvY, in_tile);
			var value = accumulator.getHeight();
			if (0.0 < value){
				trace += 1;
			}
			count += 1;
		}
	}

	var alpha = trace / count;
	return alpha;
}

const sampleKnotInternal = function(in_celticKnot, in_accumulatorFactory, in_lowX, in_lowY, in_highX, in_highY, in_tile, in_subsampleLevel){
	var count = 0;
	var sum = 0.0;

	for (var indexHeight = 0; indexHeight < in_subsampleLevel; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_subsampleLevel; ++indexWidth){
			var subRatioX = ((indexWidth * 2) + 1) / (in_subsampleLevel * 2);
			var uvX = (subRatioX * (in_highX - in_lowX)) + in_lowX;
			var subRatioY = ((indexHeight * 2) + 1) / (in_subsampleLevel * 2);
			var uvY = (subRatioY * (in_highY - in_lowY)) + in_lowY;
			var accumulator = in_accumulatorFactory();
			in_celticKnot.sampleHeight(accumulator, uvX, uvY, in_tile);
			sum += accumulator.getHeight();
			count += 1;
		}
	}

	var height = 0;
	if (0 !== count){
		height = sum / count;
	}
	return height;
}

module.exports = {
	"sampleKnot" : sampleKnot,
	"sampleKnotAlpha" : sampleKnotAlpha,
	"distanceFunctionClassic" : distanceFunctionClassic,
	"distanceFunction" : distanceFunction,
};
