public class CreatureFaceRatShaderPropertyBlock : UnityEngine.MonoBehaviour
{
    public UnityEngine.Color colorSkin;
    public UnityEngine.Color colorDetail;
    public UnityEngine.Vector4 uvScale; //_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
    public UnityEngine.Vector4 p0; //_VecP0("P0", Vector) = (0.0, 0.0, 0.0, 0.0) //x, y, r
    public UnityEngine.Vector4 forwardUp;
    public UnityEngine.Vector4 rightData;
    public UnityEngine.Vector4 data0;
    public UnityEngine.Vector4 data1;

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
        _propBlock.SetColor("_ColorSkin", colorSkin);
       // _propBlock.SetColor("_ColorDetail", colorDetail);
        _propBlock.SetVector("_UVScale", uvScale);
        _propBlock.SetVector("_PointA", p0);
        _propBlock.SetVector("_ForwardUp", forwardUp);
       // _propBlock.SetVector("_RightData", rightData);
       // _propBlock.SetVector("_Data0", data0);
       // _propBlock.SetVector("_Data1", data1);
        _renderer.SetPropertyBlock(_propBlock);
    }
}
