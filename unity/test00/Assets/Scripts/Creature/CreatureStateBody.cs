/*
 head camera pos
 feet pos?
 */
public class CreatureStateBody
{
    public float height { get; }

    public struct SphereColliderData
    {
        public UnityEngine.Vector3 position;
        public float radius;
    };

    public System.Collections.Generic.List< SphereColliderData > sphereColliderDataArray = new System.Collections.Generic.List< SphereColliderData >();

    public CreatureStateBody()
    {
        height = 0.125f;//get height "creatures." + typeName + ".height"; 

    }


}
