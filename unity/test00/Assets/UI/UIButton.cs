//https://forum.unity.com/threads/how-to-create-a-custom-button-class.119427/

public class UIButton : IUIElement
{
    public delegate void ClickEventHandler();

//public static bool Button(Rect position, GUIContent content, GUIStyle style);
    public static UIButton FactoryButton(int depth)
    {
        UnityEngine.GUIStyle style = new UnityEngine.GUIStyle();
        style.normal.background = UnityEngine.Texture2D.whiteTexture;
        UnityEngine.GUIContent guiContent = new UnityEngine.GUIContent();
        guiContent.text = "this is a test";
        UnityEngine.Rect rect = new UnityEngine.Rect((UnityEngine.Screen.width * 0.5f) - 50.0f, (UnityEngine.Screen.height * 0.5f) - 50.0f, 100.0f, 100.0f);
        return new UIButton(rect, guiContent, style, null, depth);
    }

    private UnityEngine.Rect _rect;
    private UnityEngine.GUIContent _content;
    private UnityEngine.GUIStyle _style;
    private event ClickEventHandler _onClick;
    private int _depth;

    public UIButton(UnityEngine.Rect rect, UnityEngine.GUIContent content, UnityEngine.GUIStyle style, ClickEventHandler onClick, int depth)
    {
        _rect = rect;
        _content = content;
        _style = style;
        _onClick = onClick;
        _depth = depth;
    }

    //void IUIElement.Draw()
    public void Draw()
    {
        UnityEngine.GUI.depth = _depth;
        //Application.Instance.Log("UIButton.Draw()");
        if (UnityEngine.GUI.Button(_rect, _content, _style))
        {
            if (null != _onClick)
            {
                _onClick();
            }
        }
    } 
}