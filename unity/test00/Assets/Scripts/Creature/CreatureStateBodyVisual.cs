/*
 collect the position data of the body to update the render
 */
public class CreatureStateBodyVisual
{
    public struct SplineRenderData
    {
        public UnityEngine.Color color;
        public UnityEngine.Vector4 p0; //xyzr
        public UnityEngine.Vector4 p1;
        public UnityEngine.Vector4 p2;
    };
    public System.Collections.Generic.List< SplineRenderData > splineRenderDataArray = new System.Collections.Generic.List< SplineRenderData >();

    public struct SphereRenderData
    {
        public UnityEngine.Color color;
        public UnityEngine.Vector4 p0; //xyzr
    };
    public System.Collections.Generic.List< SphereRenderData > sphereRenderDataArray = new System.Collections.Generic.List< SphereRenderData >();

    public struct FaceRenderData
    {
        public UnityEngine.Color color;
        public UnityEngine.Vector4 p0; //xyzr
        public UnityEngine.Vector4 p1; //xyzr
        public UnityEngine.Vector4 p2; //xyzr
    };
    public FaceRenderData faceRenderData;

    public CreatureStateBodyVisual()
    {
#if false
#if false
        var debugZOffset = new UnityEngine.Vector4(0.0f, 0.0f, 0.0f, 0.0f);
        splineRenderDataArray.Add(new SplineRenderData()
        {
            color = new UnityEngine.Color(1.0f, 0.0f, 0.0f, 1.0f),
            p0 = new UnityEngine.Vector4(0.0f, 0.0f, 0.0f, 0.5f) + debugZOffset,
            p1 = new UnityEngine.Vector4(-1.0f, 0.0f, 0.0f, 0.5f) + debugZOffset,
            p2 = new UnityEngine.Vector4(1.0f, 0.0f, 0.0f, 0.5f) + debugZOffset
        });
#else
        var debugZOffset = new UnityEngine.Vector4(0.0f, 0.0f, 0.0f, 0.0f);
        //nose
        sphereRenderDataArray.Add(new SphereRenderData(){
            color=colorDetail,
            p0=new UnityEngine.Vector4(0.0f, 0.856f, -0.33f, 0.04f * 0.5f) + debugZOffset
        });
        //mouth
        sphereRenderDataArray.Add(new SphereRenderData(){
            color=colorDetail,
            p0=new UnityEngine.Vector4(0.0f, 0.789f, -0.176f, 0.04f * 0.5f) + debugZOffset
        });

        //face 
        faceRenderData.colorA = colorDetail;
        faceRenderData.p0.Set(0.0f, 0.908f, -0.151f, 0.3f * 0.5f);
        faceRenderData.p1.Set(0.0f, 0.856f, -0.33f, 0.0f);
        faceRenderData.p2.Set(0.0f, 0.789f, -0.176f, 0.0f);

        //body
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(0.0f, 0.517f, 0.043f, 0.5f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.0f, 0.739f, 0.045f, 0.4f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.0f, 0.849f, -0.028f, 0.3f * 0.5f) + debugZOffset
        });
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(0.0f, 0.849f, -0.028f, 0.3f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.0f, 0.908f, -0.151f, 0.18f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.0f, 0.856f, -0.33f, 0.04f * 0.5f) + debugZOffset
        });

        //left arm
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(0.2f, 0.683f, 0.051f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.296f, 0.539f, 0.051f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.32f, 0.375f, 0.051f, 0.04f * 0.5f) + debugZOffset,
        });
        //left leg
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(0.084f, 0.291f, 0.131f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.1025f, 0.1594f, 0.0722f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.1089f, 0.021f, 0.101f, 0.04f * 0.5f) + debugZOffset,
        });
        //left foot
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(0.1089f, 0.021f, 0.101f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(0.1089f, 0.025f, 0.074f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(0.1089f, 0.0198f, 0.051f, 0.04f * 0.5f) + debugZOffset,
        });

        //right arm
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(-0.2f, 0.683f, 0.051f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(-0.296f, 0.539f, 0.051f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(-0.32f, 0.375f, 0.051f, 0.04f * 0.5f) + debugZOffset,
        });
        //right leg
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(-0.084f, 0.291f, 0.131f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(-0.1025f, 0.1594f, 0.0722f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(-0.1089f, 0.021f, 0.101f, 0.04f * 0.5f) + debugZOffset,
        });
        //right foot
        splineRenderDataArray.Add(new SplineRenderData(){
            color=colorSkin,
            p0=new UnityEngine.Vector4(-0.1089f, 0.021f, 0.101f, 0.04f * 0.5f) + debugZOffset,
            p1=new UnityEngine.Vector4(-0.1089f, 0.025f, 0.074f, 0.04f * 0.5f) + debugZOffset,
            p2=new UnityEngine.Vector4(-0.1089f, 0.0198f, 0.051f, 0.04f * 0.5f) + debugZOffset,
        });

#endif
#endif

    }


}
