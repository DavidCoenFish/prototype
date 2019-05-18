/*
 */
const Vector2 = require("./vector2.js");

const factory = function(in_uvOrigin, in_radius, in_startRadians, in_endRadians){
	const m_uvOrigin = in_uvOrigin;
	const m_radius = in_radius;
	const m_startRadians = in_startRadians;
	const m_endRadians = in_endRadians;

	const result = Object.create({
		"sample" : function(in_accumulator, in_uv){
			const uvRelativeToStart = Vector2.factorySubtract(in_uv, m_uvOrigin);
			const distance = Math.abs(uvRelativeToStart.length() - m_radius);
			const angle = Math.atan2(uvRelativeToStart.getY(), uvRelativeToStart.getX());
			if ((angle < m_startRadians) || (m_endRadians <= angle)){
				return;
			}

			in_accumulator.setDistance(distance);
			return;
		},
	});

	return result;
}

module.exports = {
	"factory" : factory,
};
