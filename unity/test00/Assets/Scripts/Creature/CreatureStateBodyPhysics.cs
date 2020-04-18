/*
 collect the physics data for a creature

 read write? defined the initial pose state for the simulation, 
 then be update with new pos from the simulation, 
 and be used to update the create state body visual?
*/
public class CreatureStateBodyPhysics
{
    private System.Collections.Generic.Dictionary< string, UnityEngine.Vector3 > _mapNameNodeData = new System.Collections.Generic.Dictionary< string, UnityEngine.Vector3 >();

    public CreatureStateBodyPhysics()
    {
    }

    public void SetNodePos(string name, UnityEngine.Vector3 pos)
    {
        _mapNameNodeData[name] = pos;
    }

    public UnityEngine.Vector3 GetNodePos(string name)
    {
        if (_mapNameNodeData.ContainsKey(name))
        {
            return _mapNameNodeData[name];
        }
        return UnityEngine.Vector3.zero;
    }

}
