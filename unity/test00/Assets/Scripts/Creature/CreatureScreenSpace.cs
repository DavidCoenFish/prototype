public class CreatureScreenSpace
{
	private UnityEngine.GameObject _armPrefab = null;
	private System.Collections.Generic.List< UnityEngine.GameObject > _armArray;

    public CreatureScreenSpace()
    {
        _armPrefab = (UnityEngine.GameObject)UnityEngine.Resources.Load("prefab/arm", typeof(UnityEngine.GameObject));
        //UnityEngine.Instantiate(_armPrefab, new UnityEngine.Vector3(0, 0, 0), Quaternion.identity);
        _armArray = new System.Collections.Generic.List< UnityEngine.GameObject >();
    }

    private UnityEngine.GameObject GetArmsGameObject(int countArms)
    {
        UnityEngine.GameObject gameObject = null;
        if (_armArray.Count <= countArms)
        {
            gameObject = UnityEngine.Object.Instantiate(_armPrefab);
            _armArray.Add(gameObject);
        }
        else
        {
            gameObject = _armArray[countArms];
        }
        return gameObject;
    }
    private static void SetupArms(CreatureState creatureState, int countArms, UnityEngine.GameObject gameObject, UnityEngine.Vector2 touch)
    {
        var fov = 60.0f; //todo
        var aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;
        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (fov / 2.0f)) * 2.0f * 2.0f;
        var hozScale = verScale * aspect;

        gameObject.SetActive(true);

        gameObject.transform.localPosition = new UnityEngine.Vector3(
            ((touch.x / UnityEngine.Screen.width) -0.5f) * hozScale,
            ((touch.y / UnityEngine.Screen.height) -0.5f) * verScale,
            2.0f
            );
        gameObject.transform.localRotation = UnityEngine.Quaternion.Euler(0.0f, 0.0f, (0 == (countArms & 1)) ? 15.0f : -15.0f);
    }


    public void Update(CreatureState creatureState)
    {
        int countArms = 0;

        foreach( CreatureStatePerUpdate.UIElementData uiElementData in creatureState.creatureStatePerUpdate.uiElementDataArray)
        {
            if (uiElementData.uiElement != CreatureStatePerUpdate.TUIElement.Attack)
            {
                continue;
            }
            UnityEngine.GameObject gameObject = GetArmsGameObject(countArms);
            countArms += 1;
            SetupArms(creatureState, countArms, gameObject, uiElementData.touch);
        }

        if (countArms < 1)
        {
            UnityEngine.GameObject gameObject = GetArmsGameObject(countArms);
            countArms += 1;
            SetupArms(creatureState, countArms, gameObject, new UnityEngine.Vector2(UnityEngine.Screen.width * 0.2f, UnityEngine.Screen.height * 0.2f));
        }

        if (countArms < 2)
        {
            UnityEngine.GameObject gameObject = GetArmsGameObject(countArms);
            countArms += 1;
            SetupArms(creatureState, countArms, gameObject, new UnityEngine.Vector2(UnityEngine.Screen.width * 0.8f, UnityEngine.Screen.height * 0.2f));
        }

        for (int index = countArms; index < 2; ++index)
        {
            _armArray[countArms].SetActive(false);
        }

        for (int index = countArms; index < _armArray.Count; ++index)
        {
            _armArray[countArms].SetActive(false);
        }
    }
}
