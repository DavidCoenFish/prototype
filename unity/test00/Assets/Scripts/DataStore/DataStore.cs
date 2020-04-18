public class DataStore
{
    private StaticData _staticData;
    private UserData _userData;
    private LocaleData _localeData;

    public DataStore()
    {
        // not quite in a thread yet
        //StartCoroutine (Init());
    }

	public StaticData staticData
	{
		get
		{
			return _staticData;
		}
	}
	public UserData userData
	{
		get
		{
			return _userData;
		}
	}
	public LocaleData localeData
	{
		get
		{
			return _localeData;
		}
	}

	public void InitSync()
	{
        _staticData = StaticData.Factory();
        _userData = UserData.Factory();
        _localeData = LocaleData.Factory(_userData.locale);
	}

	//fake threading in the main thread for now
	public System.Collections.IEnumerator Init()
    {
        _staticData = StaticData.Factory();
        //Bootstrap.Instance.Log("GetVersion:" + _staticData.GetVersion());
        //Bootstrap.Instance.Log("GetVersion:" + _staticData.GetString("version"));
        yield return null;
        _userData = UserData.Factory();
        yield return null;
        _localeData = LocaleData.Factory(_userData.locale);
        //string test = _localeData.GetValue("hint_4");
        yield return null;
    }
}
