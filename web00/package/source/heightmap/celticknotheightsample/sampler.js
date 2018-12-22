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
						lowX, //(lowX * 2.0) - 0.5,
						lowY, //(lowY * 2.0) - 0.5,
						highX, //(highX * 2.0) - 0.5,
						highY, //(highY * 2.0) - 0.5,
						in_tile,
						in_subSampleLevel
						);
					arrayHeight.push(height);
					arrayHeight.push(height);
					arrayHeight.push(height);
					arrayHeight.push(1.0);
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
				var uvX = ((((indexWidth * 2) + 1) / (in_subsampleLevel * 2)) * (in_highX - in_lowX)) + in_lowX;
				var uvY = ((((indexHeight * 2) + 1) / (in_subsampleLevel * 2)) * (in_highY - in_lowY)) + in_lowY;
				var accumulator = Accumulator.factory();
				accumulator.setHeight(0.5);
				m_celticKnot.sampleHeight(accumulator, uvX, uvY, in_tile);
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

	return result;
}

module.exports = {
	"factory" : factory,
};
