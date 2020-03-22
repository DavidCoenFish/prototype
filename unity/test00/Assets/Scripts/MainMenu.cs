public class MainMenu : UnityEngine.MonoBehaviour
{
    private UIComponent _uiComponent;

    private System.Collections.IEnumerator Start()
    {
        Bootstrap.Log("MainMenu.Start()");

        _uiComponent = gameObject.AddComponent<UIComponent>();
        yield return _uiComponent.SetTemplate(UIComponent.UITemplate.MainMenu);
        //yield return null;
    }
}
