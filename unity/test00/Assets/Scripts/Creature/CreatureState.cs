public class CreatureState
{
    public string typeName;// { get; } //[rat, chicken, 

    public float height { get; }
    public float healthCurrent { get; set; }
    public float healthMax { get; }

    public bool ragdoll = false;
    //this is the creature that hosts the game camera, turn off some of the body...
    public bool firstPersonHost = false;

    public CreatureStatePerUpdate creatureStatePerUpdate;

    //applied to rigid body during FixedUpdate
    //public UnityEngine.Quaternion rotationDelta = new UnityEngine.Quaternion();
    //public UnityEngine.Vector3 moveDelta = new UnityEngine.Vector3();

    public CreatureState(string in_typeName)
    {
        typeName = in_typeName;
        height = 0.125f;//get height "creatures." + typeName + ".height"; 
        //get jumpHeight "creatures." + typeName + ".jump_height"; 
        //get maxMove "creatures." + typeName + ".max_move"; 
    }

    public void StartNewUpdate()
    {
        creatureStatePerUpdate = new CreatureStatePerUpdate();
        creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){
            position = new UnityEngine.Vector2(UnityEngine.Screen.width * 0.5f, 100.0f),
            uiElement = CreatureStatePerUpdate.TUIElement.Health
        });
    }

}

