//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
public class CreatureComponent : UnityEngine.MonoBehaviour, IPlayerComponent
{
    public bool startHumanControlled = false;
    public string typeName = "rat"; //[rat, chicken, sheep, dog, bear, elephant, gate

    private ICreatureController _creatureController = null;
    private CreatureState _creatureState = null; //null;
    private CreatureBody _creatureBody = null;
    private UnityEngine.Rigidbody _rigidbody = null;
    private SpringVector2 _inputSpring;

    //private float _debugTimeAccumulate = 0.0f;

    void Start()
    {
        UnityEngine.Debug.Log("CreatureComponent.Start", this);

        if (true == startHumanControlled)
        {
            _creatureController = new CreatureControllerHuman();
            GameComponent.SetHumanPlayer(0, this);
        }
        else
        {
            _creatureController = new CreatureControllerAI();
        }

        //_rigidbody = gameObject.AddComponent<UnityEngine.Rigidbody>();
        _rigidbody = gameObject.GetComponent< UnityEngine.Rigidbody >();
        //_rigidbody.constraints = UnityEngine.RigidbodyConstraints.FreezeRotationX | UnityEngine.RigidbodyConstraints.FreezeRotationZ;
        _rigidbody.useGravity = true;
        _rigidbody.centerOfMass = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f);
        _rigidbody.inertiaTensor = new UnityEngine.Vector3(1.0f, 1.0f, 1.0f);

        _creatureState = new CreatureState(typeName);
        _creatureBody = new CreatureBody( this.gameObject, _creatureState);

        var collider = gameObject.AddComponent<UnityEngine.CapsuleCollider>();
        collider.center = new UnityEngine.Vector3(0.0f, _creatureState.height * 0.5f, 0.0f);
        collider.height = _creatureState.height;
        collider.radius = _creatureState.height * 0.25f;

        _inputSpring = new SpringVector2(10.0f, UnityEngine.Vector2.zero, 1.0f);
    }

    void Update()
    {
        //int layerMask = 1 << 8;
        //UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(gameObject.transform.position.x, gameObject.transform.position.y - (0.55f * _height), gameObject.transform.position.z);
        //_touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, UnityEngine.QueryTriggerInteraction.Ignore);

        //_debugTimeAccumulate += UnityEngine.Time.deltaTime;
        //_creatureState.pose = 0.0f < UnityEngine.Mathf.Sin(_debugTimeAccumulate * 0.5f) ? CreatureState.TPose.Crouching : CreatureState.TPose.Standing;

        if (null != _creatureController)
        {
            _creatureController.ApplyInputToState(_creatureState);
        }

        if (null != _creatureBody)
        {
            _creatureBody.Update(_creatureState);
        }

        if (UnityEngine.Input.GetButtonDown("Jump"))
        {
            _rigidbody.AddForce(UnityEngine.Vector3.up * UnityEngine.Mathf.Sqrt(-1f * UnityEngine.Physics.gravity.y), UnityEngine.ForceMode.VelocityChange);
        }
    }

    void FixedUpdate()
    {
        var inputSpring = _inputSpring.Advance(_creatureState.inputMove, UnityEngine.Time.fixedDeltaTime);

        {
            var drawPosBase = _rigidbody.position;
            UnityEngine.Debug.DrawLine(
                drawPosBase, 
                drawPosBase + UnityEngine.Vector3.up + new UnityEngine.Vector3(inputSpring.x, 0.0f, inputSpring.y), 
                UnityEngine.Color.blue);
        }

        var rotation = _rigidbody.rotation;
        //move towards pointing up a bit each frame
        {
            var forward = rotation * UnityEngine.Vector3.forward;
            forward.y = 0.0f;
            forward.Normalize();
            var right = UnityEngine.Vector3.Cross( forward, UnityEngine.Vector3.up );

            var upOffset = (forward * inputSpring.y) - (right * inputSpring.x);
            var tiltUp = (UnityEngine.Vector3.up * 2.0f) + upOffset;
            tiltUp.Normalize();

            forward = UnityEngine.Vector3.Cross( tiltUp, right );

            var rotTarget = UnityEngine.Quaternion.LookRotation(forward, tiltUp);
            float step = 30.0f * UnityEngine.Time.fixedDeltaTime;

            //var drawPosBase = _rigidbody.position;
            //UnityEngine.Debug.DrawLine(
            //    drawPosBase, 
            //    drawPosBase + (rotation * UnityEngine.Vector3.forward), 
            //    UnityEngine.Color.blue);

            rotation = UnityEngine.Quaternion.RotateTowards(rotation, rotTarget, step);
        }

        {
            var forward = rotation * UnityEngine.Vector3.forward;
            var up = rotation * UnityEngine.Vector3.up;
            var viewDelta = UnityEngine.Quaternion.AngleAxis(_creatureState.inputView.x * UnityEngine.Time.fixedDeltaTime * 600.0f, UnityEngine.Vector3.up);
            var newForward = viewDelta * forward;
            var newUp = viewDelta * up;
            var newRotation = UnityEngine.Quaternion.LookRotation(newForward, newUp);
            rotation = newRotation;
        }

        _rigidbody.MoveRotation(rotation);

        {
            var forward = rotation * UnityEngine.Vector3.forward;
            forward.y = 0.0f;
            forward.Normalize();
            var right = UnityEngine.Vector3.Cross( forward, UnityEngine.Vector3.up );
            float moveMul = 2.0f * UnityEngine.Time.fixedDeltaTime;

            var newPosition = _rigidbody.position;
            newPosition += (forward * (moveMul * _creatureState.inputMove.y));
            newPosition += (right * (moveMul * -_creatureState.inputMove.x));
            _rigidbody.MovePosition(newPosition);
        }
    }

    //public interface IPlayerComponent
    public UnityEngine.Transform GetCameraTransform()
    {
        if (null != _creatureBody)
        {
            return _creatureBody.GetCameraTransform();
        }
        return gameObject.transform;
    }

}
