/*
 direct acylic graph
 attempt to organise state for mimimal duplication and reduction of stale state
 */
public interface IDagNode
{
    void AddOutput(IDagNodeCalculateBase node);
    void RemoveOutput(IDagNodeCalculateBase node);
}

public interface IDagNodeValue< TYPE > : IDagNode
{
    TYPE GetValue();
}

public interface IDagNodeSetValue< TYPE > : IDagNodeValue< TYPE >
{
    void SetValue(TYPE value);
}

public interface IDagNodeCalculateBase : IDagNode
{
    void SetDirty();
    void SetInput(int index, IDagNode node);
    void AddUnorderedInput(IDagNode node);
    void RemoveUnorderedInput(IDagNode node);
}

public interface IDagNodeCalculate< TYPE > : IDagNodeValue< TYPE >, IDagNodeCalculateBase
{
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

public class DagNodeValue< TYPE > : IDagNodeSetValue< TYPE >
{
    private DagNodeComponent _dagNodeComponent = new DagNodeComponent();
    private TYPE _value;

    public DagNodeValue(TYPE value)
    {
        _value = value;
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

public class DagCalculateComponent
{
    private System.Collections.Generic.List< IDagNode > _inputArray = new System.Collections.Generic.List< IDagNode >();
    private System.Collections.Generic.List< IDagNode > _unorderedInputArray = new System.Collections.Generic.List< IDagNode >();

    public System.Collections.Generic.List< IDagNode > inputArray
    {
        get
        {
            return _inputArray;
        }
    }
    public System.Collections.Generic.List< IDagNode > unorderedInputArray
    {
        get
        {
            return _unorderedInputArray;
        }
    }

    public void SetInput(int index, IDagNode node)
    {
        //todo: what does c# do on out of bounds?
        while(_inputArray.Count <= index)
        {
            _inputArray.Add(null);
        }
        _inputArray[index] = node;
    }
    public void AddUnorderedInput(IDagNode node)
    {
        _unorderedInputArray.Add(node);
    }
    public void RemoveUnorderedInput(IDagNode node)
    {
        _unorderedInputArray.Remove(node);
    }
}
