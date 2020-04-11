public class QuadraticSplineMaterialPropertyBlockComponent : UnityEngine.MonoBehaviour
{
    public UnityEngine.Color color;    //_Color("Color", Color) = (.5, .5, .5, 1)
    public UnityEngine.Vector4 uvScale; //_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
    public UnityEngine.Vector4 p0; //_VecP0("P0", Vector) = (0.0, 0.0, 0.0, 0.0) //x, y, r
    public UnityEngine.Vector4 p1; //_VecP1("P1", Vector) = (0.0, 0.0, 0.0, 0.0)
    public UnityEngine.Vector4 p2; //_VecP2("P2", Vector) = (0.0, 0.0, 0.0, 0.0)

    private UnityEngine.Renderer _renderer;
    private UnityEngine.MaterialPropertyBlock _propBlock;

    void Start()
    {
        _propBlock = new UnityEngine.MaterialPropertyBlock();
        _renderer = GetComponent<UnityEngine.Renderer>();
    }

    public void Update()
    {
        if ((null == _renderer) || (null == _propBlock))
        {
            return;
        }
        _renderer.GetPropertyBlock(_propBlock);
        _propBlock.SetColor("_Color", color);
        _propBlock.SetVector("_UVScale", uvScale);
        _propBlock.SetVector("_PointA", p0);
        _propBlock.SetVector("_PointB", p1);
        _propBlock.SetVector("_PointC", p2);
        _renderer.SetPropertyBlock(_propBlock);
    }
}
