//https://medium.com/ironequal/unity-character-controller-vs-rigidbody-a1e243591483
using System;

public class CreatureComponent : UnityEngine.MonoBehaviour, IPlayerComponent
{
    public bool startHumanControlled = false;
    public string typeName = "rat"; //[rat, chicken, sheep, dog, bear, elephant, gate

    private CreatureState _creatureState = null;
    private CreatureBodyVisual _creatureBodyVisual = null;
    private CreatureBodyPhysics _creatureBodyPhysics = null;

    private ThirdPersonCameraComponent _thirdPersonCameraComponent = null;

    private void Start()
    {
        UnityEngine.Debug.Log("CreatureComponent.Start", this);

        _thirdPersonCameraComponent = GetComponent<ThirdPersonCameraComponent>();

        _creatureState = new CreatureState(typeName, this.gameObject);
        _creatureBodyVisual = new CreatureBodyVisual();
        //_creatureBodyPhysics = new CreatureBodyPhysics(typeName);

        if (true == startHumanControlled)
        {
            GameComponent.SetHumanPlayer(0, this);
        }
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
    }

    private void FixedUpdate()
    {
        float timeDelta = UnityEngine.Time.fixedDeltaTime;
    }

    private void OnGUI()
    {
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
