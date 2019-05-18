const CelticKnot = require("./celticknot.js");

const sampleKnot = function(out_colourArray, out_alphaArray, in_accumulatorFactory, in_width, in_height, in_subSampleLevel){
	const celticKnot = CelticKnot.factory();

	const arrayHeight = [];
	for (var indexHeight = 0; indexHeight < in_height; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_width; ++indexWidth){
			//the square around the 
			const lowX = indexWidth / in_width;
			const highX = (indexWidth + 1) / in_width;
			const lowY = indexHeight / in_height;
			const highY = (indexHeight + 1) / in_height;
			sampleKnotInternal(out_colourArray, out_alphaArray, celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 1, in_subSampleLevel);
			sampleKnotInternal(out_colourArray, out_alphaArray, celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 3, in_subSampleLevel);
			sampleKnotInternal(out_colourArray, out_alphaArray, celticKnot, in_accumulatorFactory, lowX, lowY, highX, highY, 15, in_subSampleLevel);
		}
	}
	return arrayHeight;
}

const sampleKnotInternal = function(out_colourArray, out_alphaArray, in_celticKnot, in_accumulatorFactory, in_lowX, in_lowY, in_highX, in_highY, in_tile, in_subsampleLevel){
	var count = 0;
	var sumColour = 0.0;
	var sumAlpha = 0.0;

	for (var indexHeight = 0; indexHeight < in_subsampleLevel; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_subsampleLevel; ++indexWidth){
			var subRatioX = ((indexWidth * 2) + 1) / (in_subsampleLevel * 2);
			var uvX = (subRatioX * (in_highX - in_lowX)) + in_lowX;
			var subRatioY = ((indexHeight * 2) + 1) / (in_subsampleLevel * 2);
			var uvY = (subRatioY * (in_highY - in_lowY)) + in_lowY;
			var accumulator = in_accumulatorFactory();
			in_celticKnot.sample(accumulator, uvX, uvY, in_tile);
			sumColour += accumulator.getColour();
			sumAlpha += accumulator.getAlpha();
			count += 1;
		}
	}

	var colour = 0;
	var alpha = 0;
	if (0 !== count){
		colour = sumColour / count;
		alpha = sumAlpha / count;
	}
	out_colourArray.push(colour);
	out_alphaArray.push(alpha);
	return;
}

module.exports = {
	"sampleKnot" : sampleKnot
};
