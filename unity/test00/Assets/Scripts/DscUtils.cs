public class DscUtils
{
	//2d math
	public static UnityEngine.Vector2 UnclampedRectSpaceConvertTo(UnityEngine.Rect coordinateSystem, UnityEngine.Vector2 input)
	{
		return new UnityEngine.Vector2(
			(input.x - coordinateSystem.x) / coordinateSystem.width,
			(input.y - coordinateSystem.y) / coordinateSystem.height
			);
	}

	public static UnityEngine.Vector2 UnclampedRectSpaceConvertFrom(UnityEngine.Rect coordinateSystem, UnityEngine.Vector2 input)
	{
		return new UnityEngine.Vector2(
			(input.x * coordinateSystem.width) + coordinateSystem.x,
			(input.y * coordinateSystem.height) + coordinateSystem.y
			);
	}

	public static UnityEngine.Vector2 ZeroOneToNegOnePosOne(UnityEngine.Vector2 inputZeroOne)
	{
		return (inputZeroOne * 2.0f) - new UnityEngine.Vector2(1.0f, 1.0f);
	}

	public static UnityEngine.Vector2 NegOnePosOneToZeroOne(UnityEngine.Vector2 inputNegOnePosOne)
	{
		return (inputNegOnePosOne + new UnityEngine.Vector2(1.0f, 1.0f)) / 2.0f;
	}

}
