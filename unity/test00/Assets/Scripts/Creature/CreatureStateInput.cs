public class CreatureStateInput
{
    public UnityEngine.Vector2 inputMove = new UnityEngine.Vector2(0.0f, 0.0f);
    public UnityEngine.Vector2 inputView = new UnityEngine.Vector2(0.0f, 0.0f);

    public float zoom;
    public float crouch;
    public float jump;

    public CreatureStateInput()
    {
    }

    //UnityEngine.Input.GetAxis("Horizontal")
    //UnityEngine.Input.GetAxis("Vertical")
    //UnityEngine.Input.GetAxis("Horizontal_Alt")

}
