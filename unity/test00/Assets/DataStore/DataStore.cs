public class DataStore
{
    private StaticData _staticData;
    private UserData _userData;
    private LocaleData _localeData;
    private bool _hasFinishedLoad = false;

    public DataStore()
    {
        // not quite in a thread yet
        //StartCoroutine (Init());
    }

    public bool HasFinishedLoad()
    {
        return _hasFinishedLoad;
    }

    public System.Collections.IEnumerator Init()
    {
        _staticData = StaticData.Factory();
        //Application.Instance.Log("GetVersion:" + _staticData.GetVersion());
        //Application.Instance.Log("GetVersion:" + _staticData.GetString("version"));
        yield return null;
        _userData = UserData.Factory();
        yield return null;
        _localeData = LocaleData.Factory(_userData.locale);
        //string test = _localeData.GetValue("hint_4");
        yield return null;
        _hasFinishedLoad = true;
    }
}
