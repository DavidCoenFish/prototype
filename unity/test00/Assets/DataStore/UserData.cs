/*
persistant data stored accross sessions (options?)
 */
public class UserData
{
    public static UserData Factory()
    {
        return new UserData();
    }

    [System.Serializable]
    public class UserDataReflect
    {
        public string locale;

        public static UserDataReflect Factory()
        {
            return new UserDataReflect(){ locale = "en"};
        }
    }

    //C:/Users/David/AppData/LocalLow/DefaultCompany/test00/userdata.json
    private string _filePath = UnityEngine.Application.persistentDataPath + "/userdata.json";
    private UserDataReflect _userDataReflect;
	//private DagNodeValue<string> _dagLocale;
	//public DagNodeValue<string> locale

	public string locale
	{
		get { return _userDataReflect.locale; }
		set { _userDataReflect.locale = value; Save(); }
	}

	UserData()
    {
        //Bootstrap.Instance.Log("UserData.UserData() _filePath:" + _filePath);
        _userDataReflect = UserDataReflect.Factory();
        Load();
    }
    public void Load()
    {   
        //Bootstrap.Instance.Log("UserData.Load()");
        if (System.IO.File.Exists(_filePath))
        {
            try
            {
                string fileData = System.IO.File.ReadAllText(_filePath);
                UnityEngine.JsonUtility.FromJsonOverwrite(fileData, _userDataReflect);
            }
            catch (System.Exception e)
            {
                Bootstrap.Warn(e.ToString());
            }
        }
        else
        {
            Save();
        }
    }
    public void Save()
    {
        //Bootstrap.Instance.Log("UserData.Save()");
        string contents = UnityEngine.JsonUtility.ToJson(_userDataReflect);
        System.IO.File.WriteAllText(_filePath, contents);
    }
}
