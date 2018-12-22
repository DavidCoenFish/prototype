const Accumulator = require("./accumulator.js");
const CelticKnot = require("./celticknot.js");

const factory = function(){
	const m_celticKnot = CelticKnot.factory();
	const result = Object.create({
		//return an array of floats ([].length = in_width * in_height)
		"debugGenerateTile" : function(in_tile, in_width, in_height, in_subSampleLevel){
			const arrayHeight = [];
			for (var indexHeight = 0; indexHeight < in_height; ++indexHeight){
				for (var indexWidth = 0; indexWidth < in_width; ++indexWidth){
					//the square around the 
					const lowX = indexWidth / in_width;
					const highX = (indexWidth + 1) / in_width;
					const lowY = indexHeight / in_height;
					const highY = (indexHeight + 1) / in_height;
					const height = sampleKnot(
						(lowX * 2.0) - 0.5,
						(lowY * 2.0) - 0.5,
						(highX * 2.0) - 0.5,
						(highY * 2.0) - 0.5,
						in_tile,
						in_subSampleLevel
						);
					arrayHeight.push(height);
					arrayHeight.push(height);
					arrayHeight.push(height);
				}
			}
			const result = new Float32Array(arrayHeight);
			return result;
		},
		"generateTile" : function(in_width, in_height, in_subSampleLevel){
			const arrayHeight = [];
			for (var indexHeight = 0; indexHeight < in_height; ++indexHeight){
				for (var indexWidth = 0; indexWidth < in_width; ++indexWidth){
					//the square around the 
					const lowX = indexWidth / in_width;
					const highX = (indexWidth + 1) / in_width;
					const lowY = indexHeight / in_height;
					const highY = (indexHeight + 1) / in_height;
					const heightRed = sampleKnot(lowX, lowY, highX, highY, 1, in_subSampleLevel);
					const heightGreen = sampleKnot(lowX, lowY, highX, highY, 3, in_subSampleLevel);
					const heightBlue = sampleKnot(lowX, lowY, highX, highY, 15, in_subSampleLevel);
					arrayHeight.push(heightRed);
					arrayHeight.push(heightGreen);
					arrayHeight.push(heightBlue);
				}
			}
			const result = new Float32Array(arrayHeight);
			return result;
		}
	});


	const sampleKnot = function( in_lowX, in_lowY, in_highX, in_highY, in_tile, in_subsampleLevel){
		var count = 0;
		var sum = 0.0;

		for (var indexHeight = 0; indexHeight < in_subsampleLevel; ++indexHeight){
			for (var indexWidth = 0; indexWidth < in_subsampleLevel; ++indexWidth){
				var subRatioX = ((indexWidth * 2) + 1) / (in_subsampleLevel * 2);
				var uvX = (subRatioX * (in_highX - in_lowX)) + in_lowX;
				var subRatioY = ((indexHeight * 2) + 1) / (in_subsampleLevel * 2);
				var uvY = (subRatioY * (in_highY - in_lowY)) + in_lowY;
				var accumulator = Accumulator.factory();
				//accumulator.setHeight(0.5);
				m_celticKnot.sampleHeight(accumulator, uvX, uvY, in_tile);
				sum += Math.max(0.0, accumulator.getHeight());
				count += 1;
			}
		}

		var height = 0;
		if (0 !== count){
			height = sum / count;
		}
		return height;
	}

	return result;
}

module.exports = {
	"factory" : factory,
};
