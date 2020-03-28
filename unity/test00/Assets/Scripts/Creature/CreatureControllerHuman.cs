class CreatureControllerHuman : ICreatureController
{
    private struct TouchData
    {
        public UnityEngine.Vector2 start { get; set; }
        public CreatureStatePerUpdate.TUIElement uiElement { get; set; }
        public float duration { get; set; }
    }
    private System.Collections.Generic.Dictionary<int, TouchData> _touchDataMap = new System.Collections.Generic.Dictionary<int, TouchData>();
    private bool _mouseTouchActive;
    private TouchData _mouseTouchData;

    private TouchData MakeTouchData(UnityEngine.Vector2 position)
    {
        CreatureStatePerUpdate.TUIElement uiElement = CreatureStatePerUpdate.TUIElement.None;
        if (position.x < (UnityEngine.Screen.width * 0.33333f))
        {
            uiElement = CreatureStatePerUpdate.TUIElement.Movement;
        }
        else if ((UnityEngine.Screen.width * 0.66666f) < position.x)
        {
            uiElement = CreatureStatePerUpdate.TUIElement.View;
        }
        else
        {
            uiElement = CreatureStatePerUpdate.TUIElement.Attack;
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
            case CreatureStatePerUpdate.TUIElement.Movement:
                creatureState.creatureStatePerUpdate.inputMove += (normal * inputLength);
                break;
            case CreatureStatePerUpdate.TUIElement.View:
                creatureState.creatureStatePerUpdate.inputView += (normal * inputLength);
                break;
        }
    }

    private float crouchTime = 0.75f;
    private void DealEndTouch(CreatureState creatureState, TouchData touchData)
    { 
        //do we have jump input
        if ((crouchTime < touchData.duration) || (CreatureStatePerUpdate.TUIElement.Movement != touchData.uiElement))
        {
            return;
        }
        var amount = ((touchData.duration / crouchTime) * 2.0f) - 1.0f; //normalise -1 ... 1
        amount *= amount;
        creatureState.creatureStatePerUpdate.jump = 1.0f - amount;
    }

    private void DealCrouch(CreatureState creatureState, TouchData touchData, UnityEngine.Vector2 currentPosition)
    {
        //do we have crouch input
        if (CreatureStatePerUpdate.TUIElement.Movement != touchData.uiElement)
        {
            return;
        }
        var length = (touchData.start - currentPosition).magnitude;
        if (80.0f < length)
        {
            return;
        }
        length /= 80.0f;
        length *= length;
        var factor = 1.0f - length;
        var crouch = UnityEngine.Mathf.Min(1.0f, touchData.duration / crouchTime);
        creatureState.creatureStatePerUpdate.crouch += (crouch * factor);
    }

    public void ApplyInputToState(CreatureState creatureState, float timeDelta)
    {
        if (UnityEngine.Input.GetMouseButton(0))
        {
            var currentPosition = new UnityEngine.Vector2(UnityEngine.Input.mousePosition.x, UnityEngine.Input.mousePosition.y);
            creatureState.creatureStatePerUpdate.touchArray.Add(currentPosition);
            if (false == _mouseTouchActive)
            {
                _mouseTouchData = MakeTouchData(currentPosition);
            }
            else
            {
                _mouseTouchData.duration += timeDelta;
                DealCrouch(creatureState, _mouseTouchData, currentPosition);
            }
            _mouseTouchActive = true;
            creatureState.creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){uiElement=_mouseTouchData.uiElement, position=_mouseTouchData.start });
            AddMoveView(creatureState, _mouseTouchData, currentPosition);
        }
        else
        {
            if (true == _mouseTouchActive)
            {
                DealEndTouch(creatureState, _mouseTouchData);
            }
            _mouseTouchActive = false;
        }

        for (int index = 0; index < UnityEngine.Input.touchCount; ++index)
        {
            var touch = UnityEngine.Input.GetTouch(index);
            //Bootstrap.Log("Input:" + touch.fingerId.ToString());

            creatureState.creatureStatePerUpdate.touchArray.Add(touch.position);

            TouchData touchData;
            if ((touch.phase == UnityEngine.TouchPhase.Began) || (false == _touchDataMap.ContainsKey(touch.fingerId)))
            {
                touchData = MakeTouchData(touch.position);
                _touchDataMap[touch.fingerId] = touchData;
            }
            else if (touch.phase == UnityEngine.TouchPhase.Ended)
            {
                touchData = _touchDataMap[touch.fingerId];
                touchData.duration += touch.deltaTime;
                DealEndTouch(creatureState, touchData);
                continue;
            }
            else
            {
                touchData = _touchDataMap[touch.fingerId];
                touchData.duration += touch.deltaTime;
                DealCrouch(creatureState, touchData, touch.position);
            }
            creatureState.creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){uiElement=touchData.uiElement, position=touchData.start });
            AddMoveView(creatureState, touchData, touch.position);
        }

        //creatureState.moveDelta.x = UnityEngine.Input.GetAxis("Horizontal");
        //creatureState.moveDelta.z = UnityEngine.Input.GetAxis("Vertical");

        creatureState.creatureStatePerUpdate.inputMove.x += UnityEngine.Input.GetAxis("Horizontal");
        creatureState.creatureStatePerUpdate.inputMove.y += UnityEngine.Input.GetAxis("Vertical");
        creatureState.creatureStatePerUpdate.inputView.x += UnityEngine.Input.GetAxis("Horizontal_Alt");
        creatureState.creatureStatePerUpdate.inputView.y += UnityEngine.Input.GetAxis("Vertical_Alt");

        //if (0.0f != creatureState.inputView.x)
        //{
        //    Bootstrap.Log("Horizontal_Alt:" + creatureState.inputView.x.ToString());
        //}

        //
    }
}
