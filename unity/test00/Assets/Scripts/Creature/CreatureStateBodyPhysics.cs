/*
 collect the physics data for a creature

 read write? defined the initial pose state for the simulation, 
 then be update with new pos from the simulation, 
 and be used to update the create state body visual?
*/
public class CreatureStateBodyPhysics
{
    public struct SphereColliderData
    {
        public UnityEngine.Vector3 position;
        public float radius;
    };
    public System.Collections.Generic.List< SphereColliderData > sphereColliderDataArray = new System.Collections.Generic.List< SphereColliderData >();

    public CreatureStateBodyPhysics()
    {
    }

}
