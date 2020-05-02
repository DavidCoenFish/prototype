//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
using System;

public class CreatureComponent : UnityEngine.MonoBehaviour, IPlayerComponent
{
    public bool startHumanControlled = false;
    public string typeName = "rat"; //[rat, chicken, sheep, dog, bear, elephant, gate

    private CreatureState _creatureState = null;
    private CreatureBodyVisual _creatureBodyVisual = null;
    private CreatureBodyPhysics _creatureBodyPhysics = null;
    private ICreatureController _creatureController = null;
    private CreatureHud2D _creatureHud2D = null;

    private ThirdPersonCameraComponent _thirdPersonCameraComponent = null;

    private void Start()
    {
        UnityEngine.Debug.Log("CreatureComponent.Start", this);

        _thirdPersonCameraComponent = GetComponent<ThirdPersonCameraComponent>();

        _creatureState = new CreatureState(typeName, gameObject);
        _creatureBodyVisual = new CreatureBodyVisual();
        _creatureBodyPhysics = new CreatureBodyPhysics(gameObject, _creatureState);

        if (true == startHumanControlled)
        {
            GameComponent.SetHumanPlayer(0, this);
            _creatureController = new CreatureControllerHuman();
        }
        else
        {
            _creatureController = new CreatureControllerAI();
        }

        _creatureHud2D = new CreatureHud2D();
    }

    private void Update()
    {
        float timeDelta = UnityEngine.Time.deltaTime;

        if (null != _creatureState)
        {
            _creatureState.StartOfUpdate();
        }

        if (null != _creatureHud2D)
        {
            _creatureHud2D.Update();
        }

        if (null != _creatureController)
        {
            _creatureController.Update(_creatureState, timeDelta);
        }

        if (null != _creatureBodyPhysics)
        {
            _creatureBodyPhysics.Update(gameObject, _creatureState);
        }

        if (null != _creatureState)
        {
            _creatureState.Update();
        }

        if (null != _creatureBodyVisual)
        {
            _creatureBodyVisual.Update(_creatureState, gameObject.transform);
        }
    }

    private void FixedUpdate()
    {
        float fixedDeltaTime = UnityEngine.Time.fixedDeltaTime;

        if (null != _creatureBodyPhysics)
        {
            _creatureBodyPhysics.FixedUpdate(fixedDeltaTime, _creatureState);
        }

    }

    private void OnGUI()
    {
        if (null != _creatureHud2D)
        {
            _creatureHud2D.Draw(_creatureState);
        }
    }

    //void OnCollisionStay(Collision collisionInfo)

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
