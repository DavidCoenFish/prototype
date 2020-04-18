/*
our job is to make the game objects to host the collision components and create the character joints

we also apply the move input to the root ridgid body

we also update the state info about the position of stuff

 */

public class CreatureBodyPhysics
{
    private UnityEngine.GameObject _root;
    private UnityEngine.Rigidbody _rootRigidbody;
    private float _targetHeight = 1.0f;

    private struct Data
    {
        public string m_name;
        public UnityEngine.GameObject m_gameObject;
    }
    private System.Collections.Generic.List< Data > _dataArray = new System.Collections.Generic.List< Data >();

    private Data MakeData(UnityEngine.GameObject master, CreatureStateBody.BodyData bodyData, float scale)
    {
        var gameObject = new UnityEngine.GameObject(bodyData.m_name);
        gameObject.SetActive(true);

        UnityEngine.GameObject parent = null;
        foreach( var data in _dataArray)
        {
            if (data.m_name == bodyData.m_parentName)
            {
                parent = data.m_gameObject;
                break;
            }
        }

        gameObject.transform.position = master.transform.position + (bodyData.m_pos * scale);
        gameObject.layer = (int)Project.Layer.TIgnoreRaycast;

        var rigidbody = gameObject.AddComponent< UnityEngine.Rigidbody >();
        //rigidbody.drag = 1.0f;
        rigidbody.useGravity = true; //true;
        rigidbody.centerOfMass = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f);
        rigidbody.inertiaTensor = new UnityEngine.Vector3(1.0f, 1.0f, 1.0f);

        if (0 != bodyData.m_radius)
        {
            var sphereCollider = gameObject.AddComponent<UnityEngine.SphereCollider>();
            sphereCollider.radius = 0.5f * scale * bodyData.m_radius;
        }

        if (null != parent)
        {
            //if (true == bodyData.m_jointParent)
            //{
                var characterJoint = gameObject.AddComponent<UnityEngine.CharacterJoint>();
                characterJoint.connectedBody = parent.GetComponent<UnityEngine.Rigidbody>();
            //}

            if (false == bodyData.m_jointParent)
            {
                //characterJoint.f
            }

            gameObject.transform.parent = parent.transform;
        }
        //attach to root if no parent
        if ((null == gameObject.transform.parent) && (null != _root))
        {
            gameObject.transform.parent = _root.transform;
        }

        return new Data(){
            m_gameObject = gameObject,
            m_name = bodyData.m_name
        };
    }

    public CreatureBodyPhysics(UnityEngine.GameObject master, CreatureState creatureState)
    { 
        float scale = 1.0f; //creatureState.creatureStateBody.height;
        bool first = true;
        int trace = 0;
        foreach( var bodyData in creatureState.creatureStateBody.bodyDataArray)
        {
            var data = MakeData(master, bodyData, scale);
            _dataArray.Add(data);
            if (true == first)
            {
                _root = data.m_gameObject;
                _rootRigidbody = _root.GetComponent< UnityEngine.Rigidbody >();
                first = false;
            }

            trace += 1;

            //if (4 == trace)
            //{
            //    break;
            //}
        }
    }

    private UnityEngine.Vector3 OrientTorque(UnityEngine.Vector3 torque)
    {
        return new UnityEngine.Vector3(
            180.0f < torque.x ? torque.x - 360.0f : torque.x,
            180.0f < torque.y ? torque.y - 360.0f : torque.y,
            180.0f < torque.z ? torque.z - 360.0f : torque.z
        );
    }

    //UnityEngine.Time.fixedDeltaTime
    public void FixedUpdate(float fixedDeltaTime, CreatureState creatureState)
    {
        if (null == _rootRigidbody)
        {
            return;
        }

        int layerMask = (int)Project.LayerFlag.TDefault;
        UnityEngine.RaycastHit raycastHit;
        var hit = UnityEngine.Physics.SphereCast(
            new UnityEngine.Ray(_root.transform.position, new UnityEngine.Vector3(0.0f, -1.0f, 0.0f)),
            0.5f,
            out raycastHit,
            _targetHeight,
            layerMask
            );

        //force
#if true
        {
            var targetVerticalVelocity = 0.0f;
            if (hit)
            {
                targetVerticalVelocity = (_targetHeight - raycastHit.distance) * 2.0f;
            }

            var targetVelocity = new UnityEngine.Vector3(
                2.0f * UnityEngine.Input.GetAxis("Horizontal"),
                targetVerticalVelocity, //0.0f, //UnityEngine.Input.GetAxis("Dolly_Alt"),
                2.0f * UnityEngine.Input.GetAxis("Vertical")
                );

            var deltaVelocity = (targetVelocity * 10.0f) - _rootRigidbody.velocity;
            var acceleration = deltaVelocity / fixedDeltaTime;
            if (false == hit)
            {
                acceleration.y = 0.0f;
            }

            _rootRigidbody.AddForce(acceleration, UnityEngine.ForceMode.Acceleration);
        }
#endif
#if true
        //torque
        { 
            var fromToRot = UnityEngine.Quaternion.FromToRotation(_root.transform.up, UnityEngine.Vector3.up).eulerAngles;
            var rotEular = OrientTorque(fromToRot);

            var targetRot = rotEular * UnityEngine.Mathf.Deg2Rad * 10.0f; // * 0.5f;
            targetRot.y += UnityEngine.Input.GetAxis("Horizontal_Alt");
            var deltaRot = targetRot - _rootRigidbody.angularVelocity;

            var acceleration = deltaRot / fixedDeltaTime;
            _rootRigidbody.AddTorque(acceleration, UnityEngine.ForceMode.Acceleration);
        }
#endif
    }


    public void Update(UnityEngine.GameObject master, CreatureState creatureState)
    {
        //todo: what height
        master.transform.position = new UnityEngine.Vector3(_root.transform.position.x, 0.0f, _root.transform.position.z);

        //_targetHeight = creatureState.

        //update the pos of each physics body for creature state body
        foreach (var data in _dataArray)
        {
            creatureState.creatureStateBody.creatureStateBodyPhysics.SetNodePos(
                data.m_name,
                data.m_gameObject.transform.position
                );
        }
    }
}
