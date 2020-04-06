/*
 head camera pos
 feet pos?

 collect the position data of the body to update the render and physics

 */
public class CreatureStateBody
{
    public float height { get; }

    public struct SplineRenderData
    {
        public UnityEngine.Color color;
        public UnityEngine.Vector4 p0;
        public UnityEngine.Vector4 p1;
        public UnityEngine.Vector4 p2;
    };
    public System.Collections.Generic.List< SplineRenderData > splineRenderDataArray = new System.Collections.Generic.List< SplineRenderData >();

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
