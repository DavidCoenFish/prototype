public class DagGUIContent : IDagNodeCalculate< UnityEngine.GUIContent >
{
    //"version"
    public static DagGUIContent FactoryLocaleVersion()
    {
        DagLocale dagLocale = new DagLocale("version");
        DagNodeValue<string> dagVersion = new DagNodeValue<string>( Bootstrap.GetDataStore().staticData.GetString("version"));
        DagStringConcat dagStringConcat = new DagStringConcat(" ");
        DagNode.Link(0, dagLocale, dagStringConcat);
        DagNode.Link(1, dagVersion, dagStringConcat);
        DagGUIContent dagGUIContent = new DagGUIContent();
        DagNode.Link(0, dagStringConcat, dagGUIContent);
        return dagGUIContent;
    }

    public static DagGUIContent FactoryLocale(string key)
    {
        DagLocale dagLocale = new DagLocale(key);
        DagGUIContent dagGUIContent = new DagGUIContent();
        DagNode.Link(0, dagLocale, dagGUIContent);
        return dagGUIContent;
    }

    private DagNodeComponent _dagNodeComponent = new DagNodeComponent();
    private DagCalculateComponent _dagCalculateComponent = new DagCalculateComponent();
    private UnityEngine.GUIContent _value;
    private bool _dirty = true;

    public void SetDirty()
    {
        if (true == _dirty)
        {
            return;
        }
        _dirty = true;
        _dagNodeComponent.SetOutputDirty();
    }
    public void SetInput(int index, IDagNode node)
    {
        _dagCalculateComponent.SetInput(index, node);
    }
    public void AddUnorderedInput(IDagNode node)
    {
        _dagCalculateComponent.AddUnorderedInput(node);
    }
    public void RemoveUnorderedInput(IDagNode node)
    {
        _dagCalculateComponent.RemoveUnorderedInput(node);
    }
    public UnityEngine.GUIContent GetValue()
    {
        if (true == _dirty)
        {
            _dirty = false;
            _value = new UnityEngine.GUIContent();
            IDagNodeValue< string > dagInput = _dagCalculateComponent.inputArray[0] as IDagNodeValue< string >;
            if (null != dagInput)
            {
                _value.text = dagInput.GetValue();
            }
        }
        return _value;
    }

    public void AddOutput(IDagNodeCalculateBase node)
    {
        _dagNodeComponent.AddOutput(node);
    }
    public void RemoveOutput(IDagNodeCalculateBase node)
    {
        _dagNodeComponent.RemoveOutput(node);
    }
}
