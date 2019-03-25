/*
in_xRatio, in_yRatio

	+y
	^
	|
	|
	0 ---- > +x

+90 clockwise x. = y, y. = 1.0 - y
+180 cloclwise x. = 1.0 - x, y. = 1.0 - y
+270 clockwise x. = 1.0 - y, y. = x
indicative of which corners of the grid have knot
in_stampType binary enum of [0 ... 15] 0b00004321
	1 ---- 2
	|	   |
	|	   |
	3 ---- 4

 */
const Core = require("core");
const CelticKnotLine = require("./celticknotline.js");
const CelticKnotCircle = require("./celticknotcircle.js");

const factory = function(in_distanceFunction){
	const m_halfWidth = (Math.sqrt((0.25 * 0.25) * 2)) / 2;
	const result = Object.create({
		"sampleHeight" : function(in_accumulator, in_xRatio, in_yRatio, in_stampType){
			const uv = Core.Vector2.factoryFloat32(in_xRatio, in_yRatio);
			switch (in_stampType){
			default:
				break;
			case 1://0001
				sampleTile(in_accumulator, m_tileOneCorner, uv);
				break;
			case 2://0010
				sampleTile(in_accumulator, m_tileOneCorner, rotateUv90(uv));
				break;
			case 3://0011
				sampleTile(in_accumulator, m_tileTwoCorner, uv);
				break;
			case 4://0100
				sampleTile(in_accumulator, m_tileOneCorner, rotateUv180(uv));
				break;
			case 5://0101
				sampleTile(in_accumulator, m_tileTwoCorner, rotateUv270(uv));
				break;
			case 6://0110
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			case 7://0111
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			case 8://1000
				sampleTile(in_accumulator, m_tileOneCorner, rotate180(uv));
				break;
			case 9://1001
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			case 10://1010
				sampleTile(in_accumulator, m_tileTwoCorner, rotate270(uv));
				break;
			case 11://1011
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			case 12://1100
				sampleTile(in_accumulator, m_tileTwoCorner, rotate180(uv));
				break;
			case 13://1101
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			case 14://1110
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			case 15://1111
				sampleTile(in_accumulator, m_tileSolid, uv);
				break;
			}
			return;
		},
	});

	////////////////////////////////////
	//private methods

	const rotateUv90 = function(in_uv){
		return Core.Vector2.factoryFloat32(in_uv.getY(), 1.0 - in_uv.getX());
	}
	const rotateUv180 = function(in_uv){
		return Core.Vector2.factoryFloat32(1.0 - in_uv.getX(), 1.0 - in_uv.getY());
	}
	const rotateUv270 = function(in_uv){
		return Core.Vector2.factoryFloat32(1.0 - in_uv.getY(), in_uv.getX());
	}

	const sampleTile = function(in_accumulator, in_tileDataArray, in_uv){
		for (var index = 0; index < in_tileDataArray.length; index++) { 
			in_tileDataArray[index].sampleHeight(in_accumulator, in_uv);
		}
		return;
	}

	//1 soild
	const m_tileOneCorner = [
		CelticKnotLine.factory(Core.Vector2.factoryFloat32(0.375, 0.875), Core.Vector2.factoryFloat32(-0.25, 0.25), in_distanceFunction),		
	
		CelticKnotLine.factory(Core.Vector2.factoryFloat32(0.625, 0.875), Core.Vector2.factoryFloat32(0.25, 1.25), in_distanceFunction),
		CelticKnotCircle.factory(Core.Vector2.factoryFloat32(0.375, 0.625), m_halfWidth * 2.0, Core.Radians.fromDegrees(-135.0), Core.Radians.fromDegrees(45.0), in_distanceFunction),
	];
	//1,2 solid
	const m_tileTwoCorner = [
		CelticKnotLine.factory(Core.Vector2.factoryFloat32(0.375, 0.875), Core.Vector2.factoryFloat32(-0.25, 0.25), in_distanceFunction),		
		CelticKnotLine.factory(rotateUv90(Core.Vector2.factoryFloat32(0.375, 0.875)), rotateUv90(Core.Vector2.factoryFloat32(-0.25, 0.25)), in_distanceFunction),

		CelticKnotCircle.factory(Core.Vector2.factoryFloat32(0.5, 0.75), m_halfWidth * 3.0, Core.Radians.fromDegrees(-135.0), Core.Radians.fromDegrees(-45.0), in_distanceFunction),
		CelticKnotLine.factory(Core.Vector2.factoryFloat32(0.875, 0.375), Core.Vector2.factoryFloat32(1.25, 0.75), in_distanceFunction),
	];
	//1,2,3,4 solid
	const m_tileSolid = [
		CelticKnotLine.factory(Core.Vector2.factoryFloat32(-0.375, 0.125), Core.Vector2.factoryFloat32(0.375, 0.875), in_distanceFunction),
		CelticKnotLine.factory(rotateUv90(Core.Vector2.factoryFloat32(-0.375, 0.125)), rotateUv90(Core.Vector2.factoryFloat32(0.375, 0.875)), in_distanceFunction),
		CelticKnotLine.factory(rotateUv180(Core.Vector2.factoryFloat32(-0.375, 0.125)), rotateUv180(Core.Vector2.factoryFloat32(0.375, 0.875)), in_distanceFunction),
		CelticKnotLine.factory(rotateUv270(Core.Vector2.factoryFloat32(-0.375, 0.125)), rotateUv270(Core.Vector2.factoryFloat32(0.375, 0.875)), in_distanceFunction)
	];

	return result;
}

module.exports = {
	"factory" : factory,
};
