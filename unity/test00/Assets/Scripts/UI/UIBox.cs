public class UIBox : IUIElement
{
    public static UIBox FactoryScreenQuad(int depth)
    {
        UnityEngine.GUIStyle style = new UnityEngine.GUIStyle();
        style.normal.background = UnityEngine.Texture2D.whiteTexture;
        UnityEngine.Color color = new UnityEngine.Color(0.0f, 0.0f, 0.0f, 1.0f);
        UnityEngine.Rect rect = new UnityEngine.Rect(0.0f, 0.0f, UnityEngine.Screen.width, UnityEngine.Screen.height);
        return new UIBox(rect, UnityEngine.GUIContent.none, style, color, depth);
    }

    private UnityEngine.Rect _rect;
    private UnityEngine.GUIContent _content;
    private UnityEngine.GUIStyle _style;
    private UnityEngine.Color _color;
    private int _depth;

    public UIBox(UnityEngine.Rect rect, UnityEngine.GUIContent content, UnityEngine.GUIStyle style, UnityEngine.Color color, int depth)
    {
        _rect = rect;
        _content = content;
        _style = style;
        _color = color;
        _depth = depth;
    }

    public void SetAlpha(float alpha)
    {
        _color.a = alpha;
    }

    //void IUIElement.Draw()
    public void Draw()
    {
        UnityEngine.GUI.depth = _depth;
        UnityEngine.GUI.color = _color;
        UnityEngine.GUI.Box(_rect, _content, _style);
    }

}
