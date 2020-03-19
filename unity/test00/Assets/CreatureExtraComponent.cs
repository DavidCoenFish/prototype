// view up down, needs limits, and just the head? also independant of body tilt
// view left-right applied to game object ridgid body...

public class CreatureExtraComponent : UnityEngine.MonoBehaviour
{
    public string typeName = "rat"; //[rat, chicken, 
    public float crouch; // 0.0 => stand, 1.0 => crouch
    public float height;
    public float viewElevationDegrees; //look up, positive
    public bool viewElevationControlsHead; //when KO/ set flying, turn off?
    public float bodyLeanForwardDegrees;
    public TPose pose;

    private float[] _poseWeight = { 1.0f, 0.0f };
    private System.Collections.Generic.List< GameObjectData > _childGameObjectArray = new System.Collections.Generic.List< GameObjectData >();
    private UnityEngine.GameObject _headGameObject;
    private UnityEngine.GameObject _headParentGameObject;

    struct GameObjectData
    {
        public PoseData poseData { get; set; }
        public UnityEngine.GameObject gameObject { get; set; }
    }

    //pose data, todo: from file or prefab
    struct TransformData
    {
        public UnityEngine.Vector3 position { get; set; }
        public UnityEngine.Vector3 rotation { get; set; }
        public UnityEngine.Vector3 scale { get; set; }
    }

    struct PoseData
    {
        public string name { get; set; } 
        public bool sphere { get; set; } // represent pose data with a sphere
        public bool cube { get; set; } // represent with a cube
        public TransformData[] transformData { get; set; }
        public PoseData[] poseDataChildren { get; set; }

    }

    public enum TPose
    {
        Standing = 0,
        Crouching,
        Count
    }

    private static PoseData _poseData = new PoseData{ 
        name = "SpineC", 
        sphere = true, 
        cube = false, 
        transformData = {
            //standing
            new TransformData{
                position = new UnityEngine.Vector3(0.0f, -0.25f, 0.0f ),
                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                scale = new UnityEngine.Vector3(0.5f, 0.5f, 0.5f )
            },
            //Crouching
            new TransformData{
                position = new UnityEngine.Vector3(0.044f, -0.12f, 0.0f ),
                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                scale = new UnityEngine.Vector3(0.5f, 0.5f, 0.5f )
            }
        },
        poseDataChildren = {
            new PoseData{
                name = "SpineB", 
                sphere = true, 
                cube = false, 
                transformData = {
                    //standing
                    new TransformData{
                        position = new UnityEngine.Vector3(0.0f, 0.542f, 0.0f ),
                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                        scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                    },
                    //Crouching
                    new TransformData{
                        position = new UnityEngine.Vector3(-0.292f, 0.25f, 0.0f ),
                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                        scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                    }
                },
                poseDataChildren = {
                    new PoseData{
                        name = "SpineC", 
                        sphere = true, 
                        cube = false, 
                        transformData = {
                            //standing
                            new TransformData{
                                position = new UnityEngine.Vector3(0.0f, 0.666f, 0.0f ),
                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                            },
                            //Crouching
                            new TransformData{
                                position = new UnityEngine.Vector3(0.3131f, 0.3245f, 0.0f ),
                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                            }
                        },
                        poseDataChildren = {
                            new PoseData{
                                name = "Head", 
                                sphere = true, 
                                cube = false, 
                                transformData = {
                                    //standing
                                    new TransformData{
                                        position = new UnityEngine.Vector3(0.666f, 0.1666f, 0.0f ),
                                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                        scale = new UnityEngine.Vector3(0.666f, 0.666f, 0.666f )
                                    },
                                    //Crouching
                                    new TransformData{
                                        position = new UnityEngine.Vector3(0.5733f, 0.0213f, 0.0f ),
                                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                        scale = new UnityEngine.Vector3(0.666f, 0.666f, 0.666f )
                                    }
                                },
                                poseDataChildren = {
                                    new PoseData{
                                        name = "CubeAgro0", 
                                        sphere = false, 
                                        cube = true, 
                                        transformData = {
                                            //standing
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.444f, 0.2159f ),
                                                rotation = new UnityEngine.Vector3(-30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            },
                                            //Crouching
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.332f, 0.216f ),
                                                rotation = new UnityEngine.Vector3(-30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            }
                                        },
                                        poseDataChildren = {}
                                    },
                                    new PoseData{
                                        name = "CubeAgro1", 
                                        sphere = false, 
                                        cube = true, 
                                        transformData = {
                                            //standing
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.444f, -0.2159f ),
                                                rotation = new UnityEngine.Vector3(30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            },
                                            //Crouching
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.332f, -0.216f ),
                                                rotation = new UnityEngine.Vector3(30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            }
                                        },
                                        poseDataChildren = {}
                                    },
                                }
                            },
                        }
                    },
                }
            },
        }
    };

    // Start is called before the first frame update
    void Start()
    {
        UnityEngine.Debug.Log("CreatureExtraComponent.Start", this);

        //Assets/Resources/material/CreatureSkin.mat
        UnityEngine.Material materialSkin = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureSkin");
        //Assets/Resources/material/CreatureDark.mat
        UnityEngine.Material materialDark = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureDark");

        UnityEngine.GameObject trace = gameObject;
        BuildHeirarchy(trace, _poseData);

        UpdatePose();

        //foreach (SpherePosData data in _standingSphereCollider)
        //{
        //    UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
        //    childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = materialSkin;
        //    childGameObject.transform.parent = gameObject.transform;
        //    childGameObject.transform.localPosition = new UnityEngine.Vector3(data.center.x * height, data.center.y * height, data.center.z * height);
        //    float childScale = data.radius * height * 2.0f;
        //    childGameObject.transform.localScale = new UnityEngine.Vector3(childScale, childScale, childScale);
        //    _childGameObjectArraySphere.Add(childGameObject);
        //}

        //foreach (ChildTransform data in _standCubeMesh)
        //{
        //    UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Cube);
        //    childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = materialDark;
        //    childGameObject.transform.parent = gameObject.transform;
        //    childGameObject.transform.localPosition = new UnityEngine.Vector3(data.position.x * height, data.position.y * height, data.position.z * height);
        //    childGameObject.transform.localRotation = UnityEngine.Quaternion.Euler(data.rotation.x, data.rotation.y, data.rotation.z);
        //    childGameObject.transform.localScale = new UnityEngine.Vector3(data.scale.x * height, data.scale.y * height, data.scale.z * height);

        //    _childGameObjectArrayCube.Add(childGameObject);
        //}
    }

    // Update is called once per frame
    void Update()
    {
        UpdatePoseWeight();
        UpdatePose();
        UpdateViewElevation();
    }

    private void UpdatePoseWeight()
    {
        for (int index = 0; index < TPose.Count; ++index)
        {
            float delta = UnityEngine.Time.deltaTime * 2.0f;
            if (index != pose)
            {
                delta = -delta;
            }

            _poseWeight[index] = UnityEngine.Mathf.Clamp(_poseWeight[index] + delta, 0.0f, 1.0f);
        }
    }

    private void UpdatePose()
    {

    }

    private UpdateViewElevation()
    {
    }

}

