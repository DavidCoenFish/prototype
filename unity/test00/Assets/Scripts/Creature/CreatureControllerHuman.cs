using UnityEngine;
using UnityEngine.Assertions.Must;

class CreatureControllerHuman : ICreatureController
{
    private struct TouchData
    {
        public UnityEngine.Vector2 start { get; set; }
        public float duration { get; set; }
    }
    private System.Collections.Generic.Dictionary<int, TouchData> _touchDataMap = new System.Collections.Generic.Dictionary<int, TouchData>();
    private bool _mouseTouchActive;
    private TouchData _mouseTouchData;

    //each frame, for each weapon that the creature state has, make a button. 
    // we then check if any touch started from the button, and buttons not in use have hand pos
    // hands not in use have hand pos
    private struct WeaponUIData
    {
        public UnityEngine.Vector2 position { get; set; }
        public UnityEngine.Rect rect { get; set; }
        public bool clickedOn { get; set; }
    }
    private System.Collections.Generic.List< WeaponUIData > _weaponUIDataArray = new System.Collections.Generic.List< WeaponUIData >();

    private readonly static float[] sWeaponUIPositionData = {0.2f, 0.8f, 0.35f, 0.65f, 0.275f, 0.725f, 0.425f, 0.575f, 0.5f };
    private static UnityEngine.Vector2 GetWeaponUIPosition(int index)
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
    private static UnityEngine.Rect GetWeaponUIRect(UnityEngine.Vector2 position)
    {
        float minScreen = UnityEngine.Mathf.Min((float)UnityEngine.Screen.width, (float)UnityEngine.Screen.height);
        var sizeDim = (minScreen * 0.15f);
        var size = new UnityEngine.Vector2(sizeDim, sizeDim); 
        var rect = new UnityEngine.Rect(position - (size * 0.5f), size); 
        return rect;
    }

    private TouchData MakeTouchData(UnityEngine.Vector2 position, CreatureState creatureState)
    {
        //are we over an exisiting button
        //for (int index = 0; index < creatureState.CreatureStateHud.uiElementDataArray.Count; ++index)
        //{
        //    var rect = GetWeaponUIRect(uiElementData.position);
        //    if (rect.Contains(position))
        //    {
        //    }
        //}

        return new TouchData(){start=position};
    }

    private void AddMoveView(CreatureState creatureState, TouchData touchData, UnityEngine.Vector2 currentPosition, CreatureStateHud.TUIElement uiElement)
    {
        var offset = (currentPosition - touchData.start) / 100.0f;
        var length = offset.magnitude;
        if (UnityEngine.Mathf.Approximately(0.0f, length))
        {
            return;
        }
        var normal = offset / length;
        var inputLength = UnityEngine.Mathf.Min(length, 1.0f) * 0.25f;

        switch(uiElement)
        {
            default:
                break;
            case CreatureStateHud.TUIElement.Movement:
                creatureState.creatureStateInput.inputMove += (normal * inputLength);
                break;
            case CreatureStateHud.TUIElement.View:
                creatureState.creatureStateInput.inputView += new UnityEngine.Vector2(
                    normal.x * UnityEngine.Mathf.Min(length * 2.0f, 1.0f),
                    normal.y * length * 2.0f
                    );
                break;
        }
    }

    private float crouchTime = 0.3f;
    private void DealEndTouch(CreatureState creatureState, TouchData touchData, CreatureStateHud.TUIElement uiElement)
    { 
        //do we have jump input
        if ((crouchTime < touchData.duration) || (CreatureStateHud.TUIElement.Movement != uiElement))
        {
            return;
        }
        var amount = ((touchData.duration / crouchTime) * 2.0f) - 1.0f; //normalise -1 ... 1
        amount *= amount;
        creatureState.creatureStateInput.jump = 1.0f - amount;
    }

    private void DealCrouch(CreatureState creatureState, TouchData touchData, UnityEngine.Vector2 currentPosition, CreatureStateHud.TUIElement uiElement)
    {
        //do we have crouch input
        if (CreatureStateHud.TUIElement.Movement != uiElement)
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
        creatureState.creatureStateInput.crouch += factor; // (crouch * factor);
    }

    private void MakeUIElementsForWeapons(CreatureState creatureState)
    {
        _weaponUIDataArray = new System.Collections.Generic.List<WeaponUIData>();
        int trace = 0;
        foreach( CreatureState.WeaponData weaponData in creatureState.weaponArray)
        {
            var position = GetWeaponUIPosition(trace);
            var rect = GetWeaponUIRect(position);
            _weaponUIDataArray.Add(new WeaponUIData(){
                clickedOn=false,
                position=position,
                rect=rect
            });
            trace += 1;
        }
    }


    private void MakeUIElementsForPickup(CreatureState creatureState, UnityEngine.Transform cameraTransform)
    {
        var fov = 60.0f; //todo
        var aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;
        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (fov / 2.0f));
        var hozScale = verScale * aspect;

        //make a button for every pickup object in range
        UnityEngine.Ray ray = new UnityEngine.Ray(cameraTransform.position, cameraTransform.forward); //new { };
        var listArray = UnityEngine.Physics.SphereCastAll(ray, creatureState.creatureStateBody.height * 3.0f, 0.0f);
        foreach (UnityEngine.RaycastHit raycastHit in listArray)
        {
            var pickupComponent = raycastHit.collider.gameObject.GetComponent<PickupComponent>();
            if (null == pickupComponent)
            {
                continue;
            }
            var offset = raycastHit.collider.gameObject.transform.position - cameraTransform.position;
            var distance = UnityEngine.Vector3.Dot(cameraTransform.forward, offset);
            if (distance < (0.01f * creatureState.creatureStateBody.height))
            {
                continue;
            }

            var x = ((((UnityEngine.Vector3.Dot(cameraTransform.right, offset) / distance) / hozScale) * 0.5f) + 0.5f);
            var y = ((((UnityEngine.Vector3.Dot(cameraTransform.up, offset) / distance) / verScale) * 0.5f) + 0.5f);

            creatureState.creatureStateHud.uiElementDataArray.Add(new CreatureStateHud.UIElementData(){
                position = new UnityEngine.Vector2(x * UnityEngine.Screen.width, y * UnityEngine.Screen.height),
                uiElement = CreatureStateHud.TUIElement.Pickup,
                gameObject = raycastHit.collider.gameObject
            });
        }
    }

    private CreatureStateHud.TUIElement GetElementForTouch(TouchData touchData, CreatureState creatureState, UnityEngine.Vector2 currentPosition)
    {
        for (int index = 0; index < _weaponUIDataArray.Count; ++index)
        {
            WeaponUIData weaponUIData = _weaponUIDataArray[index];
            if ((false == weaponUIData.clickedOn) && (weaponUIData.rect.Contains(touchData.start)))
            {
                CreatureStateHud.THandPose pose = CreatureStateHud.THandPose.Swing;
                var distance = (currentPosition - touchData.start).magnitude;
                var position=currentPosition;
                if (distance < weaponUIData.rect.width * 0.5f)
                {
                    pose = CreatureStateHud.THandPose.Shoot;
                    position = new UnityEngine.Vector2(UnityEngine.Screen.width * 0.5f, UnityEngine.Screen.height * 0.5f)
                        + (currentPosition - touchData.start);
                }
                creatureState.creatureStateHud.handPoseArray.Add(new CreatureStateHud.HandPoseData(){
                    handPose=pose,
                    position=position
                });
                weaponUIData.clickedOn = true;
                _weaponUIDataArray[index] = weaponUIData;
                return CreatureStateHud.TUIElement.None;
            }
        }

        //dont start a move/ hand action if click was on 
        foreach (CreatureStateHud.UIElementData uiElementData in creatureState.creatureStateHud.uiElementDataArray)
        {
            //uiElementData.r
            var rect = CreatureHud2D.UIPositionToRect(uiElementData.position);
            if (rect.Contains(touchData.start))
            {
                return CreatureStateHud.TUIElement.None;
            }
        }

        CreatureStateHud.TUIElement uiElement = CreatureStateHud.TUIElement.None;
        if (touchData.start.x < (UnityEngine.Screen.width * 0.25f))
        {
            uiElement = CreatureStateHud.TUIElement.Movement;
        }
        else if ((UnityEngine.Screen.width * 0.75f) < touchData.start.x)
        {
            uiElement = CreatureStateHud.TUIElement.View;
        }
        else
        {
            uiElement = CreatureStateHud.TUIElement.None;
            creatureState.creatureStateHud.handPoseArray.Add(new CreatureStateHud.HandPoseData(){
                handPose=CreatureStateHud.THandPose.Empty,
                position=currentPosition
            });

        }
        return uiElement;
    }

    private void DealMouse(CreatureState creatureState, float timeDelta)
    {
        var currentPosition = new UnityEngine.Vector2(UnityEngine.Input.mousePosition.x, UnityEngine.Input.mousePosition.y);
        if (UnityEngine.Input.GetMouseButton(0))
        {
            creatureState.creatureStateHud.touchArray.Add(currentPosition);
            if (false == _mouseTouchActive)
            {
                _mouseTouchData = MakeTouchData(currentPosition, creatureState);
            }
            else
            {
                _mouseTouchData.duration += timeDelta;
            }
            _mouseTouchActive = true;
            var uiElement = GetElementForTouch(_mouseTouchData, creatureState, currentPosition);
            DealCrouch(creatureState, _mouseTouchData, currentPosition, uiElement);
            creatureState.creatureStateHud.uiElementDataArray.Add(new CreatureStateHud.UIElementData(){
                uiElement=uiElement,
                position=_mouseTouchData.start
            });
            AddMoveView(creatureState, _mouseTouchData, currentPosition, uiElement);
        }
        else
        {
            if (true == _mouseTouchActive)
            {
                var uiElement = GetElementForTouch(_mouseTouchData, creatureState, currentPosition);
                DealEndTouch(creatureState, _mouseTouchData, uiElement);
            }
            _mouseTouchActive = false;
        }
    }

    private void DealTouch(CreatureState creatureState, float timeDelta)
    {
        for (int index = 0; index < UnityEngine.Input.touchCount; ++index)
        {
            var touch = UnityEngine.Input.GetTouch(index);
            //Bootstrap.Log("Input:" + touch.fingerId.ToString());

            creatureState.creatureStateHud.touchArray.Add(touch.position);

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
                var uiElementLocal = GetElementForTouch(touchData, creatureState, touch.position);
                DealEndTouch(creatureState, touchData, uiElementLocal);
                continue;
            }
            else
            {
                touchData = _touchDataMap[touch.fingerId];
                touchData.duration += touch.deltaTime;
            }
            var uiElement = GetElementForTouch(_mouseTouchData, creatureState, touch.position);
            DealCrouch(creatureState, touchData, touch.position, uiElement);
            creatureState.creatureStateHud.uiElementDataArray.Add(new CreatureStateHud.UIElementData(){
                uiElement=uiElement,
                position=touchData.start
            });
            AddMoveView(creatureState, touchData, touch.position, uiElement);
        }
    }

    private void DealKeyboard(CreatureState creatureState)
    {
        creatureState.creatureStateInput.inputMove.x += UnityEngine.Input.GetAxis("Horizontal");
        creatureState.creatureStateInput.inputMove.y += UnityEngine.Input.GetAxis("Vertical");
        creatureState.creatureStateInput.inputView.x += UnityEngine.Input.GetAxis("Horizontal_Alt");
        creatureState.creatureStateInput.inputView.y += UnityEngine.Input.GetAxis("Vertical_Alt");
    }

    private void AddHandPos(CreatureState creatureState)
    {
        foreach( WeaponUIData weaponUIData in _weaponUIDataArray)
        {
            if (false == weaponUIData.clickedOn)
            {
                creatureState.creatureStateHud.handPoseArray.Add(new CreatureStateHud.HandPoseData(){
                    handPose=CreatureStateHud.THandPose.Hold,
                    position=weaponUIData.position
                });
            }
            creatureState.creatureStateHud.uiElementDataArray.Add(new CreatureStateHud.UIElementData(){
                uiElement=CreatureStateHud.TUIElement.Weapon,
                position=weaponUIData.position
            });
        }
        int trace = creatureState.creatureStateHud.handPoseArray.Count;
        for (int index = trace; index < 2; ++index)
        {
            var position = GetWeaponUIPosition(index);
            creatureState.creatureStateHud.handPoseArray.Add(new CreatureStateHud.HandPoseData(){
                handPose=CreatureStateHud.THandPose.Empty,
                position=position
            });
        }
    }

    public void ApplyInputToState(CreatureState creatureState, float timeDelta, UnityEngine.Transform cameraTransform)
    {
        MakeUIElementsForPickup(creatureState, cameraTransform);
        MakeUIElementsForWeapons(creatureState);
        DealMouse(creatureState, timeDelta);
        DealTouch(creatureState, timeDelta);
        DealKeyboard(creatureState);
        AddHandPos(creatureState);
    }
}
