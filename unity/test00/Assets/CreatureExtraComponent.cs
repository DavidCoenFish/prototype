public class CreatureExtraComponent : UnityEngine.MonoBehaviour
{
    public string typeName = "rat"; //[rat, chicken, 
    public float crouch; // 0.0 => stand, 1.0 => crouch
    public float height;

    struct SpherePosData
    {
        public UnityEngine.Vector3 center { get; set; }
        public float radius { get; set; }
    }
    //private SpherePosData _test = new SpherePosData{ center = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ), radius = 1.0f };

    private static SpherePosData[] _standingSphereCollider = {
        new SpherePosData{ center = new UnityEngine.Vector3(0.0f, -0.25f, 0.0f ), radius = 0.25f },
        new SpherePosData{ center = new UnityEngine.Vector3(0.0f, 0.25f, 0.0f ), radius = 0.25f },
        new SpherePosData{ center = new UnityEngine.Vector3(0.25f, 0.375f, 0.0f ), radius = 0.125f }
    }; 
    //private SpherePosData[] _standingChildSphere = _standingSphereCollider with radius * 2.0

    private static SpherePosData[] _crouchSphereCollider = {
        new SpherePosData{ center = new UnityEngine.Vector3(0.0f, 0.0f, 0.125f ), radius = 0.25f },
        new SpherePosData{ center = new UnityEngine.Vector3(0.0f, 0.0f, -0.125f ), radius = 0.25f },
        new SpherePosData{ center = new UnityEngine.Vector3(0.25f, 0.175f, 0.0f ), radius = 0.125f }
    }; 

    struct ChildTransform
    {
        public UnityEngine.Vector3 position { get; set; }
        public UnityEngine.Vector3 rotation { get; set; }
        public UnityEngine.Vector3 scale { get; set; }
    }

    private static ChildTransform[] _standCubeMesh = {
        new ChildTransform{ 
            position = new UnityEngine.Vector3(0.338f, 0.486f, 0.054f ),
            rotation = new UnityEngine.Vector3(-30.0f, 0.0f, 0.0f ),
            scale = new UnityEngine.Vector3(0.03f, 0.03f, 0.1f )
        },
        new ChildTransform{ 
            position = new UnityEngine.Vector3(0.338f, 0.486f, -0.054f ),
            rotation = new UnityEngine.Vector3(30.0f, 0.0f, 0.0f ),
            scale = new UnityEngine.Vector3(0.03f, 0.03f, 0.1f )
        }
    };

    private static ChildTransform[] _crouchCubeMesh = {
        new ChildTransform{ 
            position = new UnityEngine.Vector3(0.35f, 0.2f, 0.054f ),
            rotation = new UnityEngine.Vector3(-30.0f, 0.0f, 0.0f ),
            scale = new UnityEngine.Vector3(0.03f, 0.03f, 0.1f )
        },
        new ChildTransform{ 
            position = new UnityEngine.Vector3(0.35f, 0.2f, -0.054f ),
            rotation = new UnityEngine.Vector3(30.0f, 0.0f, 0.0f ),
            scale = new UnityEngine.Vector3(0.03f, 0.03f, 0.1f )
        }
    };

    private System.Collections.Generic.List< UnityEngine.GameObject > _childGameObjectArraySphere = new System.Collections.Generic.List< UnityEngine.GameObject >();
    private System.Collections.Generic.List< UnityEngine.GameObject > _childGameObjectArrayCube = new System.Collections.Generic.List< UnityEngine.GameObject >();

    static UnityEngine.Vector3 CreatureLerp(UnityEngine.Vector3 lhs, UnityEngine.Vector3 rhs, float ratio, float scale)
    {
        return new UnityEngine.Vector3(
            ((lhs.x * (1.0f - ratio)) + (rhs.x * ratio)) * scale,
            ((lhs.y * (1.0f - ratio)) + (rhs.y * ratio)) * scale,
            ((lhs.z * (1.0f - ratio)) + (rhs.z * ratio)) * scale
            );
    }


    // Start is called before the first frame update
    void Start()
    {
        UnityEngine.Debug.Log("CreatureExtraComponent.Start", this);

        //Assets/Resources/material/CreatureSkin.mat
        UnityEngine.Material materialSkin = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureSkin");
        //Assets/Resources/material/CreatureDark.mat
        UnityEngine.Material materialDark = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureDark");

        foreach (SpherePosData data in _standingSphereCollider)
        {
            UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
            childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = materialSkin;
            childGameObject.transform.parent = gameObject.transform;
            childGameObject.transform.localPosition = new UnityEngine.Vector3(data.center.x * height, data.center.y * height, data.center.z * height);
            float childScale = data.radius * height * 2.0f;
            childGameObject.transform.localScale = new UnityEngine.Vector3(childScale, childScale, childScale);
            _childGameObjectArraySphere.Add(childGameObject);
        }

        foreach (ChildTransform data in _standCubeMesh)
        {
            UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Cube);
            childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = materialDark;
            childGameObject.transform.parent = gameObject.transform;
            childGameObject.transform.localPosition = new UnityEngine.Vector3(data.position.x * height, data.position.y * height, data.position.z * height);
            childGameObject.transform.localRotation = UnityEngine.Quaternion.Euler(data.rotation.x, data.rotation.y, data.rotation.z);
            childGameObject.transform.localScale = new UnityEngine.Vector3(data.scale.x * height, data.scale.y * height, data.scale.z * height);

            _childGameObjectArrayCube.Add(childGameObject);
        }
    }

    // Update is called once per frame
    void Update()
    {
        //for (int index = 0; index < _childGameObjectArraySphere.Count; index++)
        //{
        //    UnityEngine.Vector3 position = CreatureLerp(_standingSphereCollider[index].center, _crouchSphereCollider[index].center, crouch, height);

        //    UnityEngine.GameObject childGameObject = _childGameObjectArraySphere[index];
        //    childGameObject.transform.localPosition = position;
        //}

        //for (int index = 0; index < _childGameObjectArrayCube.Count; index++)
        //{
        //    UnityEngine.GameObject childGameObject = _childGameObjectArrayCube[index];
        //    childGameObject.transform.localPosition = CreatureLerp(_standCubeMesh[index].position, _crouchCubeMesh[index].position, crouch, height);
        //}
    }
}
