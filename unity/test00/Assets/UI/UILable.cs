public class UILable : IUIElement
{
    public static UILable FactoryVersion(int depth)
    {
        DagNodeValue< int > dagDepth = new DagNodeValue< int >(depth);
        DagNodeValue< UnityEngine.Rect > dagRect = new DagNodeValue< UnityEngine.Rect >( new UnityEngine.Rect(UnityEngine.Screen.width - 200.0f, UnityEngine.Screen.height - 50.0f, 200.0f, 50.0f));

        UnityEngine.GUIStyle style = new UnityEngine.GUIStyle();
        //style.normal.background = UnityEngine.Texture2D.whiteTexture;
        DagNodeValue< UnityEngine.GUIStyle > dagStyle = new DagNodeValue< UnityEngine.GUIStyle >(style);

        DagGUIContent dagGUIContent = DagGUIContent.FactoryLocaleVersion();
        return new UILable(dagRect, dagGUIContent, dagStyle, dagDepth);
    }

    private IDagNodeValue< UnityEngine.Rect > _dagRect;
    private IDagNodeValue< UnityEngine.GUIContent > _dagGUIContent;
    private IDagNodeValue< UnityEngine.GUIStyle > _dagGUIStyle;
    private IDagNodeValue< int > _dagDepth;

    public UILable(
        IDagNodeValue< UnityEngine.Rect > dagRect,
        IDagNodeValue< UnityEngine.GUIContent > dagGUIContent,
        IDagNodeValue< UnityEngine.GUIStyle > dagGUIStyle,
        IDagNodeValue< int > dagDepth
        )
    {
        _dagRect = dagRect;
        _dagGUIContent = dagGUIContent;
        _dagGUIStyle = dagGUIStyle;
        _dagDepth = dagDepth;
    }

    //void IUIElement.Draw()
    public void Draw()
    {
        UnityEngine.GUI.depth = _dagDepth.GetValue();
        UnityEngine.GUI.Label(_dagRect.GetValue(), _dagGUIContent.GetValue(), _dagGUIStyle.GetValue());
    }
}
