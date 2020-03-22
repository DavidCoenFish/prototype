public class Spring
{
	//F = ma
	//F = -kx, k = springConstant
	private float _springConstant;
	//amount of dampening to apply to cahnge of spring length
	private float _springDeformResistance; 
	private float _targetChaser;
	private float _velocity;

	public Spring( float springConstant = 1.0f, float targetChaser = 0.0f, float springDeformResistance = 0.1f )
	{
		_springConstant = springConstant;
		_springDeformResistance = springDeformResistance;
		_targetChaser = targetChaser;
	}

	//return the targetChaser
	public float Advance(float target, float timeDelta)
	{
		float x = target - _targetChaser;

		if (0.0f != x)
		{
			Bootstrap.Log("got one");
		}

		float f = (_springConstant) * x;
		_velocity = UnityEngine.Mathf.MoveTowards(_velocity, 0.0f, _springDeformResistance * timeDelta);
		_velocity += (f * timeDelta);
		_targetChaser += (_velocity * timeDelta);

		if (float.IsNaN(_targetChaser) || float.IsInfinity(_targetChaser))
		{
			throw new System.ArithmeticException();
		}

		return _targetChaser;
	}
}
