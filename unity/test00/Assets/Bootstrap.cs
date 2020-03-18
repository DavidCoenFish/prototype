/*
 script inpoint
 */
public class Bootstrap : UnityEngine.MonoBehaviour
{
    //lame, but easier to deal with if the gui depth definitions are centralised
    public enum UIRenderDepth : int
    {
        BootstrapFade = 0,
        Menu = 1,
        FadeOverHUD = 2,
        EffectOverHud = 3,
        HUD = 4
    }

    private static Bootstrap _instance;
    private DataStore _dataStore;
    private FadeComponent _fadeComponent;
    private string _lastStateName = null;
    //private UnityEngine.SceneManagement.Scene _scene;

    public UnityEngine.Camera bootstrapCamera;

    void Awake()
    {
        Log("Bootstrap.Awake()");
        //Singleton pattern
        if(_instance == null)
        {
            DontDestroyOnLoad(gameObject);
            _instance = this;
        }
        else if(_instance != this)
        {
            Destroy(gameObject);
        }
    }

    private System.Collections.IEnumerator Start()
    {
        Log("Bootstrap.Start()");

        _fadeComponent = gameObject.AddComponent<FadeComponent>();
        _fadeComponent.SetDepth((int)UIRenderDepth.BootstrapFade);
        _fadeComponent.SetFade(1.0f); //start off black

        _dataStore = new DataStore();
        yield return _dataStore.Init();

        yield return SetStateInternal("mainmenu");
    }

    public static void Log(string param, UnityEngine.Object context = null)
    {
        UnityEngine.Debug.Log("Bootstrap::Log:" + param, context);
    }
    public static void Warn(string param, UnityEngine.Object context = null)
    {
        UnityEngine.Debug.LogWarning("Bootstrap::Warn:" + param, context);
    }

    public static void SetState(string stateName)
    {
        if (null != _instance)
        {
            _instance.StartCoroutine(_instance.SetStateInternal(stateName));
        }
    }

    private void DisableAllCameras()
    {
        foreach (UnityEngine.Camera trace in UnityEngine.Camera.allCameras)
        {
            trace.enabled = false;
        }
    }

    //stateName is now scene name?
    //was planning on wrapping the state in a factory, and have it have a "HasFinished" method for load/ unload...
    //but does LoadSceneAsync, UnloadSceneAsync and IEnumerator Start() cover that for us?
    private System.Collections.IEnumerator SetStateInternal(string stateName)
    {
        Log("SetState:" + stateName, this);
        yield return null;

        _fadeComponent.SetFadeToFullyObscuring(); // go from whatever state currently in to black
        while(false == _fadeComponent.IsFadeFullyObscuring())
        {
            yield return null;
        }

        DisableAllCameras();
        if (null != bootstrapCamera)
        {
            bootstrapCamera.enabled = true;
        }

        if (null != _lastStateName)
        {
            yield return UnityEngine.SceneManagement.SceneManager.UnloadSceneAsync(_lastStateName);
            _lastStateName = null;
        }

        yield return UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(stateName, UnityEngine.SceneManagement.LoadSceneMode.Additive);
        _lastStateName = stateName;

        if (null != bootstrapCamera)
        {
            bootstrapCamera.enabled = false;
        }

        //todo: is there some way to itterate over all the children of the added scene to see if their "Start" method has finished?

        _fadeComponent.SetFadeToTransparent();
    }

    public static DataStore GetDataStore()
    {
        return _instance._dataStore;
    }
}
