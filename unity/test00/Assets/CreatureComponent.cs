//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
public class CreatureComponent : UnityEngine.MonoBehaviour
{
    public string typeName = "rat"; //[rat, chicken, 
    private bool _touchingGround = false;
    private CreatureExtraComponent _creatureExtraComponent = null;
    private float _debugTimeAccumulate = 0.0f;
    private UnityEngine.Rigidbody _rigidbody = null;
    private float _height = 1.0f;

    struct TouchData
    {
        public bool touchActive; // = false;
        public UnityEngine.Vector2 touch; // = new UnityEngine.Vector2(0.0f, 0.0f);
        public bool touchActiveOld; // = false;
        public UnityEngine.Vector2 touchOld; // = new UnityEngine.Vector2(0.0f, 0.0f);
        public float touchTimeAccumulation; // = 0.0f;
        public bool doneJumpThisTouch; // = false;
    }
    private TouchData _inputTouchData = new TouchData();
    private TouchData _viewTouchData = new TouchData();

    public bool humanHost = false;
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

        _height = 0.125f;//get height "creatures." + typeName + ".height"; 
        //get jumpHeight "creatures." + typeName + ".jump_height"; 
        //get maxMove "creatures." + typeName + ".max_move"; 

        _rigidbody = gameObject.AddComponent<UnityEngine.Rigidbody>();
        _rigidbody.constraints = UnityEngine.RigidbodyConstraints.FreezeRotationX | UnityEngine.RigidbodyConstraints.FreezeRotationZ;
        _rigidbody.useGravity = true;

        _creatureExtraComponent = gameObject.AddComponent<CreatureExtraComponent>();
        _creatureExtraComponent.typeName = typeName;
        _creatureExtraComponent.crouch = UnityEngine.Mathf.Sin(_debugTimeAccumulate * 0.5f);
        _creatureExtraComponent.height = _height;
    }

    private new UnityEngine.Vector3 _inputs = new UnityEngine.Vector3();
    void Update()
    {
        //Time.deltaTime
        int layerMask = 1 << 8;
        //todo: may need info on 
        UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(gameObject.transform.position.x, gameObject.transform.position.y - (0.55f * _height), gameObject.transform.position.z);
        _touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, UnityEngine.QueryTriggerInteraction.Ignore);

        bool doJump = UpdateTouchData(_inputTouchData, UnityEngine.Time.deltaTime);

        _debugTimeAccumulate += UnityEngine.Time.deltaTime;
        _creatureExtraComponent.crouch = UnityEngine.Mathf.Sin(_debugTimeAccumulate * 0.5f);

        _inputs.x = UnityEngine.Input.GetAxis("Horizontal");
        _inputs.z = UnityEngine.Input.GetAxis("Vertical");

        if ((true == humanHost) && (null != UnityEngine.Camera.main))
        {
            UnityEngine.Camera camera = null;
            foreach (UnityEngine.Camera trace in UnityEngine.Camera.allCameras)
            {
                if (UnityEngine.Camera.main == trace)
                {
                    camera = trace;
                }
            }
            if (null != camera)
            {
                camera.transform.position = gameObject.transform.position;
                camera.transform.rotation = gameObject.transform.rotation;
            }
        }
    }

    private static bool UpdateTouchData(TouchData touchData, float deltaTime)
    {


        //touchData.touchActiveOld = touchData.touchActive;
        return false;
    }

    void FixedUpdate()
    {
        //_rigidbody.MoveRotation(_rigidbody.rotation * deltaRotation);
        _rigidbody.MovePosition(_rigidbody.position + (_inputs * UnityEngine.Time.fixedDeltaTime));
    }
}
