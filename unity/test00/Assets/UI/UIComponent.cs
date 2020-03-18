public class UIComponent : UnityEngine.MonoBehaviour
{
    public enum UITemplate {
        None,
        MainMenu,
    //    Options,
    //    Language,
    //    HUD,
    //    InGameMenu
    };

    private UIContainer _uiContainer;

	void Update()
	{
        //Bootstrap.Instance.Log("UIComponent.Update()");
        float timeDelta = UnityEngine.Time.deltaTime;
        if (null != _uiContainer)
        {
            _uiContainer.Update(timeDelta);
        }
	}

    private void OnGUI()
    {
        //Bootstrap.Instance.Log("UIComponent.OnGUI()");
        if (null != _uiContainer)
        {
            _uiContainer.Draw();
        }
    }

    //todo: read ui template def from file...? unity has ui systems as well...?
    public System.Collections.IEnumerator SetTemplate(UIComponent.UITemplate uiTemplate)
    {
        _uiContainer = null;
        switch(uiTemplate)
        {
            default:
                break;
            case UITemplate.MainMenu:
                _uiContainer = MakeUIContainerMainMenu();
                break;
        }
        return null;
    }

    private static UIContainer MakeUIContainerMainMenu()
    {
        UIContainer uiContainer = new UIContainer();
        uiContainer.AddUIElement(UILable.FactoryVersion((int)Bootstrap.UIRenderDepth.Menu));
        uiContainer.AddUIElement(UIButton.FactoryButton(
            UIButton.FactoryRect((UnityEngine.Screen.width * 0.5f) - 150.0f, (UnityEngine.Screen.height * 0.5f) - 75.0f, 300.0f, 150.0f),
            "anykey",
            (int)Bootstrap.UIRenderDepth.Menu,
            () => { 
                Bootstrap.Log("onclick");
                Bootstrap.SetState("tutorial00");
            }
            ));
        return uiContainer;
    }
}
