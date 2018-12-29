const Core = require("core");
const WebGL = require("webgl");
/*
use knowledge of posistion instead of having uv references
have fixed tree, zero radius for dead branch

//presume each pixel is 4 floats
data = [
0:	sphere x, y, z, radius, //root sphere
1...8: 1st generation children
9...72: 2nd generation children
73...584: 3rd generation children
585...4679: 4th generation children
4680...37446: 5th generation children
];
and put other data in other tetures at same uv for each datapoint

*/

const makeDebugOctTreeChildren = function(in_arrayData, in_nextGenerationParents, in_parentPos, in_parentRadius){
	const childRadius = 0.378024844800586 * in_parentRadius;
	const childOffset = in_parentRadius - childRadius;
	for (var index = 0; index < 6; ++index){
		var xOffset = Math.sin(Core.Radians.fromDegrees(60.0 * index)) * childOffset;
		var yOffset = Math.cos(Core.Radians.fromDegrees(60.0 * index)) * childOffset;
		var childPos = Core.Vector3.factoryFloat32(in_parentPos.getX() + xOffset, in_parentPos.getY() + yOffset, in_parentPos.getZ());

		in_arrayData.push(childPos.getX());
		in_arrayData.push(childPos.getY());
		in_arrayData.push(childPos.getZ());
		in_arrayData.push(childRadius);
		in_nextGenerationParents.push(childPos);
		in_nextGenerationParents.push(childRadius);
	}
	//up
	var upPos = Core.Vector3.factoryFloat32(in_parentPos.getX(), in_parentPos.getY(), in_parentPos.getZ() + childOffset);
	in_arrayData.push(upPos.getX());
	in_arrayData.push(upPos.getY());
	in_arrayData.push(upPos.getZ());
	in_arrayData.push(childRadius);
	in_nextGenerationParents.push(upPos);
	in_nextGenerationParents.push(childRadius);

	//down
	var downPos = Core.Vector3.factoryFloat32(in_parentPos.getX(), in_parentPos.getY(), in_parentPos.getZ() - childOffset);
	in_arrayData.push(downPos.getX());
	in_arrayData.push(downPos.getY());
	in_arrayData.push(downPos.getZ());
	in_arrayData.push(childRadius);
	in_nextGenerationParents.push(downPos);
	in_nextGenerationParents.push(childRadius);

	return;
}

const makeDebugOctTree = function(in_depth){
	var dataArray = [];
	dataArray.push(0.0);
	dataArray.push(0.0);
	dataArray.push(0.0);
	dataArray.push(1.0);
	var prevGeneration = [];
	prevGeneration.push(Core.Vector3.factoryFloat32(0.0, 0.0, 0.0));
	prevGeneration.push(1.0);
	for (var index = 0; index < in_depth; ++index){
		var nextGeneration = [];
		for (var subIndex = 0; subIndex < prevGeneration.length; subIndex += 2){
			var parentPos = prevGeneration[subIndex + 0];
			var parentRadius = prevGeneration[subIndex + 1];

			makeDebugOctTreeChildren(dataArray, nextGeneration, parentPos, parentRadius);
		}
		prevGeneration = nextGeneration;
	}

	return dataArray;
}

function nextPowerOfTwo (n) {
  if (n === 0) return 1
  n--
  n |= n >> 1
  n |= n >> 2
  n |= n >> 4
  n |= n >> 8
  n |= n >> 16
  return n+1
}

const calculateTextureDim = function(in_pixelCount){
	var temp = Math.ceil(Math.sqrt(in_pixelCount));
	temp = Math.max(4, nextPowerOfTwo(temp));
	return Core.Vector2.factoryInt32(temp, temp);
}

const gFloatsPerPixel = 4;
const factory = function(in_webGLContextWrapper, in_depth){
	const rawDataArray = makeDebugOctTree(in_depth);
	const pixelCount = rawDataArray.length / gFloatsPerPixel;
	console.log("pixelCount:" + pixelCount);

	const textureDim = calculateTextureDim(pixelCount);
	const targetDataArrayLength = textureDim.getX() * textureDim.getY() * gFloatsPerPixel;
	for (var index = rawDataArray.length; index < targetDataArrayLength; ++index){
		rawDataArray.push(0.0);
	}
	const dataArray = new Float32Array(rawDataArray);

	console.log("textureDim:" + textureDim.getX() + " " + textureDim.getY());

	// var message = "";
	// var trace = 0;
	// for (var y = 0; y < textureDim.getY(); ++y){
	// 	for (var x = 0; x < textureDim.getX(); ++x){
	// 		message +=  "[" + x + "," + y + "]:" + dataArray[trace + 0] + " " + dataArray[trace + 1] + " " + dataArray[trace + 2] + " " + dataArray[trace + 3] + "\n";
	// 		trace += 4;
	// 	}
	// }
	// console.log(message);

	return WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		textureDim.getX(), 
		textureDim.getY(),
		dataArray,
		false,
		"RGBA",
		"RGBA",
		"FLOAT",
		"NEAREST",
		"NEAREST",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

module.exports = {
	"factory" : factory,
};