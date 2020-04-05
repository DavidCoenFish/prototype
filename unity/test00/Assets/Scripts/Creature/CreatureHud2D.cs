//var texture = Resources.Load<Texture2D>("Textures/texture01");

public class CreatureHud2D
{
	private UnityEngine.Texture2D _circleTexture;
	private UnityEngine.GUIStyle _circleStyle;
	private float _timeAccumulate = 0.0f;

	public CreatureHud2D()
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

	public static UnityEngine.Rect UIPositionToRect(UnityEngine.Vector2 position)
	{
		float minScreen = UnityEngine.Mathf.Min((float)UnityEngine.Screen.width, (float)UnityEngine.Screen.height);
		var size = (minScreen * 0.2f);
		var rect = new UnityEngine.Rect(position.x - (size * 0.5f), (UnityEngine.Screen.height - position.y) - (size * 0.5f), size, size);
		return rect;
	}

	private void DrawElements(CreatureState creatureState)
	{
		UnityEngine.GUI.color = UnityEngine.Color.white;
		//foreach(CreatureStateHud.UIElementData uiElementData in creatureState.creatureStateHud.uiElementDataArray)
		for (int index = 0; index < creatureState.creatureStateHud.uiElementDataArray.Count; ++index)
		{
			var uiElementData = creatureState.creatureStateHud.uiElementDataArray[index];
			switch (uiElementData.uiElement)
			{
				default:
					continue;
				case CreatureStateHud.TUIElement.Weapon:
				case CreatureStateHud.TUIElement.Movement:
				case CreatureStateHud.TUIElement.View:
					{
						var rect = UIPositionToRect(uiElementData.position);
						UnityEngine.GUI.Box(rect, UnityEngine.GUIContent.none, _circleStyle);
					}
					break;
				case CreatureStateHud.TUIElement.Pickup:
					{
						var rect = UIPositionToRect(uiElementData.position);
						UnityEngine.GUI.Button(rect, UnityEngine.GUIContent.none, _circleStyle);
#if false
						if (UnityEngine.GUI.Button(rect, UnityEngine.GUIContent.none, _circleStyle)){
							if ((uiElementData.gameObject) && (creatureState.weaponArray.Count < 8))
							{
								creatureState.weaponArray.Add(new CreatureState.WeaponData(){weapon=CreatureState.TWeapon.TSlingPan });

								UnityEngine.GameObject.Destroy(uiElementData.gameObject);
								//uiElementData.gameObject = null;
								creatureState.creatureStateHud.uiElementDataArray[index] = new CreatureStateHud.UIElementData(){
									position = uiElementData.position,
									uiElement = uiElementData.uiElement
								};
							}
						}
#endif
					}
					break;
			}
		}
	}

	private void DrawTouch(CreatureState creatureState)
	{
		float minScreen = UnityEngine.Mathf.Min((float)UnityEngine.Screen.width, (float)UnityEngine.Screen.height);
		float ratioA = UnityEngine.Mathf.Repeat(_timeAccumulate, 2.0f) * 0.5f;
		float ratioB = UnityEngine.Mathf.Repeat(_timeAccumulate + 1.0f, 2.0f) * 0.5f;
		foreach(UnityEngine.Vector2 touch in creatureState.creatureStateHud.touchArray)
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
		if ((null == creatureState) || (null == creatureState.creatureStateHud))
		{
			return;
		}

		DrawElements(creatureState);
		DrawTouch(creatureState);


		return;
	}
}
