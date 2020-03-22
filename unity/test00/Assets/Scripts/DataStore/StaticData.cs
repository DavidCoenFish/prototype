public class StaticData
{
    public static StaticData Factory()
    {
		string filePath = "gamedata";
		SimpleJSON.JSONNode jsonNode = null;
		try
		{
			UnityEngine.TextAsset textAsset = UnityEngine.Resources.Load(filePath, typeof(UnityEngine.TextAsset)) as UnityEngine.TextAsset;
	        //Bootstrap.Log(textAsset.text);
			jsonNode = SimpleJSON.JSON.Parse(textAsset.text);
		}
        catch (System.Exception e)
        {
            Bootstrap.Warn(e.ToString());
        }
        return new StaticData(jsonNode);
    }

    SimpleJSON.JSONNode _jsonNode;
    StaticData(SimpleJSON.JSONNode jsonNode)
    {
        _jsonNode = jsonNode;
    }

    public string GetVersion()
    {
        if ((null != _jsonNode) && (null != _jsonNode["version"]))
        {
            return _jsonNode["version"];
        }
        return "";
    }

    public string GetString(string path)
    {
        SimpleJSON.JSONNode node = GetNode(path);
        if (null != node)
        {
            return node.Value;
        }
        Bootstrap.Warn("LocaleData.GetString() path not found:" + path);
        return "";
    }

    public float GetFloat(string path)
    {
        SimpleJSON.JSONNode node = GetNode(path);
        if (null != node)
        {
            return node.AsFloat;
        }
        Bootstrap.Warn("LocaleData.GetFloat() path not found:" + path);
        return 0.0f;
    }

    private SimpleJSON.JSONNode GetNode(string path)
    {
        System.String[] seperator = {"."};
        System.String[] splitPath = path.Split(seperator, System.StringSplitOptions.None);
        SimpleJSON.JSONNode result = _jsonNode;
        foreach( string split in splitPath)
        {
            if (null == result)
            {
                return result;
            }
            result = result[split];
        }
        return result;
    }

    //[Serializable]
    //public class GameDataGhost
    //{
    //    public float top_speed_horizontal;
    //    public float on_move_release_horizontal_dampen;
    //    public float jump_speed;
    //    public float jump_speed_dampen;
    //    public float down_speed;
    //    public float on_down_release_dampen;
    //}

    //[Serializable]
    //public class GameDataGame
    //{
    //    public float vfov_degrees;
    //    public float flick_duration;
    //    public float tap_duration;
    //}

    //[Serializable]
    //public class GameDataCreatures
    //{
    //    public string id;
    //    public float health;
    //    public float def_mellee_hand;
    //    public float def_mellee_weapon;
    //    public float def_range;
    //    public float max_move;
    //    public float jump_height;
    //    public float height;
    //    public float damage_mellee_hand;
    //    public float damage_mellee_special;
    //    public float damage_mellee_weapon;
    //}

    //[Serializable]
    //public class GameDataKeyStringValueString
    //{
    //    public string k;
    //    public string v;
    //}

    //[Serializable]
    //public class GameData
    //{
    //    public string version;
    //    public GameDataGhost ghost;
    //    public GameDataGame game;
    //    public GameDataCreatures[] creatures;
    //    public GameDataKeyStringValueString[] locale;
    //}
}
