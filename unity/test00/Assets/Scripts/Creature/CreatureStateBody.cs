using System.ComponentModel;

public class CreatureStateBody
{
    public float height { get; }
    public CreatureStateBodyPhysics creatureStateBodyPhysics;
    public CreatureStateBodyVisual creatureStateBodyVisual;

    private System.Collections.Generic.Dictionary< string, float > _mapBodyRadius = new System.Collections.Generic.Dictionary< string, float >();

    public struct BodyData
    {
        public string m_name;
        public UnityEngine.Vector3 m_pos;
        public float m_radius;
        public string m_parentName;
        public bool m_jointParent;

        public static BodyData Factory(SimpleJSON.JSONNode jsonData)
        {
            var positionJson = jsonData["position"];
            var pos = positionJson.IsArray ? new UnityEngine.Vector3(positionJson[0].AsFloat, positionJson[1].AsFloat, positionJson[2].AsFloat) : UnityEngine.Vector3.zero;

            var parentNameJson = jsonData["parent_name"];
            string parentName = parentNameJson.IsString ? parentNameJson.Value : "";

            var jointParentJson = jsonData["joint_parent"];
            bool jointParent = jointParentJson.IsBoolean ? jointParentJson.AsBool : false;

            return new BodyData(){
                m_name = jsonData["name"].Value,
                m_pos = pos,
                m_radius = jsonData["scale"].AsFloat,
                m_parentName = parentName,
                m_jointParent = jointParent
            };
        }
    }
    public System.Collections.Generic.List< BodyData > bodyDataArray = new System.Collections.Generic.List< BodyData >();

    public struct DebugSphereData
    {
        public UnityEngine.Vector3 m_pos;
        public float m_radius;
    }
    public System.Collections.Generic.List< DebugSphereData > debugSphereDataArray = new System.Collections.Generic.List< DebugSphereData >();

    public struct SplineData
    {
        public UnityEngine.Color m_color;
        public string[] m_name;

        public static SplineData Factory(SimpleJSON.JSONNode jsonData)
        {
            var colorJson = jsonData["color"];
            var color = colorJson.IsArray ? new UnityEngine.Color(colorJson[0].AsFloat, colorJson[1].AsFloat, colorJson[2].AsFloat, colorJson[3].AsFloat) : UnityEngine.Color.black;
            var nameArray = new string[3];
            var nameJson = jsonData["name"];
            if (nameJson.IsArray)
            {
                nameArray[0] = nameJson[0].Value;
                nameArray[1] = nameJson[1].Value;
                nameArray[2] = nameJson[2].Value;
            }

            return new SplineData(){
                m_color = color,
                m_name = nameArray
            };
        }
    }
    public System.Collections.Generic.List< SplineData > splineDataArray = new System.Collections.Generic.List< SplineData >();

    public struct SphereData
    {
        public UnityEngine.Color m_color;
        public string m_name;

        public static SphereData Factory(SimpleJSON.JSONNode jsonData)
        {
            var colorJson = jsonData["color"];
            var color = colorJson.IsArray ? new UnityEngine.Color(colorJson[0].AsFloat, colorJson[1].AsFloat, colorJson[2].AsFloat, colorJson[3].AsFloat) : UnityEngine.Color.black;
            return new SphereData(){
                m_color = color,
                m_name = jsonData["name"].Value
            };
        }
    }
    public System.Collections.Generic.List< SphereData > sphereDataArray = new System.Collections.Generic.List< SphereData >();

    public struct FaceData
    {
        public UnityEngine.Color m_color;
        public string[] m_name;
        public static FaceData Factory(SimpleJSON.JSONNode jsonData)
        {
            var colorJson = jsonData["face_color"];
            var color = colorJson.IsArray ? new UnityEngine.Color(colorJson[0].AsFloat, colorJson[1].AsFloat, colorJson[2].AsFloat, colorJson[3].AsFloat) : UnityEngine.Color.black;
            var nameArray = new string[3];
            var nameJson = jsonData["face_name"];
            if (nameJson.IsArray)
            {
                nameArray[0] = nameJson[0].Value;
                nameArray[1] = nameJson[1].Value;
                nameArray[2] = nameJson[2].Value;
            }
            return new FaceData(){
                m_color = color,
                m_name = nameArray
            };
        }
    }
    public FaceData faceData;

    public CreatureStateBody(string typeName, UnityEngine.GameObject parent)
    {
        creatureStateBodyPhysics = new CreatureStateBodyPhysics();
        creatureStateBodyVisual = new CreatureStateBodyVisual();

        var jsonNode = Bootstrap.GetDataStore().staticData.GetNode("creatures")[typeName]; //creatures
        if (null == jsonNode)
        {
            Bootstrap.Warn("creature not found:" + typeName, parent);
            return;
        }

        height = jsonNode["height"].AsFloat;
        //height = 0.5f;

        {
            var jsonBodyDataArray = jsonNode["body_data_array"];
            if ((null != jsonBodyDataArray) && (true == jsonBodyDataArray.IsArray))
            {
                for (int index = 0; index < jsonBodyDataArray.Count; ++index)
                {
                    var bodyData = BodyData.Factory(jsonBodyDataArray[index]);
                    bodyDataArray.Add(bodyData);
                    _mapBodyRadius[bodyData.m_name] = bodyData.m_radius * 0.5f;
                }
            }
        }
        {
            var jsonSplineDataArray = jsonNode["spline_data_array"];
            if ((null != jsonSplineDataArray) && (true == jsonSplineDataArray.IsArray))
            {
                for (int index = 0; index < jsonSplineDataArray.Count; ++index)
                {
                    splineDataArray.Add(SplineData.Factory(jsonSplineDataArray[index]));
                }
            }
        }
        {
            var jsonSphereDataArray = jsonNode["sphere_data_array"];
            if ((null != jsonSphereDataArray) && (true == jsonSphereDataArray.IsArray))
            {
                for (int index = 0; index < jsonSphereDataArray.Count; ++index)
                {
                    sphereDataArray.Add(SphereData.Factory(jsonSphereDataArray[index]));
                }
            }
        }

        faceData = FaceData.Factory(jsonNode);
    }

    private float GetBodyDataRadius(string key)
    {
        if (_mapBodyRadius.ContainsKey(key))
        {
            return _mapBodyRadius[key];
        }
        return 0.0f;
    }

    private UnityEngine.Vector4 MakePos(string name)
    {
        var pos = creatureStateBodyPhysics.GetNodePos(name);
        var radius = GetBodyDataRadius(name);
        return new UnityEngine.Vector4(pos.x, pos.y, pos.z, radius);
    }

    public void Update()
    {
        creatureStateBodyVisual = new CreatureStateBodyVisual();

        //update visual pos from physical
        foreach(var splineData in splineDataArray)
        {
            var p0 = MakePos(splineData.m_name[0]);
            var p1 = MakePos(splineData.m_name[1]);
            var p2 = MakePos(splineData.m_name[2]);
            creatureStateBodyVisual.splineRenderDataArray.Add(new CreatureStateBodyVisual.SplineRenderData(){
                color = splineData.m_color,
                p0 = p0,
                p1 = p1,
                p2 = p2
            });
        }

        foreach(var sphereData in sphereDataArray)
        {
            var p0 = MakePos(sphereData.m_name);
            creatureStateBodyVisual.sphereRenderDataArray.Add(new CreatureStateBodyVisual.SphereRenderData(){
                color = sphereData.m_color,
                p0 = p0
            });
        }

        {
            creatureStateBodyVisual.faceRenderData.color = faceData.m_color;
            creatureStateBodyVisual.faceRenderData.p0 = MakePos(faceData.m_name[0]);
            creatureStateBodyVisual.faceRenderData.p1 = MakePos(faceData.m_name[1]);
            creatureStateBodyVisual.faceRenderData.p2 = MakePos(faceData.m_name[2]);
        }
    }

    public void ClearDebugSphere()
    {
        debugSphereDataArray = new System.Collections.Generic.List< DebugSphereData >();
    }

    public void AddDebugSphere(UnityEngine.Vector3 position, float scale)
    {
        debugSphereDataArray.Add(new DebugSphereData(){
            m_pos = position,
            m_radius = scale
        });
    }

}
