public class CreatureState
{
    public string typeName;// { get; } //[rat, chicken, 

    public float healthCurrent;
    public float healthMax { get; }

    public bool ragdoll = false;
    public bool firstPersonHost = false;

    public CreatureStateBody creatureStateBody;
    public CreatureStateHud creatureStateHud;
    public CreatureStateInput creatureStateInput;

    public System.Collections.Generic.List< WeaponData > weaponArray;
    public struct WeaponData
    {
        public int ammo { get; set; }
        public PickupComponent.TPickupType weapon { get; set; }
    }

    public CreatureState(string in_typeName, UnityEngine.GameObject parent)
    {
        typeName = in_typeName;
        //get jumpHeight "creatures." + typeName + ".jump_height"; 
        //get maxMove "creatures." + typeName + ".max_move"; 
        weaponArray = new System.Collections.Generic.List< WeaponData >();
        //weaponArray.Add(new WeaponData(){weapon=TWeapon.TSlingPan });

        creatureStateBody = new CreatureStateBody(in_typeName, parent);
        creatureStateHud = new CreatureStateHud();
        creatureStateInput = new CreatureStateInput();
    }

    public void StartOfUpdate()
    {
        creatureStateHud = new CreatureStateHud();
        creatureStateInput = new CreatureStateInput();
    }

    public void Update()
    {
        //creatureStatePerUpdate.uiElementDataArray.Add(new CreatureStatePerUpdate.UIElementData(){
        //    position = new UnityEngine.Vector2(UnityEngine.Screen.width * 0.5f, 100.0f),
        //    uiElement = CreatureStatePerUpdate.TUIElement.Health
        //});

        creatureStateBody.Update();
    }

}

