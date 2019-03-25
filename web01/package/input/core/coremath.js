export const cmpAlmost = function(in_lhs, in_rhs, in_epsilonOrUndefined)
{
	const epsilon = (undefined === in_epsilonOrUndefined) ? Number.MIN_VALUE : in_epsilonOrUndefined;
	var result = (Math.abs(in_lhs - in_rhs) <= epsilon);
	return result;
}
