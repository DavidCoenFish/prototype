public class CreatureStatePerUpdate
{
    public enum TUIElement
    {
        None = 0,
        Movement,
        View,
        Health,
        Weapon,
        Count
    }
    public struct UIElementData
    {
        public TUIElement uiElement { get; set; }
        public UnityEngine.Vector2 position { get; set; }
    }

    public enum THandPose
    {
        None = 0,
        Empty,
        Hold,
        Swing,
        Shoot,
        Count
    }
    public struct HandPoseData
    {
        public THandPose handPose { get; set; }
        public UnityEngine.Vector2 position { get; set; }
    }

    public UnityEngine.Vector2 inputMove = new UnityEngine.Vector2(0.0f, 0.0f);
    public UnityEngine.Vector2 inputView = new UnityEngine.Vector2(0.0f, 0.0f);

    public System.Collections.Generic.List< UnityEngine.Vector2 > touchArray = new System.Collections.Generic.List< UnityEngine.Vector2 >();
    public System.Collections.Generic.List< UIElementData > uiElementDataArray = new System.Collections.Generic.List< UIElementData >();
    public System.Collections.Generic.List< HandPoseData > handPoseArray = new System.Collections.Generic.List< HandPoseData >();

    public float crouch;
    public float jump;

    public CreatureStatePerUpdate()
    {
    }
}
