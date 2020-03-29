using UnityEngine.Assertions.Must;

class CreatureControllerHuman : ICreatureController
{
    private struct TouchData
    {
        public UnityEngine.Vector2 start { get; set; }
        public CreatureStatePerUpdate.TUIElement uiElement { get; set; }
        public float duration { get; set; }
        public bool startedOnAButton { get; set; }
    }
    private System.Collections.Generic.Dictionary<int, TouchData> _touchDataMap = new System.Collections.Generic.Dictionary<int, TouchData>();
    private bool _mouseTouchActive;
    private TouchData _mouseTouchData;
    private System.Collections.Generic.List<bool> _activeWeaponTouch; // = new System.Collections.Generic.List<bool>();

    private readonly static float[] sWeaponUIPositionData = {0.2f, 0.8f, 0.35f, 0.65f, 0.275f, 0.725f, 0.425f, 0.575f, 0.5f };
    public static UnityEngine.Vector2 GetWeaponUIPosition(int index)
    {
        if (8 < index)
        {
            index = 8;
        }
        if (index < 0)
        {
            index = 0;
        }
        return new UnityEngine.Vector2(UnityEngine.Screen.width * sWeaponUIPositionData[index], UnityEngine.Screen.height * 0.2f);
    }
    public static UnityEngine.Rect GetWeaponUIRect(int index)
    {
        var position = GetWeaponUIPosition(index);
        var size = new UnityEngine.Vector2(UnityEngine.Screen.width * 0.15f, UnityEngine.Screen.height * 0.15f); 
        var rect = new UnityEngine.Rect(position - (size * 0.5f), size); 
        return rect;
    }


    private TouchData MakeTouchData(UnityEngine.Vector2 position, CreatureState creatureState)
    {
        CreatureStatePerUpdate.TUIElement uiElement = CreatureStatePerUpdate.TUIElement.None;
        if (position.x < (UnityEngine.Screen.width * 0.25f))
        {
            uiElement = CreatureStatePerUpdate.TUIElement.Movement;
        }
        else if ((UnityEngine.Screen.width * 0.75f) < position.x)
        {
            uiElement = CreatureStatePerUpdate.TUIElement.View;
        }
        else
        {
            uiElement = CreatureStatePerUpdate.TUIElement.Arm;
        }
        return new TouchData(){start=position, uiElement=uiElement};
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
                creatureState.creatureStatePerUpdate.inputView += new UnityEngine.Vector2(
                    normal.x * UnityEngine.Mathf.Min(length * 2.0f, 1.0f),
                    normal.y * length * 2.0f
                    );
                break;
        }
    }

    private float crouchTime = 0.3f;
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
        //var crouch = UnityEngine.Mathf.Min(1.0f, touchData.duration / crouchTime);
        creatureState.creatureStatePerUpdate.crouch += factor; // (crouch * factor);
    }

    private void DealWeapons(CreatureState creatureState)
    {
        int handsAdded = 0;
        for (int index = 0; index < creatureState.weaponArray.Count; ++index)
        {
            var position = GetWeaponUIPosition(index);
            creatureState.creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){
                uiElement=CreatureStatePerUpdate.TUIElement.ArmHold, 
                position=position,
                touch=position
            });
            handsAdded += 1;
        }
    }

    private void DealWeaponsPostTouch(CreatureState creatureState)
    {
        int handsAdded = 0;
        int handsAvaliable = 2;
        foreach (CreatureStatePerUpdate.UIElementData uiElementData in creatureState.creatureStatePerUpdate.uiElementDataArray)
        {
            switch(uiElementData.uiElement)
            {
                default:
                    break;
                case CreatureStatePerUpdate.TUIElement.Arm:
                    handsAvaliable -= 1;
                    break;
                case CreatureStatePerUpdate.TUIElement.ArmHold:
                case CreatureStatePerUpdate.TUIElement.ArmSwing:
                case CreatureStatePerUpdate.TUIElement.ArmShoot:
                    handsAdded += 1;
                    break;
            }
        }
        for (int index = handsAdded; index < handsAvaliable; ++index)
        {
            var position = GetWeaponUIPosition(index);
            creatureState.creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){
                uiElement=CreatureStatePerUpdate.TUIElement.ArmIdle, 
                position=position,
                touch=position
            });
        }
    }

    public void ApplyInputToState(CreatureState creatureState, float timeDelta)
    {
        DealWeapons(creatureState);

        if (UnityEngine.Input.GetMouseButton(0))
        {
            var currentPosition = new UnityEngine.Vector2(UnityEngine.Input.mousePosition.x, UnityEngine.Input.mousePosition.y);
            creatureState.creatureStatePerUpdate.touchArray.Add(currentPosition);
            if (false == _mouseTouchActive)
            {
                _mouseTouchData = MakeTouchData(currentPosition, creatureState);
            }
            else
            {
                _mouseTouchData.duration += timeDelta;
                DealCrouch(creatureState, _mouseTouchData, currentPosition);
            }
            _mouseTouchActive = true;
            creatureState.creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){
                uiElement=_mouseTouchData.uiElement, 
                position=_mouseTouchData.start, 
                touch=currentPosition 
            });
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
                touchData = MakeTouchData(touch.position, creatureState);
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
            creatureState.creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){
                uiElement=touchData.uiElement, 
                position=touchData.start, 
                touch=touch.position 
            });
            AddMoveView(creatureState, touchData, touch.position);
        }

        creatureState.creatureStatePerUpdate.inputMove.x += UnityEngine.Input.GetAxis("Horizontal");
        creatureState.creatureStatePerUpdate.inputMove.y += UnityEngine.Input.GetAxis("Vertical");
        creatureState.creatureStatePerUpdate.inputView.x += UnityEngine.Input.GetAxis("Horizontal_Alt");
        creatureState.creatureStatePerUpdate.inputView.y += UnityEngine.Input.GetAxis("Vertical_Alt");

        DealWeaponsPostTouch(creatureState);

    }
}
