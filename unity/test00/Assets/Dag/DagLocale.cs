public class DagLocale : IDagNodeCalculate< string >
{
    private DagNodeComponent _dagNodeComponent = new DagNodeComponent();
    private DagCalculateComponent _dagCalculateComponent = new DagCalculateComponent();
    private string _key;
    private string _value;
    private bool _dirty = true;

    public DagLocale(string key)
    {
        _key = key;
    }

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
    public string GetValue()
    {
        if (true == _dirty)
        {
            _dirty = false;
            //todo, move locale to a dagnode input, and hook up dirty. out of time...
            _value = Bootstrap.GetDataStore().localeData.GetValue(_key);
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

