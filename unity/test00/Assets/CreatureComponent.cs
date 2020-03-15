//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
public class CreatureComponent : UnityEngine.MonoBehaviour
{
    public string typeName = "rat"; //[rat, chicken, 
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

    private UnityEngine.Rigidbody _rigidbody;
    private System.Collections.Generic.List< UnityEngine.SphereCollider > _sphereColliderArray = new System.Collections.Generic.List< UnityEngine.SphereCollider >();
    private System.Collections.Generic.List< UnityEngine.GameObject > _childGameObjectArray = new System.Collections.Generic.List< UnityEngine.GameObject >();
    private float _height;

    void Start()
    {
        UnityEngine.Debug.Log("CreatureComponent.Start", this);

        float _height = 0.125f;//get height "creatures." + typeName + ".height"; 
        //get jumpHeight "creatures." + typeName + ".jump_height"; 
        //get maxMove "creatures." + typeName + ".max_move"; 

        _rigidbody = gameObject.AddComponent<UnityEngine.Rigidbody>();
        _rigidbody.constraints = UnityEngine.RigidbodyConstraints.FreezeRotationX | UnityEngine.RigidbodyConstraints.FreezeRotationZ;
        _rigidbody.useGravity = true;

        foreach (SpherePosData data in _standingSphereCollider)
        {
            UnityEngine.SphereCollider sphereCollider = gameObject.AddComponent<UnityEngine.SphereCollider>();
            sphereCollider.center = new UnityEngine.Vector3(data.center.x * _height, data.center.y * _height, data.center.z * _height);
            sphereCollider.radius = data.radius * _height;
            _sphereColliderArray.Add(sphereCollider);
        }

        foreach (SpherePosData data in _standingSphereCollider)
        {
            //UnityEngine.GameObject childGameObject = new UnityEngine.GameObject("creaturechild");
            UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
            //UnityEngine.MeshFilter meshFilter = childGameObject.AddComponent<UnityEngine.MeshFilter>();
            //meshFilter.sharedMesh = UnityEngine.PrimitiveHelper.GetPrimitiveMesh(UnityEngine.PrimitiveType.Sphere);
            //childGameObject.AddComponent<UnityEngine.MeshRenderer>();

            childGameObject.transform.parent = gameObject.transform;
            childGameObject.transform.position = new UnityEngine.Vector3(data.center.x * _height, data.center.y * _height, data.center.z * _height);
            float childScale = data.radius * _height * 2.0f;
            childGameObject.transform.localScale = new UnityEngine.Vector3(childScale, childScale, childScale);
            _childGameObjectArray.Add(childGameObject);
        }

        UnityEngine.Debug.Log("CreatureComponent.End", this);
    }

    void Update()
    {
        //Time.deltaTime
    }

    void FixedUpdate()
    {
        //_rigidbody.MoveRotation(_rigidbody.rotation * deltaRotation);
        //_rigidbody.MovePosition(_body.position + _inputs * Speed * Time.fixedDeltaTime);
    }
}
