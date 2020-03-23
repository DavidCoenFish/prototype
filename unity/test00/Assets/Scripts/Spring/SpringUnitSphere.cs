public class SpringUnitSphere
{
	private Spring _springX;
	private Spring _springY;
	private Spring _springZ;

	public SpringUnitSphere(float springConstant, UnityEngine.Vector3 targetChaser, float springDeformResistance )
	{
		var normTarget = targetChaser.normalized;
		_springX = new Spring(springConstant, normTarget.x, springDeformResistance);
		_springY = new Spring(springConstant, normTarget.y, springDeformResistance);
		_springZ = new Spring(springConstant, normTarget.y, springDeformResistance);
	}

	public UnityEngine.Vector3 Advance(UnityEngine.Vector3 target, float timeDelta)
	{
		var normTarget = target.normalized;
		var x = _springX.Advance(normTarget.x, timeDelta);
		var y = _springY.Advance(normTarget.y, timeDelta);
		var z = _springZ.Advance(normTarget.z, timeDelta);

		var normResult = new UnityEngine.Vector3(x, y, z);
		normResult.Normalize();

		_springX.SetTarget(normResult.x);
		_springY.SetTarget(normResult.y);
		_springZ.SetTarget(normResult.z);

		return normResult;
	}
}
