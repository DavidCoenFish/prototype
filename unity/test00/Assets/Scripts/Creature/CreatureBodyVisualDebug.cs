public class CreatureBodyVisualDebug
{
    private int _activeCount;
    private UnityEngine.Mesh _mesh;
    private UnityEngine.Material _material;

    private class Data
    {
        public UnityEngine.GameObject gameObject;
    };
    private System.Collections.Generic.List< Data > _dataArray;

    public CreatureBodyVisualDebug()
    {
        _dataArray = new System.Collections.Generic.List< Data >();
        _material = new UnityEngine.Material(UnityEngine.Shader.Find("Diffuse"));

        var gOSphere = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
        var meshFilter = gOSphere.GetComponent< UnityEngine.MeshFilter >();
        _mesh = meshFilter.mesh;
        UnityEngine.Object.Destroy(gOSphere);
    }

    private Data GetFreeData()
    {
        Data data = null;
        if (_dataArray.Count <= _activeCount)
        {
            data = new Data();
            data.gameObject = new UnityEngine.GameObject("debugSphere");
            var meshFilter = data.gameObject.AddComponent< UnityEngine.MeshFilter >();
            meshFilter.mesh = _mesh;
            var meshRenderer = data.gameObject.AddComponent< UnityEngine.MeshRenderer >();
            meshRenderer.material = _material;
            _dataArray.Add(data);
        }
        else
        {
            data = _dataArray[_activeCount];
        }
        return data;
    }

    public void Update(CreatureState creatureState, UnityEngine.Transform parentTransform)
    {
        foreach( Data data in _dataArray)
        {
            data.gameObject.SetActive(false);
        }
        _activeCount = 0;

        foreach( var sphere in creatureState.creatureStateBody.debugSphereDataArray)
        {
            Data data = GetFreeData();
            data.gameObject.transform.parent = parentTransform;
            data.gameObject.SetActive(true);
            _activeCount += 1;

            data.gameObject.transform.position = sphere.m_pos;
            data.gameObject.transform.localScale = new UnityEngine.Vector3(sphere.m_radius, sphere.m_radius, sphere.m_radius);
        }
    }
}
