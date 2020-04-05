public class CreatureRigidBody
{
    private UnityEngine.Rigidbody _rigidbody = null;
    private SpringUnitSphere _inputSpring;

    public CreatureRigidBody(UnityEngine.GameObject parent, CreatureState creatureState)
    {
        //_rigidbody = gameObject.AddComponent<UnityEngine.Rigidbody>();
        _rigidbody = parent.GetComponent< UnityEngine.Rigidbody >();
        //_rigidbody.constraints = UnityEngine.RigidbodyConstraints.FreezeRotationX | UnityEngine.RigidbodyConstraints.FreezeRotationZ;
        _rigidbody.useGravity = true;
        _rigidbody.centerOfMass = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f);
        _rigidbody.inertiaTensor = new UnityEngine.Vector3(1.0f, 1.0f, 1.0f);
        parent.layer = (int)Project.Layer.TIgnoreRaycast;

        var collider = parent.AddComponent<UnityEngine.CapsuleCollider>();
        collider.center = new UnityEngine.Vector3(0.0f, creatureState.height * 0.5f, 0.0f);
        collider.height = creatureState.height;
        collider.radius = creatureState.height * 0.25f;
        
        _inputSpring = new SpringUnitSphere(10.0f, UnityEngine.Vector2.up, 1.0f);

    }

    public void Update(UnityEngine.GameObject parent, float timeDelta, CreatureState creatureState)
    {
        int layerMask = (int)Project.LayerFlag.TDefault;
        UnityEngine.Vector3 touchingGroundPosition = new UnityEngine.Vector3(parent.transform.position.x, parent.transform.position.y - 0.05f, parent.transform.position.z);
        bool touchingGround = UnityEngine.Physics.CheckSphere(touchingGroundPosition, 0.1f, layerMask, UnityEngine.QueryTriggerInteraction.Ignore);

        //if (UnityEngine.Input.GetButtonDown("Jump"))
        if ((0.0f < creatureState.creatureStatePerUpdate.jump) && (true == touchingGround))
        {
            //_rigidbody.AddForce(UnityEngine.Vector3.up * UnityEngine.Mathf.Sqrt(-1f * UnityEngine.Physics.gravity.y), UnityEngine.ForceMode.VelocityChange);
            float jumpMag = UnityEngine.Mathf.Sqrt(-2.0f * creatureState.creatureStatePerUpdate.jump * UnityEngine.Physics.gravity.y);
            _rigidbody.AddForce(UnityEngine.Vector3.up * jumpMag, UnityEngine.ForceMode.VelocityChange);
        }

    }

    public void FixedUpdate(float timeDelta, CreatureState creatureState)
    {
        if (null == creatureState.creatureStatePerUpdate)
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

        newRotation = FixedUpdateUpdateView(newRotation, creatureState, timeDelta);
        //FixedUpdateUpdateViewSpring(newRotation, creatureState, _inputSpring, creatureBody);
        newPosition = FixedUpdateUpdateMove(newPosition, newRotation, creatureState);

        _rigidbody.MoveRotation(newRotation);
        _rigidbody.MovePosition(newPosition);

    }

    private static UnityEngine.Quaternion FixedUpdateUpdateView(UnityEngine.Quaternion newRotation, CreatureState creatureState, float timeDelta)
    {
        var viewDelta = UnityEngine.Quaternion.AngleAxis(creatureState.creatureStatePerUpdate.inputView.x * timeDelta * 600.0f, UnityEngine.Vector3.up);
        var forward = (newRotation * viewDelta) * UnityEngine.Vector3.forward;
        forward.y = 0.0f;
        forward.Normalize();
        var resultRotation = UnityEngine.Quaternion.LookRotation(forward, UnityEngine.Vector3.up);
        return resultRotation;
    }

//    private static UnityEngine.Quaternion FixedUpdateUpdateViewSpring(UnityEngine.Quaternion newRotation, CreatureState creatureState, SpringUnitSphere inputSpring, CreatureBody _creatureBody)
//    {
//#if false
//        var forward = newRotation * UnityEngine.Vector3.forward;
//        forward.y = 0.0f;
//        forward.Normalize();
//        var right = UnityEngine.Vector3.Cross(forward, UnityEngine.Vector3.up);
//#else
//        var forward = UnityEngine.Vector3.forward;
//        var right = UnityEngine.Vector3.right;
//#endif
//        var target = (UnityEngine.Vector3.up * 4.0f) + (forward * creatureState.creatureStatePerUpdate.inputMove.y) + (right * creatureState.creatureStatePerUpdate.inputMove.x);
//        target.Normalize();
//        var springResult = inputSpring.Advance(target, UnityEngine.Time.fixedDeltaTime);
//        var mod = UnityEngine.Quaternion.FromToRotation(springResult, target);
//        _creatureBody.SetRoot(mod);
//        return newRotation;
//    }

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

}
