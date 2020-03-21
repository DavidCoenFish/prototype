class CreatureControllerHuman : ICreatureController
{
    struct TouchData
    {
        //public bool touchActive; // = false;
        //public UnityEngine.Vector2 touch; // = new UnityEngine.Vector2(0.0f, 0.0f);
        //public bool touchActiveOld; // = false;
        //public UnityEngine.Vector2 touchOld; // = new UnityEngine.Vector2(0.0f, 0.0f);
        //public float touchTimeAccumulation; // = 0.0f;
        //public bool doneJumpThisTouch; // = false;
    }
    //private TouchData _inputTouchData = new TouchData();
    //private TouchData _viewTouchData = new TouchData();
        //_inputs.x = UnityEngine.Input.GetAxis("Horizontal");
        //_inputs.z = UnityEngine.Input.GetAxis("Vertical");

    public void ApplyInputToState(CreatureState creatureState)
    {
        for (int index = 0; index < UnityEngine.Input.touchCount; ++index)
        {
            var touch = UnityEngine.Input.GetTouch(index);
            Bootstrap.Log("Input:" + touch.fingerId);
        }

        creatureState.moveDelta.x = UnityEngine.Input.GetAxis("Horizontal");
        creatureState.moveDelta.z = UnityEngine.Input.GetAxis("Vertical");
    }
}
