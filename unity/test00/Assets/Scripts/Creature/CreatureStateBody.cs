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
        public UnityEngine.Vector4 p0; //xyzr
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

        var debugZOffset = new UnityEngine.Vector4(0.0f, 0.0f, 0.0f, 0.0f);

#if false
        splineRenderDataArray.Add(new SplineRenderData()
        {
            color = new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f),
            p0 = new UnityEngine.Vector4(0.0f, 0.0f, 0.0f, 0.5f) + debugZOffset,
            p1 = new UnityEngine.Vector4(-1.0f, 0.0f, 0.0f, 0.5f) + debugZOffset,
            p2 = new UnityEngine.Vector4(1.0f, 0.0f, 0.0f, 0.5f) + debugZOffset
        });
#else
        //body
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(0.0f, 1.0f, 0.0f, 1.0f),
            p0=new UnityEngine.Vector4(0.0f, 0.573f, 0.043f, 0.55f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.0f, 0.837f, -0.026f, 0.6f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.0f, 1.102f, 0.080f, 0.55f * 0.5f) + debugZOffset
        });
        //arm
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(0.0f, 0.0f, 1.0f, 1.0f),
            p0=new UnityEngine.Vector4(0.293f, 0.962f, -0.016f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.415f, 0.745f, -0.016f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.415f, 0.517f, -0.016f, 0.04f * 0.5f) + debugZOffset,
        });
        //leg
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f),
            p0=new UnityEngine.Vector4(0.196f, 0.375f, 0.116f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.241f, 0.202f, 0.076f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.247f, 0.02f, 0.165f, 0.04f * 0.5f) + debugZOffset,
        });
        //foot
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f),
            p0=new UnityEngine.Vector4(0.247f, 0.02f, 0.165f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.247f, 0.027f, 0.089f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.247f, 0.02f, 0.001f, 0.04f * 0.5f) + debugZOffset,
        });
        //arm
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(0.0f, 0.0f, 1.0f, 1.0f),
            p0=new UnityEngine.Vector4(-0.293f, 0.962f, -0.016f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(-0.415f, 0.745f, -0.016f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(-0.415f, 0.517f, -0.016f, 0.04f * 0.5f) + debugZOffset,
        });
        //leg
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f),
            p0=new UnityEngine.Vector4(-0.196f, 0.375f, 0.116f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(-0.241f, 0.202f, 0.076f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(-0.247f, 0.02f, 0.165f, 0.04f * 0.5f) + debugZOffset,
        });
        //foot
        splineRenderDataArray.Add(new SplineRenderData(){
            color=new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f),
            p0=new UnityEngine.Vector4(-0.247f, 0.02f, 0.165f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(-0.247f, 0.027f, 0.089f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(-0.247f, 0.02f, 0.001f, 0.04f * 0.5f) + debugZOffset,
        });
#endif
    }


}
