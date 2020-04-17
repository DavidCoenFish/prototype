
public class TestControllerComponent : UnityEngine.MonoBehaviour
{
    private UnityEngine.GameObject _root;
    private UnityEngine.Rigidbody _rigidbody;
    private UnityEngine.GameObject _prefabDebugOrientationHint = null;
    private UnityEngine.Material _material;

    public float targetHeight = 0.0f;

    void Start()
    {
        _prefabDebugOrientationHint = UnityEngine.Resources.Load<UnityEngine.GameObject>("prefab/debugorientationhint");

        _root = new UnityEngine.GameObject("root");
        _root.SetActive(true);
        //_root.transform.parent = gameObject.transform;
        _root.transform.position = new UnityEngine.Vector3(0.0f, 1.5f, 0.0f);
        _root.layer = (int)Project.Layer.TIgnoreRaycast;
        _rigidbody = _root.AddComponent< UnityEngine.Rigidbody >();
        //_rigidbody.drag = 1.0f;
        _rigidbody.useGravity = true;
        _rigidbody.centerOfMass = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f);
        _rigidbody.inertiaTensor = new UnityEngine.Vector3(1.0f, 1.0f, 1.0f);

        {
            var collider = _root.AddComponent<UnityEngine.SphereCollider>();
            collider.center = UnityEngine.Vector3.zero;
            collider.radius = 0.5f;
        }

        {
            var debugOrientationHint = UnityEngine.Object.Instantiate(_prefabDebugOrientationHint);
            debugOrientationHint.SetActive(true);
            debugOrientationHint.transform.parent = _root.transform;
            debugOrientationHint.transform.localPosition = UnityEngine.Vector3.zero;
            debugOrientationHint.transform.localRotation = UnityEngine.Quaternion.identity;

            var renderer = debugOrientationHint.GetComponent<UnityEngine.Renderer>();
            _material = renderer.material;
        }

#if true
        {
            var child = new UnityEngine.GameObject("child");
            child.SetActive(true);
            child.transform.position = new UnityEngine.Vector3(0.0f, 3.0f, -0.5f);
            child.transform.parent = _root.transform;
            child.layer = (int)Project.Layer.TIgnoreRaycast;
            var rigidbody = child.AddComponent< UnityEngine.Rigidbody >();
            rigidbody.useGravity = true;
            rigidbody.centerOfMass = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f);
            rigidbody.inertiaTensor = new UnityEngine.Vector3(1.0f, 1.0f, 1.0f);

            var collider = child.AddComponent<UnityEngine.SphereCollider>();
            collider.center = UnityEngine.Vector3.zero;
            collider.radius = 0.5f;

            var characterJoint = child.AddComponent<UnityEngine.CharacterJoint>();
            characterJoint.connectedBody = _rigidbody;

            {
                var debugOrientationHint = UnityEngine.Object.Instantiate(_prefabDebugOrientationHint);
                debugOrientationHint.SetActive(true);
                debugOrientationHint.transform.parent = child.transform;
                debugOrientationHint.transform.localPosition = UnityEngine.Vector3.zero;
                debugOrientationHint.transform.localRotation = UnityEngine.Quaternion.identity;
            }
        }
#endif
    }

    //https://answers.unity.com/questions/171859/figuring-out-the-correct-amount-of-torque-to-apply.html
    private UnityEngine.Vector3 OrientTorque(UnityEngine.Vector3 torque)
    {
        // Quaternion's Euler conversion results in (0-360)
        // For torque, we need -180 to 180.
 
        return new UnityEngine.Vector3(
            torque.x > 180f ? 180f - torque.x : torque.x,
            torque.y > 180f ? 180f - torque.y : torque.y,
            torque.z > 180f ? 180f - torque.z : torque.z
        );
    }

    void FixedUpdate()
    {
        int layerMask = (int)Project.LayerFlag.TDefault;
        UnityEngine.RaycastHit raycastHit;
        var hit = UnityEngine.Physics.SphereCast(
            new UnityEngine.Ray(_root.transform.position, new UnityEngine.Vector3(0.0f, -1.0f, 0.0f)),
            0.5f,
            out raycastHit,
            targetHeight,
            layerMask
            );

        //force
#if true
        {
            var targetVerticalVelocity = 0.0f;
            if (hit)
            {
                targetVerticalVelocity = (targetHeight - raycastHit.distance) * 2.0f;
            }

            var targetVelocity = new UnityEngine.Vector3(
                2.0f * UnityEngine.Input.GetAxis("Horizontal_Alt"),
                targetVerticalVelocity, //0.0f, //UnityEngine.Input.GetAxis("Dolly_Alt"),
                2.0f * UnityEngine.Input.GetAxis("Vertical_Alt")
                );

            var deltaVelocity = targetVelocity - _rigidbody.velocity;
            var acceleration = deltaVelocity / UnityEngine.Time.fixedDeltaTime;
            if (false == hit)
            {
                acceleration.y = 0.0f;
                _material.SetColor("_Color", UnityEngine.Color.red);
            }
            else
            {
                _material.SetColor("_Color", UnityEngine.Color.blue);
            }

            _rigidbody.AddForce(acceleration, UnityEngine.ForceMode.Acceleration);
        }
#endif
#if true
        //torque
        //https://answers.unity.com/questions/171859/figuring-out-the-correct-amount-of-torque-to-apply.html
        { 
            var rotEular = OrientTorque(UnityEngine.Quaternion.FromToRotation(_root.transform.up, UnityEngine.Vector3.up).eulerAngles) * UnityEngine.Mathf.Deg2Rad;

            var targetRot = rotEular; // * 0.5f;
            var deltaRot = targetRot - _rigidbody.angularVelocity;

            var acceleration = deltaRot / UnityEngine.Time.fixedDeltaTime;

            _rigidbody.AddTorque(acceleration, UnityEngine.ForceMode.Acceleration);
        }
#endif
    }

    void Update()
    {
        gameObject.transform.position = new UnityEngine.Vector3(_root.transform.position.x, 0.0f, _root.transform.position.z);
    }


    //private UnityEngine.Rigidbody _rigidbody;
    //private UnityEngine.Material _material;
    //private float _hoverHeight;

    //public float Kp;
    //public float Ki;
    //public float Kd;
 
    //private UnityEngine.Vector3 _totalError = new UnityEngine.Vector3( 0, 0, 0 );
    //private UnityEngine.Vector3 _lastError = new UnityEngine.Vector3( 0, 0, 0 );

    //// Start is called before the first frame update
    //void Start()
    //{
    //    _rigidbody = gameObject.GetComponent< UnityEngine.Rigidbody >();
    //    _hoverHeight = 1.5f;

    //    var renderer = gameObject.GetComponent<UnityEngine.Renderer>();
    //    _material = renderer.material;
    //}

    //void FixedUpdate()
    //{
    //    int layerMask = (int)Project.LayerFlag.TDefault;
    //    //UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(gameObject.transform.position.x, gameObject.transform.position.y - 0.05f, gameObject.transform.position.z);
    //    //UnityEngine.Vector3 touchingGroundPosition = gameObject.transform.position;
    //    //bool touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, UnityEngine.QueryTriggerInteraction.Ignore);
    //    //UnityEngine.Physics.Raycast(new UnityEngine.Ray(
    //    UnityEngine.RaycastHit raycastHit;
    //    //var hit = UnityEngine.Physics.SphereCast(
    //    //    new UnityEngine.Ray(gameObject.transform.position, new UnityEngine.Vector3(0.0f, -1.0f, 0.0f)),
    //    //    0.5f, 
    //    //    out raycastHit,
    //    //    _hoverHeight,
    //    //    layerMask
    //    //    );

    //    var hit = UnityEngine.Physics.Raycast(
    //        new UnityEngine.Ray(gameObject.transform.position, new UnityEngine.Vector3(0.0f, -1.0f, 0.0f)),
    //        out raycastHit,
    //        _hoverHeight,
    //        layerMask
    //        );

    //    if (false == hit)
    //    {
    //        _material.SetColor("_Color", UnityEngine.Color.red);
    //        return;
    //        //raycastHit.distance;

    //    }
    //        _material.SetColor("_Color", UnityEngine.Color.blue);


    //    //
    //    //_rigidbody.AddForce(new UnityEngine.Vector3(0.0f, 10.0f, 0.0f), UnityEngine.ForceMode.Acceleration);
    //    //var heightDelta = _hoverHeight - raycastHit.distance;

    //    //gameObject.transform.position - this.DestinationPosition;
    //    //var currentError = gameObject.transform.position + new UnityEngine.Vector3(0.0f, heightDelta, 0.0f);
    //    var currentError = new UnityEngine.Vector3(0.0f, raycastHit.distance - _hoverHeight, 0.0f);
            
    //    //https://en.wikipedia.org/wiki/PID_controller
    //    UnityEngine.Vector3 cp = currentError * Kp;
    //    UnityEngine.Vector3 cd = Kd * (_lastError - currentError) / UnityEngine.Time.fixedDeltaTime;
    //    UnityEngine.Vector3 ci = _totalError * Ki * UnityEngine.Time.fixedDeltaTime;
 
    //    _lastError = currentError;
    //    _totalError += currentError;
 
    //    var navigationForce = UnityEngine.Vector3.ClampMagnitude( cp + ci + cd, 300.0f );
    //    var standardForce = _rigidbody.useGravity ? (UnityEngine.Physics.gravity * _rigidbody.mass * -1) : new UnityEngine.Vector3( 0, 0, 0 );
 
    //    var finalForce = standardForce - navigationForce;
 
    //    _rigidbody.AddForce( finalForce );
    //}
}
