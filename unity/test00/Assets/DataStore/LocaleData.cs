public class LocaleData
{
	public static LocaleData Factory(string locale)
	{
		string filePath = "locale/" + locale;
		SimpleJSON.JSONObject jsonObject = null;
		try
		{
			UnityEngine.TextAsset textAsset = UnityEngine.Resources.Load(filePath, typeof(UnityEngine.TextAsset)) as UnityEngine.TextAsset;
	        //Application.Instance.Log(textAsset.text);
			SimpleJSON.JSONNode jsonNode = SimpleJSON.JSON.Parse(textAsset.text);
			jsonObject = jsonNode["locale"] as SimpleJSON.JSONObject;
		}
        catch (System.Exception e)
        {
            Application.Instance.Log(e.ToString());
        }
		return new LocaleData(jsonObject);
	}

	private SimpleJSON.JSONObject _jsonObject;

	public LocaleData(SimpleJSON.JSONObject jsonObject)
	{
        //Application.Instance.Log("LocaleData.LocaleData()");
		_jsonObject = jsonObject;
	}

	public string GetValue(string key)
	{
		if ((null != _jsonObject) && (_jsonObject.ContainsKey(key)))
		{
	        //Application.Instance.Log("LocaleData.GetValue() key:" + key + " value:" + _jsonObject[key]);
			return _jsonObject[key];
		}
        //Application.Instance.Log("LocaleData.GetValue() key not found:" + key);
		return "<locale key:" + key + " not found>";
	}

}
