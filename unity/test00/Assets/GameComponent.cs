public class GameComponent : UnityEngine.MonoBehaviour
{
    public UnityEngine.Camera mainCamera;
    private static GameComponent _instance;
    private IPlayerComponent _playerComponent;

    void Awake()
    {
        Bootstrap.Log("Bootstrap.Awake()");
        _instance = this;
    }

    public static void SetHumanPlayer( int index, IPlayerComponent playerComponent)
    {
        if ((null != _instance) && (0 == index))
        {
            _instance._playerComponent = playerComponent;
        }
    }

    void LateUpdate()
    {
        //transform.Translate(0, Time.deltaTime, 0);
        if ((null != mainCamera) && (null != _playerComponent))
        {
            var transform = _playerComponent.GetCameraTransform();
            mainCamera.transform.position = transform.position;
            mainCamera.transform.rotation = transform.rotation;
        }
    }
}
