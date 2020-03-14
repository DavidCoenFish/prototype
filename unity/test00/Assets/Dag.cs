public interface IDagNode
{
    void AddOutput(IDagNodeCalculateBase node);
    void RemoveOutput(IDagNodeCalculateBase node);
}

public interface IDagNodeValue< TYPE > : IDagNode
{
    TYPE GetValue();
    void SetValue(TYPE value);
}

public interface IDagNodeCalculateBase : IDagNode
{
    void SetDirty();
    void SetInput(int index, IDagNode node);
    void AddUnorderedInput(IDagNode node);
    void RemoveUnorderedInput(IDagNode node);
}

public interface IDagNodeCalculate< TYPE > : IDagNodeCalculateBase
{
    TYPE GetValue();
}

public static class DagNode
{
    public static void Link(int index, IDagNode input, IDagNodeCalculateBase output)
    {
        output.SetInput(index, input);
        input.AddOutput(output);
        output.SetDirty();
    }
    public static void UnLink(int index, IDagNode input, IDagNodeCalculateBase output)
    {
        output.SetInput(index, null);
        input.RemoveOutput(output);
        output.SetDirty();
    }
    public static void LinkUnordered(IDagNode input, IDagNodeCalculateBase output)
    {
        output.AddUnorderedInput(input);
        input.AddOutput(output);
        output.SetDirty();
    }
    public static void UnLinkUnordered(IDagNode input, IDagNodeCalculateBase output)
    {
        output.RemoveUnorderedInput(input);
        input.RemoveOutput(output);
        output.SetDirty();
    }
}

public class DagNodeComponent
{
    private System.Collections.Generic.List< IDagNodeCalculateBase > _outputArray = new System.Collections.Generic.List< IDagNodeCalculateBase >();

    public void AddOutput(IDagNodeCalculateBase node)
    {
        _outputArray.Add(node);
    }
    public void RemoveOutput(IDagNodeCalculateBase node)
    {
        _outputArray.Remove(node);
    }

    public void SetOutputDirty()
    {
        foreach(IDagNodeCalculateBase node in _outputArray)
        {
            node.SetDirty();
        }
    }
}

public class DagNodeValue< TYPE > : IDagNodeValue< TYPE >
{
    private DagNodeComponent _dagNodeComponent;
    private TYPE _value;

    DagNodeValue(TYPE value)
    {
        _value = value;
        _dagNodeComponent = new DagNodeComponent();
    }

    public TYPE GetValue()
    {
        return _value;
    }

    public void SetValue(TYPE value)
    {
        _value = value;
        _dagNodeComponent.SetOutputDirty();
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

