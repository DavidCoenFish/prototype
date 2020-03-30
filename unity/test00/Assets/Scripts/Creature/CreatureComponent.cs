//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
using System;

public class CreatureComponent : UnityEngine.MonoBehaviour, IPlayerComponent
{
    public bool startHumanControlled = false;
    public string typeName = "rat"; //[rat, chicken, sheep, dog, bear, elephant, gate

    private ICreatureController _creatureController = null;
    private CreatureState _creatureState = null;
    private CreatureBody _creatureBody = null;
    private UnityEngine.Rigidbody _rigidbody = null;
    private SpringUnitSphere _inputSpring;
    private CreatureUI _creatureUI = null;
    private CreatureHudGeometry _creatureScreenSpace = null;

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
        gameObject.layer = (int)Project.Layer.TIgnoreRaycast;

        _creatureState = new CreatureState(typeName);
        _creatureBody = new CreatureBody( this.gameObject, _creatureState);

        var collider = gameObject.AddComponent<UnityEngine.CapsuleCollider>();
        collider.center = new UnityEngine.Vector3(0.0f, _creatureState.height * 0.5f, 0.0f);
        collider.height = _creatureState.height;
        collider.radius = _creatureState.height * 0.25f;
        

        _inputSpring = new SpringUnitSphere(10.0f, UnityEngine.Vector2.up, 1.0f);

        if (true == startHumanControlled)
        {
            _creatureUI = new CreatureUI();
            _creatureState.firstPersonHost = true;
            _creatureScreenSpace = new CreatureHudGeometry();
        }
    }

    void Update()
    {
        float timeDelta = UnityEngine.Time.deltaTime;

        int layerMask = (int)Project.LayerFlag.TDefault;
        UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(gameObject.transform.position.x, gameObject.transform.position.y - 0.05f, gameObject.transform.position.z);
        bool touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, UnityEngine.QueryTriggerInteraction.Ignore);

        //_debugTimeAccumulate += UnityEngine.Time.deltaTime;
        //_creatureState.pose = 0.0f < UnityEngine.Mathf.Sin(_debugTimeAccumulate * 0.5f) ? CreatureState.TPose.Crouching : CreatureState.TPose.Standing;

        _creatureState.StartNewUpdate();

        if (null != _creatureController)
        {
            _creatureController.ApplyInputToState(_creatureState, timeDelta);
        }

        if (null != _creatureBody)
        {
            _creatureBody.Update(_creatureState);
        }

        //if (UnityEngine.Input.GetButtonDown("Jump"))
        if ((0.0f < _creatureState.creatureStatePerUpdate.jump) && (true == touchingGround))
        {
            //_rigidbody.AddForce(UnityEngine.Vector3.up * UnityEngine.Mathf.Sqrt(-1f * UnityEngine.Physics.gravity.y), UnityEngine.ForceMode.VelocityChange);
            float jumpMag = UnityEngine.Mathf.Sqrt(-2.0f * _creatureState.creatureStatePerUpdate.jump * UnityEngine.Physics.gravity.y);
            _rigidbody.AddForce(UnityEngine.Vector3.up * jumpMag, UnityEngine.ForceMode.VelocityChange);
        }

        if (null != _creatureUI)
        {
            _creatureUI.Update();
        }
        if (null != _creatureScreenSpace)
        {
            _creatureScreenSpace.Update(_creatureState, _creatureBody.GetCameraTransform());
        }
    }

    void FixedUpdate()
    {
        if (null == _creatureState.creatureStatePerUpdate)
        {
            return;
        }

        //var drawPosBase = _rigidbody.position;
        //UnityEngine.Debug.DrawLine(
        //    drawPosBase, 
        //    drawPosBase + (UnityEngine.Vector3.up * 0.2f) + new UnityEngine.Vector3(inputSpring.x, 0.0f, inputSpring.y), 
        //    UnityEngine.Color.blue);

        var newPosition = _rigidbody.position;
        var newRotation = _rigidbody.rotation;

        newRotation = FixedUpdateUpdateView(newRotation, _creatureState);
        FixedUpdateUpdateViewSpring(newRotation, _creatureState, _inputSpring, _creatureBody);
        newPosition = FixedUpdateUpdateMove(newPosition, newRotation, _creatureState);

        _rigidbody.MoveRotation(newRotation);
        _rigidbody.MovePosition(newPosition);
    }

    private static UnityEngine.Quaternion FixedUpdateUpdateView(UnityEngine.Quaternion newRotation, CreatureState creatureState)
    {
        var viewDelta = UnityEngine.Quaternion.AngleAxis(creatureState.creatureStatePerUpdate.inputView.x * UnityEngine.Time.fixedDeltaTime * 600.0f, UnityEngine.Vector3.up);
        var forward = (newRotation * viewDelta) * UnityEngine.Vector3.forward;
        forward.y = 0.0f;
        forward.Normalize();
        var resultRotation = UnityEngine.Quaternion.LookRotation(forward, UnityEngine.Vector3.up);
        return resultRotation;
    }

    private static UnityEngine.Quaternion FixedUpdateUpdateViewSpring(UnityEngine.Quaternion newRotation, CreatureState creatureState, SpringUnitSphere inputSpring, CreatureBody _creatureBody)
    {
#if false
        var forward = newRotation * UnityEngine.Vector3.forward;
        forward.y = 0.0f;
        forward.Normalize();
        var right = UnityEngine.Vector3.Cross(forward, UnityEngine.Vector3.up);
#else
        var forward = UnityEngine.Vector3.forward;
        var right = UnityEngine.Vector3.right;
#endif
        var target = (UnityEngine.Vector3.up * 4.0f) + (forward * creatureState.creatureStatePerUpdate.inputMove.y) + (right * creatureState.creatureStatePerUpdate.inputMove.x);
        target.Normalize();
        var springResult = inputSpring.Advance(target, UnityEngine.Time.fixedDeltaTime);
        var mod = UnityEngine.Quaternion.FromToRotation(springResult, target);
        _creatureBody.SetRoot(mod);
        return newRotation;
    }

    private static UnityEngine.Vector3 FixedUpdateUpdateMove(UnityEngine.Vector3 position, UnityEngine.Quaternion rotation, CreatureState creatureState)
    {
        var forward = rotation * UnityEngine.Vector3.forward;
        forward.y = 0.0f;
        forward.Normalize();
        var right = UnityEngine.Vector3.Cross( forward, UnityEngine.Vector3.up );
        float moveMul = 2.0f * UnityEngine.Time.fixedDeltaTime;

        var newPosition = new UnityEngine.Vector3(position.x, position.y, position.z);
        newPosition += (forward * (moveMul * creatureState.creatureStatePerUpdate.inputMove.y));
        newPosition += (right * (moveMul * -creatureState.creatureStatePerUpdate.inputMove.x));

        return newPosition;
    }

    private void OnGUI()
    {
        //Bootstrap.Instance.Log("UIComponent.OnGUI()");
        if (null != _creatureUI)
        {
            _creatureUI.Draw(_creatureState);
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
