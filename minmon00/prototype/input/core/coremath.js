export const cmpAlmost = function(in_lhs, in_rhs, in_epsilonOrUndefined)
{
	const epsilon = (undefined === in_epsilonOrUndefined) ? Number.MIN_VALUE : in_epsilonOrUndefined;
	var result = (Math.abs(in_lhs - in_rhs) <= epsilon);
	return result;
}

export const roundNextPowerOfTwo = function(in_value)
{
	if (n === 0) return 1
	n--
	n |= n >> 1
	n |= n >> 2
	n |= n >> 4
	n |= n >> 8
	n |= n >> 16

	return n+1	
} 