public class Application : UnityEngine.MonoBehaviour
{
    public static Application Instance;

    private FadeComponent _fadeComponent;
    private UIButton _uiButton;
    //private float _debugTimeAccumulation;
    //private bool _debugState;

    void Start()
    {
        Log("Application.Start()");
        //weak attempt at singelton, probabbly a better way, but addComponent is not playing nice
        Instance = this;

        _fadeComponent = gameObject.AddComponent<FadeComponent>();
        _fadeComponent.SetFade(1.0f);

        //todo: wait for scene to load before fade in
        _fadeComponent.SetFadeToTransparent(3.0f);

        _uiButton = UIButton.FactoryButton(1);
 
        //test LoadScene
        UnityEngine.SceneManagement.SceneManager.LoadScene("mainmenu", UnityEngine.SceneManagement.LoadSceneMode.Additive);

        //debug
        //_debugTimeAccumulation = 0.0f;
        //_debugState = false;
    }

    public void Log(string param)
    {
        UnityEngine.Debug.Log("Application::Log:" + param);
    }

    public void SetState(string stateFactoryName)
    {
    }

    private void OnGUI()
    {
        _uiButton.Draw();
    }

	//void Update()
	//{
	//	_debugTimeAccumulation += UnityEngine.Time.deltaTime;
	//	if (2.0f < _debugTimeAccumulation)
	//	{
	//		_debugTimeAccumulation = 0.0f;
 //           if (_debugState)
 //           {
 //               _fadeComponent.SetFadeToBlack();
 //           }
 //           else
 //           {
 //               _fadeComponent.SetFadeToTransparent();
 //           }
	//		_debugState ^= true;
	//	}
	//}
}
