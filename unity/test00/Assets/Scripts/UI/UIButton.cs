//https://forum.unity.com/threads/how-to-create-a-custom-button-class.119427/

public class UIButton : IUIElement
{
    public delegate void ClickEventHandler();

    public static IDagNodeValue< UnityEngine.Rect > FactoryRect(float left, float top, float width, float height)
    {
        DagNodeValue< UnityEngine.Rect > dagRect = new DagNodeValue< UnityEngine.Rect >( new UnityEngine.Rect(left, top, width, height));
        return dagRect;
    }

    public static UIButton FactoryButton(IDagNodeValue< UnityEngine.Rect > dagRect, string localeKey, int depth, ClickEventHandler onClick)
    {
        DagNodeValue< int > dagDepth = new DagNodeValue< int >(depth);

        UnityEngine.GUIStyle style = new UnityEngine.GUIStyle();
        style.normal.background = UnityEngine.Texture2D.whiteTexture;
        UnityEngine.Texture2D texture = new UnityEngine.Texture2D(1,1);
        texture.SetPixel(0,0, new UnityEngine.Color(0.9f, 0.9f, 0.9f, 1.0f));
        texture.Apply();
        style.hover.background = texture;
        DagNodeValue< UnityEngine.GUIStyle > dagStyle = new DagNodeValue< UnityEngine.GUIStyle >(style);
        DagGUIContent dagGUIContent = DagGUIContent.FactoryLocale(localeKey);

        return new UIButton(dagRect, dagGUIContent, dagStyle, dagDepth, onClick);
    }

    private IDagNodeValue< UnityEngine.Rect > _dagRect;
    private IDagNodeValue< UnityEngine.GUIContent > _dagGUIContent;
    private IDagNodeValue< UnityEngine.GUIStyle > _dagGUIStyle;
    private IDagNodeValue< int > _dagDepth;
    private event ClickEventHandler _onClick;

    public UIButton(
        IDagNodeValue< UnityEngine.Rect > dagRect,
        IDagNodeValue< UnityEngine.GUIContent > dagGUIContent,
        IDagNodeValue< UnityEngine.GUIStyle > dagGUIStyle,
        IDagNodeValue< int > dagDepth,
        ClickEventHandler onClick
        )
    {
        _dagRect = dagRect;
        _dagGUIContent = dagGUIContent;
        _dagGUIStyle = dagGUIStyle;
        _dagDepth = dagDepth;
        _onClick = onClick;
    }

    //void IUIElement.Draw()
    public void Draw()
    {
        UnityEngine.GUI.depth = _dagDepth.GetValue();
        //Application.Instance.Log("UIButton.Draw()");
        if (UnityEngine.GUI.Button(_dagRect.GetValue(), _dagGUIContent.GetValue(), _dagGUIStyle.GetValue()))
        {
            if (null != _onClick)
            {
                _onClick();
            }
        }
    } 
}