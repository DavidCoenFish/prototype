using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DscRect
{
    private Rect _rect;
    private GUIContent _content;
    private GUIStyle _style;
    private Color _color;

    public static DscRect FactoryScreenQuad()
    {
        GUIStyle style = new GUIStyle();
        style.normal.background = Texture2D.whiteTexture;
        Color color = new Color(0.0f, 0.0f, 0.0f, 1.0f);
        Rect rect = new Rect(0.0f, 0.0f, Screen.width, Screen.height);
        return new DscRect(rect, GUIContent.none, style, color);
    }

    public DscRect(Rect rect, GUIContent content, GUIStyle style, Color color)
    {
        _rect = rect;
        _content = content;
        _style = style;
        _color = color;
    }

    public void SetAlpha(float alpha)
    {
        _color.a = alpha;
    }

    public void Draw()
    {
        GUI.color = _color;
        GUI.Box(_rect, _content, _style);
    }
}
