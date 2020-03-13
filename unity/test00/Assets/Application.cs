using System.Collections;
using System.Collections.Generic;
//using UnityEngine;

public class Application : UnityEngine.MonoBehaviour
{
    public static Application Instance;
    //private DscButton m_startButton;
    private FadeComponent _fadeComponent;
    //private float _debugTimeAccumulation;
    //private bool _debugState;

    void Start()
    {
        //weak attempt at singelton, probabbly a better way, but addComponent is not playing nice
        Instance = this;

       // m_startButton = new DscButton(new Rect((Screen.width * 0.5f) - 100.0f, (Screen.height * 0.5f) - 100.0f, 200.0f, 200.0f), "Any Key");
        //m_startButton.OnClick += new DscButton.ClickEventHandler(AnyKeyClick);
        UnityEngine.SceneManagement.SceneManager.LoadScene("mainmenu", UnityEngine.SceneManagement.LoadSceneMode.Additive);

        _fadeComponent = gameObject.AddComponent<FadeComponent>();
        //_debugTimeAccumulation = 0.0f;
        //_debugState = false;
    }

    public void Log(string param)
    {
        UnityEngine.Debug.Log("Application::Log:" + param);
    }

    public void PushState(string stateFactoryName)
    {
    }
    public void PopState()
    {
    }
    public void ClearState()
    {
    }


    //void Update()
    //{
    //    _debugTimeAccumulation += UnityEngine.Time.deltaTime;
    //    if (2.0f < _debugTimeAccumulation)
    //    {
    //        _debugTimeAccumulation = 0.0f;
    //        _debugState ^= true;
    //        _fadeComponent.Fade(_debugState? 1.0f : 0.0f, 1.0f); 
    //    }
    //}

    //private void OnGUI()
    //{
    //    m_startButton.Show();
    //    //Debug.Log("Application::OnGUI");
    //}

    //private void AnyKeyClick()
    //{
    //    Debug.Log("Application::AnyKeyClick");
    //}
}
