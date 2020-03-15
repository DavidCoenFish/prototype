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
    //private string _lastStateName = null;
    private UnityEngine.SceneManagement.Scene _scene;

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

        yield return SetState("mainmenu");
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

    //stateName is now scene name?
    //was planning on wrapping the state in a factory, and have it have a "HasFinished" method for load/ unload...
    //but does LoadSceneAsync, UnloadSceneAsync and IEnumerator Start() cover that for us?
    public System.Collections.IEnumerator SetState(string stateName)
    {
        Bootstrap.Instance.Log("SetState:" + stateName, this);

        _fadeComponent.SetFadeToFullyObscuring(); // go from whatever state currently in to black
        while(false == _fadeComponent.IsFadeFullyObscuring())
        {
            yield return null;
        }

        //if (null != _lastStateName) //(null != _scene)
        if (true == _scene.IsValid())
        {
            Bootstrap.Instance.Log("UnloadSceneAsync:" + _scene.name, this);
            yield return UnityEngine.SceneManagement.SceneManager.UnloadSceneAsync(_scene);
            Bootstrap.Instance.Log("post UnloadSceneAsync", this);
        }
        Bootstrap.Instance.Log("LoadSceneAsync:" + stateName, this);
        yield return UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(stateName, UnityEngine.SceneManagement.LoadSceneMode.Additive);
        Bootstrap.Instance.Log("post LoadSceneAsync:" + stateName, this);
        _scene = UnityEngine.SceneManagement.SceneManager.GetSceneByName(stateName);

        //want to wait till all object in the scene have finished start?
        //while(false == _scene.isLoaded)
        //{
        //    yield return null;
        //    Bootstrap.Instance.Log("_scene.isLoaded:" + _scene.isLoaded);
        //}

        _fadeComponent.SetFadeToTransparent();
    }
}
