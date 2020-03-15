public class UIContainer
{
    private System.Collections.Generic.List< IUpdate > _updateArray = new System.Collections.Generic.List< IUpdate >();
    private System.Collections.Generic.List< IUIElement > _uiElementArray = new System.Collections.Generic.List< IUIElement >();

	// : IUIElement
	// IUpdate

	public void AddUpdate(IUpdate update)
	{
		_updateArray.Add(update);
	}
    public void Update(float timeDelta)
	{
		foreach(IUpdate update in _updateArray)
		{
			update.Update(timeDelta);
		}
		return;
	}

	public void AddUIElement(IUIElement uiElement)
	{
		_uiElementArray.Add(uiElement);
	}
    public void Draw()
	{
		foreach(IUIElement uiElement in _uiElementArray)
		{
			uiElement.Draw();
		}
		return;
	}

}
