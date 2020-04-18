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

/*
    private System.Collections.Generic.Dictionary< string, UnityEngine.GameObject > _mapNameGameObject = new System.Collections.Generic.Dictionary< string, UnityEngine.GameObject >();
    private System.Collections.Generic.Dictionary< string, float > _mapNameRadius = new System.Collections.Generic.Dictionary< string, float >();

    private struct SplineData
    {
        public UnityEngine.Vector4 m_color;
        public UnityEngine.GameObject m_objectA;
        public UnityEngine.GameObject m_objectB;
        public UnityEngine.GameObject m_objectC;
        public float m_radiusA;
        public float m_radiusB;
        public float m_radiusC;
    }
    private System.Collections.Generic.List< SplineData > _splineDataArray = new System.Collections.Generic.List< SplineData >();

    private struct SphereData
    {
        public UnityEngine.Vector4 m_color;
        public UnityEngine.GameObject m_object;
        public float m_radius;
    }
    private System.Collections.Generic.List< SphereData > _sphereDataArray = new System.Collections.Generic.List< SphereData >();

    private SplineData faceData;

    //should we be creating game objects, or just providing data to allow other systems to create game objects.
    // we have the typename, and something has to interprit the static data -> body

    public CreatureStateBody(string typeName, UnityEngine.GameObject parent)
    {
        //height = 0.125f;//get height "creatures." + typeName + ".height"; 

        creatureStateBodyPhysics = new CreatureStateBodyPhysics();
        creatureStateBodyVisual = new CreatureStateBodyVisual();

        var jsonNode = Bootstrap.GetDataStore().staticData.GetNode("creatures")[typeName]; //creatures
        if (null == jsonNode)
        {
            Bootstrap.Warn("creature not found:" + typeName, parent);
            return;
        }

        height = jsonNode["height"].AsFloat;

        var jsonBodyDataArray = jsonNode["body_data_array"];
        if ((null != jsonBodyDataArray) && (true == jsonBodyDataArray.IsArray))
        {
            for (int index = 0; index < jsonBodyDataArray.Count; ++index)
            {
                CreateGameObject(jsonBodyDataArray[index], parent);
            }

            //create joints or set parent
            for (int index = 0; index < jsonBodyDataArray.Count; ++index)
            {
                DealParentJoint(jsonBodyDataArray[index], parent);
            }
        }

        {
            var jsonSplineArray = jsonNode["spline_data_array"];
            if ((null != jsonSplineArray) && (true == jsonSplineArray.IsArray))
            {
                for (int index = 0; index < jsonSplineArray.Count; ++index)
                {
                    //color:float:array:0	color:float:array:1	color:float:array:2	color:float:array:3	name:string:array:0	name:string:array:1	name:string:array:2
                
                    var jsonData = jsonSplineArray[index];
                    var jsonColor = jsonData["color"];
                    var jsonName = jsonData["name"];
                    _splineDataArray.Add(new SplineData(){
                        m_color = new UnityEngine.Vector4(jsonColor[0].AsFloat,jsonColor[1].AsFloat,jsonColor[2].AsFloat,jsonColor[3].AsFloat),
                        m_objectA = _mapNameGameObject[jsonName[0].Value],
                        m_radiusA = _mapNameRadius[jsonName[0].Value],
                        m_objectB = _mapNameGameObject[jsonName[1].Value],
                        m_radiusB = _mapNameRadius[jsonName[1].Value],
                        m_objectC = _mapNameGameObject[jsonName[2].Value],
                        m_radiusC = _mapNameRadius[jsonName[2].Value]
                    });
                }
            }
        }

        {
            var jsonSphereArray = jsonNode["sphere_data_array"];
            if ((null != jsonSphereArray) && (true == jsonSphereArray.IsArray))
            {
                for (int index = 0; index < jsonSphereArray.Count; ++index)
                {
                    var jsonData = jsonSphereArray[index];
                    var jsonColor = jsonData["color"];
                    var jsonName = jsonData["name"];
                    _sphereDataArray.Add(new SphereData(){
                        m_color = new UnityEngine.Vector4(jsonColor[0].AsFloat,jsonColor[1].AsFloat,jsonColor[2].AsFloat,jsonColor[3].AsFloat),
                        m_object = _mapNameGameObject[jsonName.Value],
                        m_radius = _mapNameRadius[jsonName.Value],
                    });
                }
            }
        }

        //face data
        {
            var jsonColor = jsonNode["face_color"];
            faceData.m_color = new UnityEngine.Vector4(jsonColor[0].AsFloat,jsonColor[1].AsFloat,jsonColor[2].AsFloat,jsonColor[3].AsFloat);

            var jsonName = jsonNode["face_name"];
            faceData.m_objectA = _mapNameGameObject[jsonName[0].Value];
            faceData.m_radiusA = _mapNameRadius[jsonName[0].Value];
            faceData.m_objectB = _mapNameGameObject[jsonName[1].Value];
            faceData.m_radiusB = _mapNameRadius[jsonName[1].Value];
            faceData.m_objectC = _mapNameGameObject[jsonName[2].Value];
            faceData.m_radiusC = _mapNameRadius[jsonName[2].Value];
        }

    }

    //body_data_array
    //string:name	float:position:array:0	float:position:array:1	float:position:array:2	float:scale	parent_name:string	joint_parent:bool
    private void CreateGameObject(SimpleJSON.JSONNode jsonData, UnityEngine.GameObject parent)
    {
        var name = jsonData["name"];
        var gameObject = new UnityEngine.GameObject(name);
        _mapNameGameObject[name] = gameObject;
        var jsonPosition = jsonData["position"]; 
        gameObject.transform.position = new UnityEngine.Vector3(jsonPosition[0].AsFloat, jsonPosition[1].AsFloat, jsonPosition[2].AsFloat);
        var scale = jsonData["scale"].AsFloat;
        gameObject.transform.localScale = new UnityEngine.Vector3(scale, scale, scale);
        _mapNameRadius[name] = scale * 0.5f;

        var collider = gameObject.AddComponent<UnityEngine.SphereCollider>();
        collider.radius = 0.5f;

        gameObject.transform.parent = parent.transform;

        //if (jsonData["parent_name"].IsString)
        //{
        //    var rigidbody = gameObject.AddComponent<UnityEngine.Rigidbody>();
        //    rigidbody.useGravity = false;
        //    rigidbody.centerOfMass = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f);
        //    rigidbody.inertiaTensor = new UnityEngine.Vector3(1.0f, 1.0f, 1.0f);
        //    gameObject.layer = (int)Project.Layer.TIgnoreRaycast;
        //}
    }

    private void DealParentJoint(SimpleJSON.JSONNode jsonData, UnityEngine.GameObject root)
    {
        //var name = jsonData["name"];
        //var gameObject = _mapNameGameObject[name];
    
        //UnityEngine.GameObject parent = root;
        //var parentName = jsonData["parent_name"];
        //if (parentName.IsString)
        //{
        //    parent = _mapNameGameObject[parentName.Value];
        //}

        //if (parent)
        //{
        //    if (true == jsonData["joint_parent"].AsBool)
        //    {
        //        var characterJoint = gameObject.AddComponent<UnityEngine.CharacterJoint>();
        //        //characterJoint.radius = 0.5f;
        //        characterJoint.connectedBody = parent.GetComponent<UnityEngine.Rigidbody>();
        //    }
        //    else
        //    {
        //        gameObject.transform.parent = parent.transform;
        //    }
        //}
    }

    public void Update()
    {
        creatureStateBodyVisual = new CreatureStateBodyVisual();
        foreach (var splineData in _splineDataArray)
        {
            var data = new CreatureStateBodyVisual.SplineRenderData(){
                color = splineData.m_color
            };
            {
                var position = splineData.m_objectA.transform.position;
                data.p0 = new UnityEngine.Vector4(position.x, position.y, position.z, splineData.m_radiusA);
            }
            {
                var position = splineData.m_objectB.transform.position;
                data.p1 = new UnityEngine.Vector4(position.x, position.y, position.z, splineData.m_radiusB);
            }
            {
                var position = splineData.m_objectC.transform.position;
                data.p2 = new UnityEngine.Vector4(position.x, position.y, position.z, splineData.m_radiusC);
            }

            creatureStateBodyVisual.splineRenderDataArray.Add( data );
        }

        foreach (var sphereData in _sphereDataArray)
        {
            var data = new CreatureStateBodyVisual.SphereRenderData(){
                color = sphereData.m_color,
            };
            var position = sphereData.m_object.transform.position;
            data.p0 = new UnityEngine.Vector4(position.x, position.y, position.z, sphereData.m_radius);
            creatureStateBodyVisual.sphereRenderDataArray.Add( data );
        }

        //face
        {
            creatureStateBodyVisual.faceRenderData.color = faceData.m_color;

            {
                var position = faceData.m_objectA.transform.position;
                creatureStateBodyVisual.faceRenderData.p0 = new UnityEngine.Vector4(
                    position.x, position.y, position.z, faceData.m_radiusA
                    );
            }
            {
                var position = faceData.m_objectB.transform.position;
                creatureStateBodyVisual.faceRenderData.p1 = new UnityEngine.Vector4(
                    position.x, position.y, position.z, faceData.m_radiusB
                    );
            }
            {
                var position = faceData.m_objectC.transform.position;
                creatureStateBodyVisual.faceRenderData.p2 = new UnityEngine.Vector4(
                    position.x, position.y, position.z, faceData.m_radiusC
                    );
            }
        }
    }
*/
}
