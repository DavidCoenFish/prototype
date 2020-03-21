//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
public class CreatureComponent : UnityEngine.MonoBehaviour, IPlayerComponent
{
    public bool startHumanControlled = false;
    public string typeName = "rat"; //[rat, chicken, sheep, dog, bear, elephant, gate

    private ICreatureController _creatureController = null;
    private CreatureState _creatureState = null; //null;
    private CreatureBody _creatureBody = null;
    private UnityEngine.Rigidbody _rigidbody = null;

    private float _debugTimeAccumulate = 0.0f;

    void Start()
    {
        UnityEngine.Debug.Log("CreatureComponent.Start", this);

        if (true == startHumanControlled)
        {
            _creatureController = new CreatureControllerHuman();
        }
        else
        {
            _creatureController = new CreatureControllerAI();
        }

        _rigidbody = gameObject.AddComponent<UnityEngine.Rigidbody>();
        _rigidbody.constraints = UnityEngine.RigidbodyConstraints.FreezeRotationX | UnityEngine.RigidbodyConstraints.FreezeRotationZ;
        _rigidbody.useGravity = true;

        _creatureState = new CreatureState(typeName);
        _creatureBody = new CreatureBody( this.gameObject, _creatureState);
    }

    void Update()
    {
        //Time.deltaTime
        //int layerMask = 1 << 8;
        //todo: may need info on 
        //UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(gameObject.transform.position.x, gameObject.transform.position.y - (0.55f * _height), gameObject.transform.position.z);
        //_touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, UnityEngine.QueryTriggerInteraction.Ignore);

        //bool doJump = UpdateTouchData(_inputTouchData, UnityEngine.Time.deltaTime);

        _debugTimeAccumulate += UnityEngine.Time.deltaTime;
        _creatureState.pose = 0.0f < UnityEngine.Mathf.Sin(_debugTimeAccumulate * 0.5f) ? CreatureState.TPose.Crouching : CreatureState.TPose.Standing;

        //temp, move authoraty to gameComponent
        GameComponent.SetHumanPlayer(0, this);

        if (null != _creatureController)
        {
            _creatureController.ApplyInputToState(_creatureState);
        }

        _creatureBody.Update(_creatureState);
    }

    void FixedUpdate()
    {
        var rotationDelta = UnityEngine.Quaternion.Slerp(UnityEngine.Quaternion.identity, _creatureState.rotationDelta, UnityEngine.Time.fixedDeltaTime);
        _rigidbody.MoveRotation(_rigidbody.rotation * rotationDelta);
        _rigidbody.MovePosition(_rigidbody.position + (_creatureState.moveDelta * UnityEngine.Time.fixedDeltaTime));
    }

    //public interface IPlayerComponent
    public UnityEngine.Transform GetCameraTransform()
    {
        return gameObject.transform;
    }

}
