public class CreatureScreenSpace
{
    private class PrefabCollection
    {
        private UnityEngine.GameObject _prefab = null;
        private int _activeCount;
        private System.Collections.Generic.List< UnityEngine.GameObject > _array;
        public PrefabCollection(string resourceName)
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
        public void Request(UnityEngine.Transform parentTransform, UnityEngine.Vector2 touch)
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
                ((touch.x / UnityEngine.Screen.width) -0.5f) * hozScale,
                ((touch.y / UnityEngine.Screen.height) -0.5f) * verScale,
                2.0f
                );
            gameObject.transform.localRotation = UnityEngine.Quaternion.Euler(0.0f, (0 == (_activeCount & 1)) ? 15.0f : -15.0f, 0.0f);
            gameObject.transform.localScale = UnityEngine.Vector3.one;
        }
    }

    private PrefabCollection _prefabCollectionArm;
    private PrefabCollection _prefabCollectionArmHold;
    private PrefabCollection _prefabCollectionArmSwing;
    private PrefabCollection _prefabCollectionArmShoot;

    public CreatureScreenSpace()
    {
        _prefabCollectionArm = new PrefabCollection("prefab/arm");
        _prefabCollectionArmHold = new PrefabCollection("prefab/armhold");
        _prefabCollectionArmSwing = new PrefabCollection("prefab/armswing");
        _prefabCollectionArmShoot = new PrefabCollection("prefab/armshoot");
    }

    public void Update(CreatureState creatureState, UnityEngine.Transform parentTransform)
    {
        _prefabCollectionArm.Clear();
        _prefabCollectionArmHold.Clear();
        _prefabCollectionArmSwing.Clear();
        _prefabCollectionArmShoot.Clear();

        foreach( CreatureStatePerUpdate.UIElementData uiElementData in creatureState.creatureStatePerUpdate.uiElementDataArray)
        {
            switch (uiElementData.uiElement)
            {
                default:
                    break;
                case CreatureStatePerUpdate.TUIElement.Arm:
                    _prefabCollectionArm.Request(parentTransform, uiElementData.touch);
                    break;
                case CreatureStatePerUpdate.TUIElement.ArmIdle:
                    _prefabCollectionArm.Request(parentTransform, uiElementData.position);
                    break;
                case CreatureStatePerUpdate.TUIElement.ArmHold:
                    _prefabCollectionArmHold.Request(parentTransform, uiElementData.position);
                    break;
                case CreatureStatePerUpdate.TUIElement.ArmShoot:
                    _prefabCollectionArmShoot.Request(parentTransform, uiElementData.touch);
                    break;
                case CreatureStatePerUpdate.TUIElement.ArmSwing:
                    _prefabCollectionArmSwing.Request(parentTransform, uiElementData.touch);
                    break;
            }
            //SetupArms(creatureState, countArms, gameObject, new UnityEngine.Vector2(UnityEngine.Screen.width * 0.2f, UnityEngine.Screen.height * 0.2f));
            //SetupArms(creatureState, countArms, gameObject, new UnityEngine.Vector2(UnityEngine.Screen.width * 0.8f, UnityEngine.Screen.height * 0.2f));
        }
    }
}
