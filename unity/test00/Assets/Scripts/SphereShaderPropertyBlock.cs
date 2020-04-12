public class SphereShaderPropertyBlock : UnityEngine.MonoBehaviour
{
    public UnityEngine.Color color;    //_Color("Color", Color) = (.5, .5, .5, 1)
    public UnityEngine.Vector4 uvScale; //_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
    public UnityEngine.Vector4 p0; //_VecP0("P0", Vector) = (0.0, 0.0, 0.0, 0.0) //x, y, r

    private UnityEngine.Renderer _renderer;
    private UnityEngine.MaterialPropertyBlock _propBlock;

    void Start()
    {
        _propBlock = new UnityEngine.MaterialPropertyBlock();
        _renderer = GetComponent<UnityEngine.Renderer>();
    }

    public void ManualUpdate()
    {
        if ((null == _renderer) || (null == _propBlock))
        {
            return;
        }
        _renderer.GetPropertyBlock(_propBlock);
        _propBlock.SetColor("_Color", color);
        _propBlock.SetVector("_UVScale", uvScale);
        _propBlock.SetVector("_PointA", p0);
        _renderer.SetPropertyBlock(_propBlock);
    }
}
