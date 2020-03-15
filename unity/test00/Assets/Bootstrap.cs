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

    public static Bootstrap Instance;

    private DataStore _dataStore;
    private FadeComponent _fadeComponent;
    private string _lastStateName = null;
    //private UnityEngine.SceneManagement.Scene _scene;

    private System.Collections.IEnumerator Start()
    {
        Log("Bootstrap.Start()");
        //weak attempt at singelton, probabbly a better way
        Instance = this;

        _fadeComponent = gameObject.AddComponent<FadeComponent>();
        _fadeComponent.SetDepth((int)UIRenderDepth.BootstrapFade);
        _fadeComponent.SetFade(1.0f); //start off black

        _dataStore = new DataStore();
        yield return _dataStore.Init();

        yield return SetStateInternal("mainmenu");
    }

    public DataStore dataStore
    {
        get
        {
            return _dataStore;
        }
    }

    public void Log(string param, UnityEngine.Object context = null)
    {
        UnityEngine.Debug.Log("Bootstrap::Log:" + param, context);
    }
    public void Warn(string param, UnityEngine.Object context = null)
    {
        UnityEngine.Debug.LogWarning("Bootstrap::Warn:" + param, context);
    }

    public void SetState(string stateName)
    {
        StartCoroutine(SetStateInternal(stateName));
    }

    //stateName is now scene name?
    //was planning on wrapping the state in a factory, and have it have a "HasFinished" method for load/ unload...
    //but does LoadSceneAsync, UnloadSceneAsync and IEnumerator Start() cover that for us?
    private System.Collections.IEnumerator SetStateInternal(string stateName)
    {
        Bootstrap.Instance.Log("SetState:" + stateName, this);
        yield return null;

        _fadeComponent.SetFadeToFullyObscuring(); // go from whatever state currently in to black
        while(false == _fadeComponent.IsFadeFullyObscuring())
        {
            yield return null;
        }

        if (null != _lastStateName)
        {
            yield return UnityEngine.SceneManagement.SceneManager.UnloadSceneAsync(_lastStateName);
            _lastStateName = null;
        }

        yield return UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(stateName, UnityEngine.SceneManagement.LoadSceneMode.Additive);
        _lastStateName = stateName;

        //todo: is there some way to itterate over all the children of the added scene to see if their "Start" method has finished?

        _fadeComponent.SetFadeToTransparent();
    }
}
