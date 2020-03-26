public class CreatureState
{
    public enum TPose
    {
        Standing = 0,
        Crouching,
        //KO ? or from ragdoll flag
        Count
    }

    public string typeName;// { get; } //[rat, chicken, 

    public float height { get; }
    public float viewElevationDegrees = 0.0f; //look up, positive
    public float bodyLeanForwardDegrees = 0.0f; // or is this with the ridged body?
    public TPose pose = TPose.Standing;
    public bool ragdoll = false;

    //applied to rigid body during FixedUpdate
    //public UnityEngine.Quaternion rotationDelta = new UnityEngine.Quaternion();
    //public UnityEngine.Vector3 moveDelta = new UnityEngine.Vector3();
    public UnityEngine.Vector2 inputMove = new UnityEngine.Vector2(0.0f, 0.0f);
    public UnityEngine.Vector2 inputView = new UnityEngine.Vector2(0.0f, 0.0f);

    public System.Collections.Generic.List< UnityEngine.Vector2 > touchArray = new System.Collections.Generic.List< UnityEngine.Vector2 >();

    public CreatureState(string in_typeName)
    {
        typeName = in_typeName;
        height = 0.125f;//get height "creatures." + typeName + ".height"; 
        //get jumpHeight "creatures." + typeName + ".jump_height"; 
        //get maxMove "creatures." + typeName + ".max_move"; 
    }

    //string typeName
}

