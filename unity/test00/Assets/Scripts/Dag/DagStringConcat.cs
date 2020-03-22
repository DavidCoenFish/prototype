public class DagStringConcat : IDagNodeCalculate< string >
{
    private DagNodeComponent _dagNodeComponent = new DagNodeComponent();
    private DagCalculateComponent _dagCalculateComponent = new DagCalculateComponent();
    private string _join;
    private string _value;
    private bool _dirty = true;

    public DagStringConcat(string join)
    {
        _join = join;
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
            _value = "";
            {
                IDagNodeValue< string > dagInput = _dagCalculateComponent.inputArray[0] as IDagNodeValue< string >;
                if (null != dagInput)
                {
                    _value += dagInput.GetValue();
                }
            }
            _value += _join;
            {
                IDagNodeValue< string > dagInput = _dagCalculateComponent.inputArray[1] as IDagNodeValue< string >;
                if (null != dagInput)
                {
                    _value += dagInput.GetValue();
                }
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
