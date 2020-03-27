class CreatureControllerHuman : ICreatureController
{
    private struct TouchData
    {
        public UnityEngine.Vector2 start { get; set; }
        public CreatureState.TUIElement uiElement { get; set; }
    }
    private System.Collections.Generic.Dictionary<int, TouchData> _touchDataMap = new System.Collections.Generic.Dictionary<int, TouchData>();
    private bool _mouseTouchActive;
    private TouchData _mouseTouchData;

    private TouchData MakeTouchData(UnityEngine.Vector2 position)
    {
        CreatureState.TUIElement uiElement = CreatureState.TUIElement.None;
        if (position.x < (UnityEngine.Screen.width * 0.33333f))
        {
            uiElement = CreatureState.TUIElement.Movement;
        }
        else if ((UnityEngine.Screen.width * 0.66666f) < position.x)
        {
            uiElement = CreatureState.TUIElement.View;
        }
        else
        {
            uiElement = CreatureState.TUIElement.Attack;
        }
        return new TouchData(){start=position, uiElement=uiElement };
    }

    private void AddMoveView(CreatureState creatureState, TouchData touchData, UnityEngine.Vector2 currentPosition)
    {
        var offset = (currentPosition - touchData.start) / 100.0f;
        var length = offset.magnitude;
        if (UnityEngine.Mathf.Approximately(0.0f, length))
        {
            return;
        }
        var normal = offset / length;
        var inputLength = UnityEngine.Mathf.Min(length, 1.0f) * 0.25f;

        switch(touchData.uiElement)
        {
            default:
                break;
            case CreatureState.TUIElement.Movement:
                creatureState.inputMove += (normal * inputLength);
                break;
            case CreatureState.TUIElement.View:
                creatureState.inputView += (normal * inputLength);
                break;
        }
    }

    public void ApplyInputToState(CreatureState creatureState)
    {
        creatureState.inputMove.x = 0.0f;
        creatureState.inputMove.y = 0.0f;
        creatureState.inputView.x = 0.0f;
        creatureState.inputView.y = 0.0f;
        creatureState.touchArray.Clear();
        creatureState.uiElementDataArray.Clear();
        if (UnityEngine.Input.GetMouseButton(0))
        {
            var currentPosition = new UnityEngine.Vector2(UnityEngine.Input.mousePosition.x, UnityEngine.Input.mousePosition.y);
            creatureState.touchArray.Add(currentPosition);
            if (false == _mouseTouchActive)
            {
                _mouseTouchData = MakeTouchData(currentPosition);
            }
            _mouseTouchActive = true;
            creatureState.uiElementDataArray.Add(new CreatureState.UIElementData(){uiElement=_mouseTouchData.uiElement, position=_mouseTouchData.start });
            AddMoveView(creatureState, _mouseTouchData, currentPosition);
        }
        else
        {
            _mouseTouchActive = false;
        }

        for (int index = 0; index < UnityEngine.Input.touchCount; ++index)
        {
            var touch = UnityEngine.Input.GetTouch(index);
            //Bootstrap.Log("Input:" + touch.fingerId.ToString());

            creatureState.touchArray.Add(touch.position);

            TouchData touchData;
            if ((touch.phase == UnityEngine.TouchPhase.Began) || (false == _touchDataMap.ContainsKey(touch.fingerId)))
            {
                touchData = MakeTouchData(touch.position);
                _touchDataMap[touch.fingerId] = touchData;
            }
            else
            {
                touchData = _touchDataMap[touch.fingerId];
            }
            creatureState.uiElementDataArray.Add(new CreatureState.UIElementData(){uiElement=touchData.uiElement, position=touchData.start });
            AddMoveView(creatureState, touchData, touch.position);
        }

        //creatureState.moveDelta.x = UnityEngine.Input.GetAxis("Horizontal");
        //creatureState.moveDelta.z = UnityEngine.Input.GetAxis("Vertical");

        creatureState.inputMove.x += UnityEngine.Input.GetAxis("Horizontal");
        creatureState.inputMove.y += UnityEngine.Input.GetAxis("Vertical");
        creatureState.inputView.x += UnityEngine.Input.GetAxis("Horizontal_Alt");
        creatureState.inputView.y += UnityEngine.Input.GetAxis("Vertical_Alt");

        //if (0.0f != creatureState.inputView.x)
        //{
        //    Bootstrap.Log("Horizontal_Alt:" + creatureState.inputView.x.ToString());
        //}

        //
    }
}
