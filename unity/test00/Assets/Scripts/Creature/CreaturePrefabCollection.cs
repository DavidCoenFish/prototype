public class CreaturePrefabCollection
{
    private UnityEngine.GameObject _prefab = null;
    private int _activeCount;
    private System.Collections.Generic.List< UnityEngine.GameObject > _array;

    public CreaturePrefabCollection(string resourceName)
    {
        _prefab = UnityEngine.Resources.Load<UnityEngine.GameObject>(resourceName);
        _array = new System.Collections.Generic.List< UnityEngine.GameObject >();
    }
    public void Clear()
    {
        foreach( UnityEngine.GameObject gameObject in _array)
        {
            gameObject.SetActive(false);
        }
        _activeCount = 0;
    }
    public void Request(UnityEngine.Transform parentTransform, CreatureStatePerUpdate.HandPoseData handPoseData)
    {
        UnityEngine.GameObject gameObject = null;
        if (_array.Count <= _activeCount)
        {
            gameObject = UnityEngine.Object.Instantiate(_prefab);
            _array.Add(gameObject);
        }
        else
        {
            gameObject = _array[_activeCount];
        }
        _activeCount += 1;

        var fov = 60.0f; //todo
        var aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;
        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (fov / 2.0f)) * 2.0f * 2.0f;
        var hozScale = verScale * aspect;

        gameObject.transform.parent = parentTransform;

        gameObject.SetActive(true);
        gameObject.transform.localPosition = new UnityEngine.Vector3(
            ((handPoseData.position.x / UnityEngine.Screen.width) -0.5f) * hozScale,
            ((handPoseData.position.y / UnityEngine.Screen.height) -0.5f) * verScale,
            2.0f
            );
        var rotY = (((handPoseData.position.x / UnityEngine.Screen.width) - 0.5f) * 2.0f);
        switch (handPoseData.handPose)
        {
            default:
                rotY *= -15.0f;
                break;
            case CreatureStatePerUpdate.THandPose.Swing:
                rotY *= 30.0f;
                break;
        }
        gameObject.transform.localRotation = UnityEngine.Quaternion.Euler(0.0f, rotY, 0.0f);
        gameObject.transform.localScale = UnityEngine.Vector3.one;
    }
}
