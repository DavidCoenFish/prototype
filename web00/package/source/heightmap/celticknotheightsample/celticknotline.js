/*
 */
const Core = require("core");

const factory = function(in_uvStart, in_uvEnd, in_distanceFunction){
	const m_distanceFunction = in_distanceFunction;
	const m_start = in_uvStart;
	const m_normal = Core.Vector2.factorySubtract(in_uvEnd, in_uvStart);
	const m_normalCross = Core.Vector2.factory(m_normal.getY(), -(m_normals.getX()));
	const m_length = m_normal.normaliseSelf();

	const result = Object.create({
		"sampleHeight" : function(in_accumulator, in_uv){
			const uvRelativeToStart = Core.Vector2.factorySubtract(in_uv, m_start);
			const projectedOnNormal = m_normal.dotProduct(uvRelativeToStart);
			if ((projectedOnNormal < 0.0) || (m_length <= projectedOnNormal)){
				return;
			}
			const distance = Math.abs(m_normalCross.dotProduct(uvRelativeToStart));

			m_distanceFunction.call(in_accumulator, distance);

			return;
		},
	});

	return result;
}

module.exports = {
	"factory" : factory,
};
