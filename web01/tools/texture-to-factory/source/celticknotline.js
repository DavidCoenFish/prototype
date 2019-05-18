/*
 */
const Vector2 = require("./vector2.js");

const factory = function(in_uvStart, in_uvEnd){
	const m_start = in_uvStart;
	const m_normal = Vector2.factorySubtract(in_uvEnd, in_uvStart);
	const m_length = m_normal.normaliseSelf();
	const m_normalCross = Vector2.factoryFloat32(m_normal.getY(), -(m_normal.getX()));

	const result = Object.create({
		"sample" : function(in_accumulator, in_uv){
			const uvRelativeToStart = Vector2.factorySubtract(in_uv, m_start);
			const projectedOnNormal = m_normal.dotProduct(uvRelativeToStart);
			if ((projectedOnNormal < 0.0) || (m_length < projectedOnNormal)){
				return;
			}
			const distance = Math.abs(m_normalCross.dotProduct(uvRelativeToStart));

			in_accumulator.setDistance(distance);

			return;
		},
	});

	return result;
}

module.exports = {
	"factory" : factory,
};
