public class CreatureFaceShaderPropertyBlock : UnityEngine.MonoBehaviour
{
    public UnityEngine.Color colorA;
    public UnityEngine.Vector4 uvScale; //_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
    public UnityEngine.Vector4 eye0; //_VecP0("Eye0", Vector) = (0.0, 0.0, 0.0, 0.0) //x, y, rx, ry
    public UnityEngine.Vector4 eyeBrow0; //_VecP0("EyeBrow0", Vector) = (0.0, 0.0, 0.0, 0.0) //ax, ay, bx, by
    public UnityEngine.Vector4 eye1; //_VecP0("Eye1", Vector) = (0.0, 0.0, 0.0, 0.0) //x, y, rx, ry
    public UnityEngine.Vector4 eyeBrow1; //_VecP0("EyeBrow1", Vector) = (0.0, 0.0, 0.0, 0.0) //ax, ay, bx, by
    public UnityEngine.Vector4 data0; //_VecP0("Data0", Vector) = (0.0, 0.0, 0.0, 0.0) //upx, upy, eyebrow thickA, eyebrow thickB 


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
        _propBlock.SetColor("_ColorA", colorA);
        _propBlock.SetVector("_UVScale", uvScale);

        _propBlock.SetVector("_Eye0", eye0);
        _propBlock.SetVector("_EyeBrow0", eyeBrow0);
        _propBlock.SetVector("_Eye1", eye1);
        _propBlock.SetVector("_EyeBrow1", eyeBrow1);
        _propBlock.SetVector("_Data0", data0);

        _renderer.SetPropertyBlock(_propBlock);
    }
}
