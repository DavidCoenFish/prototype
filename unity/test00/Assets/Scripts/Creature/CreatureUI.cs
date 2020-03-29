//var texture = Resources.Load<Texture2D>("Textures/texture01");

public class CreatureUI
{
	private UnityEngine.Texture2D _circleTexture;
	private UnityEngine.GUIStyle _circleStyle;
	private float _timeAccumulate = 0.0f;

	public CreatureUI()
	{ 
		_circleTexture = UnityEngine.Resources.Load<UnityEngine.Texture2D>("texture/circle");
		_circleStyle = new UnityEngine.GUIStyle();
		_circleStyle.normal.background = _circleTexture;
	}

	public void Update()
	{
		_timeAccumulate += UnityEngine.Time.deltaTime;
	}

	private float RatioToAlphaPulse(float ratio)
	{
		float negOneToOne = (ratio - 0.5f) * 2.0f;
		float squared = negOneToOne * negOneToOne;
		return 1.0f - squared;
	}

	private void DrawElements(CreatureState creatureState)
	{
		float minScreen = UnityEngine.Mathf.Min((float)UnityEngine.Screen.width, (float)UnityEngine.Screen.height);
		var size = (minScreen * 0.2f);
		UnityEngine.GUI.color = UnityEngine.Color.white;
		foreach(CreatureStatePerUpdate.UIElementData uiElementData in creatureState.creatureStatePerUpdate.uiElementDataArray)
		{
			switch (uiElementData.uiElement)
			{
				default:
					continue;
				case CreatureStatePerUpdate.TUIElement.ArmHold:
				case CreatureStatePerUpdate.TUIElement.Movement:
				case CreatureStatePerUpdate.TUIElement.View:
					break;
			}
			var rect = new UnityEngine.Rect(uiElementData.position.x - (size * 0.5f), (UnityEngine.Screen.height - uiElementData.position.y) - (size * 0.5f), size, size);
			UnityEngine.GUI.Box(rect, UnityEngine.GUIContent.none, _circleStyle);
		}
	}

	private void DrawTouch(CreatureState creatureState)
	{
		float minScreen = UnityEngine.Mathf.Min((float)UnityEngine.Screen.width, (float)UnityEngine.Screen.height);
		float ratioA = UnityEngine.Mathf.Repeat(_timeAccumulate, 2.0f) * 0.5f;
		float ratioB = UnityEngine.Mathf.Repeat(_timeAccumulate + 1.0f, 2.0f) * 0.5f;
		foreach(UnityEngine.Vector2 touch in creatureState.creatureStatePerUpdate.touchArray)
		{
			float sizeA = (minScreen * 0.1f) * (0.5f + (0.5f * ratioA));
			float sizeB = (minScreen * 0.1f) * (0.5f + (0.5f * ratioB));

			UnityEngine.GUI.color = new UnityEngine.Color(1.0f, 1.0f, 1.0f, 0.75f * RatioToAlphaPulse(ratioA));
			var rectA = new UnityEngine.Rect(touch.x - (sizeA * 0.5f), (UnityEngine.Screen.height - touch.y) - (sizeA * 0.5f), sizeA, sizeA);
			UnityEngine.GUI.Box(rectA, UnityEngine.GUIContent.none, _circleStyle);

			UnityEngine.GUI.color = new UnityEngine.Color(1.0f, 1.0f, 1.0f, 0.75f * RatioToAlphaPulse(ratioB));
			var rectB = new UnityEngine.Rect(touch.x - (sizeB * 0.5f), (UnityEngine.Screen.height - touch.y) - (sizeB * 0.5f), sizeB, sizeB);
			UnityEngine.GUI.Box(rectB, UnityEngine.GUIContent.none, _circleStyle);
		}
	}

	public void Draw(CreatureState creatureState)
	{
		DrawElements(creatureState);
		DrawTouch(creatureState);


		return;
	}
}
