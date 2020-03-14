public class Application : UnityEngine.MonoBehaviour
{
    public static Application Instance;

    private DataStore _dataStore;
    private FadeComponent _fadeComponent;
    private UIButton _uiButton;
    //private float _debugTimeAccumulation;
    //private bool _debugState;

    private System.Collections.IEnumerator Start()
    {
        Log("Application.Start()");
        //weak attempt at singelton, probabbly a better way
        Instance = this;

        _fadeComponent = gameObject.AddComponent<FadeComponent>();
        _fadeComponent.SetFade(1.0f);

        _uiButton = UIButton.FactoryButton(1);

        _dataStore = new DataStore();

        //wait for async tasks before load
        yield return StartCoroutine (AsyncStart());

        _fadeComponent.SetFadeToTransparent();
    }

    private System.Collections.IEnumerator AsyncStart()
    {
        yield return StartCoroutine (_dataStore.Init());

        while (!_dataStore.HasFinishedLoad())
        {
            yield return null;
        }
        yield return UnityEngine.SceneManagement.SceneManager.LoadSceneAsync("mainmenu", UnityEngine.SceneManagement.LoadSceneMode.Additive);
    }

    public void Log(string param)
    {
        UnityEngine.Debug.Log("Application::Log:" + param);
    }

    public System.Collections.IEnumerator SetState(string stateFactoryName)
    {
        yield return null;
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
