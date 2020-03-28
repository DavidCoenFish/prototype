public class CreatureStatePerUpdate
{
    public enum TUIElement
    {
        None = 0,
        Movement,
        View,
        Attack,
        Health,
        Count
    }

    public struct UIElementData
    {
        public TUIElement uiElement { get; set; }
        public UnityEngine.Vector2 position { get; set; }
        public UnityEngine.Vector2 touch { get; set; }
    }

    public UnityEngine.Vector2 inputMove = new UnityEngine.Vector2(0.0f, 0.0f);
    public UnityEngine.Vector2 inputView = new UnityEngine.Vector2(0.0f, 0.0f);

    public System.Collections.Generic.List< UnityEngine.Vector2 > touchArray = new System.Collections.Generic.List< UnityEngine.Vector2 >();
    public System.Collections.Generic.List< UIElementData > uiElementDataArray = new System.Collections.Generic.List< UIElementData >();

    public float crouch;
    public float jump;

    public CreatureStatePerUpdate()
    {
    }
}
