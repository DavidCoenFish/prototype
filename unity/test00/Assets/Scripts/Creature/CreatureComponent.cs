//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
using System;

public class CreatureComponent : UnityEngine.MonoBehaviour, IPlayerComponent
{
    public bool startHumanControlled = false;
    public string typeName = "rat"; //[rat, chicken, sheep, dog, bear, elephant, gate

    //private ICreatureController _creatureController = null;
    private CreatureState _creatureState = null;
    private CreatureBodyVisual _creatureBodyVisual = null;
    //private CreatureBodyPhysics _creatureBodyPhysics = null;
    //private CreatureHud2D _creatureHud2D = null;
    //private CreatureHud3D _creatureHud3D = null;

    private ThirdPersonCameraComponent _thirdPersonCameraComponent = null;

    private void Start()
    {
        UnityEngine.Debug.Log("CreatureComponent.Start", this);

        _thirdPersonCameraComponent = GetComponent<ThirdPersonCameraComponent>();

        _creatureState = new CreatureState(typeName, this.gameObject);
        _creatureBodyVisual = new CreatureBodyVisual();
        //_creatureRigidBody = new CreatureRigidBody(this.gameObject, _creatureState);

        if (true == startHumanControlled)
        {
            GameComponent.SetHumanPlayer(0, this);
        }
        //    _creatureController = new CreatureControllerHuman();
        //    GameComponent.SetHumanPlayer(0, this);
        //    _creatureState.firstPersonHost = true;
        //    _creatureHud2D = new CreatureHud2D();
        //    _creatureHud3D = new CreatureHud3D();
        //}
        //else
        //{
        //    _creatureController = new CreatureControllerAI();
        //}
    }

    private void Update()
    {
        float timeDelta = UnityEngine.Time.deltaTime;
        if (null != _creatureState)
        {
            _creatureState.Update();
        }


        if (null != _creatureBodyVisual)
        {
            _creatureBodyVisual.Update(_creatureState, gameObject.transform);
        }


        //_creatureRigidBody.Update(gameObject, timeDelta, _creatureState);
        //_creatureBody.Update(_creatureState);
        //_creatureState.StartNewUpdate();
        //if (null != _creatureController)
        //{
        //    _creatureController.ApplyInputToState(_creatureState, timeDelta, _creatureBody.GetCameraTransform());
        //}
        //if (null != _creatureHud3D)
        //{
        //    _creatureHud3D.Update(_creatureState, _creatureBody.GetCameraTransform());
        //}
        
        //if (null != _creatureHud2D)
        //{
        //    _creatureHud2D.Update();
        //}
    }

    private void FixedUpdate()
    {
        float timeDelta = UnityEngine.Time.fixedDeltaTime;

        //_creatureRigidBody.FixedUpdate(timeDelta, _creatureState);
    }

    private void OnGUI()
    {
        //if (null != _creatureHud2D)
        //{
        //    _creatureHud2D.Draw(_creatureState);
        //}
    }

    //public interface IPlayerComponent
    public UnityEngine.Transform GetCameraTransform()
    {
        if (_thirdPersonCameraComponent)
        {
            return _thirdPersonCameraComponent.GetCameraTransform();
        }

        return gameObject.transform;
    }

}
