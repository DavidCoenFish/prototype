public class Project
{
	public enum Layer : int 
	{
		TDefault = 0,
		TTransparentFX = 1,
		TIgnoreRaycast = 2,
		TWater = 4,
		TUI = 5,
		TFirstPersonHide = 8,
	}
	public enum LayerFlag : int 
	{
		TDefault = 1 << Layer.TDefault,
		TTransparentFX = 1 << Layer.TTransparentFX,
		TIgnoreRaycast = 1 << Layer.TIgnoreRaycast,
		TWater = 1 << Layer.TWater,
		TUI = 1 << Layer.TUI,
		TFirstPersonHide = 1 << Layer.TFirstPersonHide,
	}
}
