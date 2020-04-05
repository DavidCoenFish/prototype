public class CreatureState
{
    public string typeName;// { get; } //[rat, chicken, 

    public float height { get; }
    public float healthCurrent;
    public float healthMax { get; }

    public bool ragdoll = false;
    public bool firstPersonHost = false;

    public CreatureStatePerUpdate creatureStatePerUpdate;

    public System.Collections.Generic.List< WeaponData > weaponArray;
    public struct WeaponData
    {
        public int ammo { get; set; }
        public PickupComponent.TPickupType weapon { get; set; }
    }

    public CreatureState(string in_typeName)
    {
        typeName = in_typeName;
        height = 0.125f;//get height "creatures." + typeName + ".height"; 
        //get jumpHeight "creatures." + typeName + ".jump_height"; 
        //get maxMove "creatures." + typeName + ".max_move"; 
        weaponArray = new System.Collections.Generic.List< WeaponData >();
        //weaponArray.Add(new WeaponData(){weapon=TWeapon.TSlingPan });

        StartNewUpdate();
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

