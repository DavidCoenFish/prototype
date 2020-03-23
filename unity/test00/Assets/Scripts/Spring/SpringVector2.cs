public class SpringVector2
{
	private Spring _springX;
	private Spring _springY;

	public SpringVector2( float springConstant, UnityEngine.Vector2 targetChaser, float springDeformResistance )
	{
		_springX = new Spring(springConstant, targetChaser.x, springDeformResistance);
		_springY = new Spring(springConstant, targetChaser.y, springDeformResistance);
	}

	public UnityEngine.Vector2 Advance(UnityEngine.Vector2 target, float timeDelta)
	{
		var x = _springX.Advance(target.x, timeDelta);
		var y = _springY.Advance(target.y, timeDelta);
		return new UnityEngine.Vector2(x, y);
	}
}
