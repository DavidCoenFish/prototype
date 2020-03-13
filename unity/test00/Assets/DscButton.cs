using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//https://forum.unity.com/threads/how-to-create-a-custom-button-class.119427/

public class DscButton
{
    public DscButton(Rect PositionSize, string Content)
    {
        _position = new Vector2(PositionSize.x, PositionSize.y);
        _size = new Vector2(PositionSize.width, PositionSize.height);
        _text = Content;
    }
 
    private Vector2 _position;
    public Vector2 Position
    {
        get
        {
            return _position;
        }
        set
        {
            _position = value;
        }
    }
 
    private Vector2 _size;
    public Vector2 Size
    {
        get
        {
            return _size;
        }
        set
        {
            _size = value;
        }
    }
 
    public Rect PositionSize
    {
        get
        {
            return new Rect(_position.x, _position.y, _size.x, _size.y);
        }
        set
        {
            _position = new Vector2(value.x, value.y);
            _size = new Vector2(value.width, value.height);
        }
    }
 
    private string _text;
    public string Text
    {
        get
        {
            return _text;
        }
        set
        {
            _text = value;
        }
    }
 
    public delegate void ClickEventHandler();
    public event ClickEventHandler OnClick;
 
    public delegate void OnMouseOverEventHandler();
    public event OnMouseOverEventHandler OnMouseOver;
 
    private bool _hover = false;
 
    public void Show()
    {
        if (GUI.Button(new Rect(_position.x, _position.y, _size.x, _size.y), _text))
        {
            if (OnClick != null)
            {
                OnClick();
            }
        }
 
        if (new Rect(_position.x, _position.y, _size.x, _size.y).Contains(new Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y)))
        {
            if (_hover == false)
            {
                if (OnMouseOver != null)
                {
                    OnMouseOver();
                }
                _hover = true;
            }
        }
        else
        {
            _hover = false;
        }
    }
 
}