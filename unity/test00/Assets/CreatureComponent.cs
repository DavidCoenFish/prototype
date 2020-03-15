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
    private System.Collections.Generic.List< UnityEngine.GameObject > _childGameObjectArraySphere = new System.Collections.Generic.List< UnityEngine.GameObject >();
    private System.Collections.Generic.List< UnityEngine.GameObject > _childGameObjectArrayCube = new System.Collections.Generic.List< UnityEngine.GameObject >();
    private float _height = 1.0f;
    private bool _touchingGround = false;

    struct TouchData
    {
        public bool touchActive = false;
        public UnityEngine.Vector2 touch = new UnityEngine.Vector2(0.0f, 0.0f);
        public bool touchActiveOld = false;
        public UnityEngine.Vector2 touchOld = new UnityEngine.Vector2(0.0f, 0.0f);
        public float touchTimeAccumulation = 0.0f;
        public bool doneJumpThisTouch = false;
    }
    private TouchData _inputTouchData = new TouchData();
    private TouchData _viewTouchData = new TouchData();

    public bool humanInput = false;
    public bool inputTouchActive
    {
        set
        {
            _inputTouchData.touchActive = value;
        }
    }
    public UnityEngine.Vector2 inputTouch
    {
        set
        {
            _inputTouchData.touch = value;
        }
    }

    public bool viewTouchActive
    {
        set
        {
            _viewTouchData.touchActive = value;
        }
    }
    public UnityEngine.Vector2 viewTouch
    {
        set
        {
            _viewTouchData.touch = value;
        }
    }

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

        //Assets/Resources/material/CreatureSkin.mat
        UnityEngine.Material materialSkin = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureSkin");
        //Assets/Resources/material/CreatureDark.mat
        UnityEngine.Material materialDark = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureDark");

        foreach (SpherePosData data in _standingSphereCollider)
        {
            UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
            childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = materialSkin;
            childGameObject.transform.parent = gameObject.transform;
            childGameObject.transform.localPosition = new UnityEngine.Vector3(data.center.x * _height, data.center.y * _height, data.center.z * _height);
            float childScale = data.radius * _height * 2.0f;
            childGameObject.transform.localScale = new UnityEngine.Vector3(childScale, childScale, childScale);
            _childGameObjectArraySphere.Add(childGameObject);
        }

        foreach (ChildTransform data in _standCubeMesh)
        {
            UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Cube);
            childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = materialDark;
            childGameObject.transform.parent = gameObject.transform;
            childGameObject.transform.localPosition = new UnityEngine.Vector3(data.position.x * _height, data.position.y * _height, data.position.z * _height);
            childGameObject.transform.localRotation = UnityEngine.Quaternion.Euler(data.rotation.x, data.rotation.y, data.rotation.z);
            childGameObject.transform.localScale = new UnityEngine.Vector3(data.scale.x * _height, data.scale.y * _height, data.scale.z * _height);

            _childGameObjectArrayCube.Add(childGameObject);
        }
    }

    void Update()
    {
        //Time.deltaTime
        int layerMask = 1 << 8;
        UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(_childGameObjectArrayCube.transform.position.x, _childGameObjectArrayCube.transform.position.y - (0.55f * _height), _childGameObjectArrayCube.transform.position.z);
        _touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, QueryTriggerInteraction.Ignore);

        bool doJump = UpdateTouchData(_inputTouchData, Time.deltaTime);

    }

    private static bool UpdateTouchData(TouchData touchData, float deltaTime)
    {


        touchData.touchActiveOld = touchData.touchActive;
    }

    void FixedUpdate()
    {
        //_rigidbody.MoveRotation(_rigidbody.rotation * deltaRotation);
        //_rigidbody.MovePosition(_body.position + _inputs * Speed * Time.fixedDeltaTime);
    }
}
