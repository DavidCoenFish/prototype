//https://learn.unity.com/tutorial/adventure-game-phase-6-game-state?projectId=5c514af7edbc2a001fd5c012#5c7f8528edbc2a002053b38e

public class FadeComponent : UnityEngine.MonoBehaviour
{
    private UIBox _UIBox;
    private float _alpha;
    private float _alphaDelta;

    void Start()
    {
        Application.Instance.Log("FadeComponent.Start()");
        _UIBox = UIBox.FactoryScreenQuad(0);
    }

    // set the value of the fade alpha, stops fade transition
    public void SetFade(float in_alpha)
    {
        _alpha = in_alpha;
        _alphaDelta = 0.0f;
    }

    //start 
    public void SetFadeToBlack(float in_duration = 0.5f)
    {
        _alphaDelta = 1.0f / in_duration;
    }

    public void SetFadeToTransparent(float in_duration = 0.5f)
    {
        _alphaDelta = (-1.0f) / in_duration;
    }

	void Update()
	{
        //Application.Instance.Log("FadeComponent.Update()");

        _alpha = UnityEngine.Mathf.Clamp(_alpha + (_alphaDelta * UnityEngine.Time.deltaTime), 0.0f, 1.0f);
        _UIBox.SetAlpha(_alpha);
        //Application.Instance.Log(" _alpha:" + _alpha.ToString());
	}

    private void OnGUI()
    {
        //Application.Instance.Log("FadeComponent.OnGUI()");
        //Application.Instance.Log(" _alpha:" + _alpha.ToString());

        if (0.0f < _alpha)
        {
            _UIBox.Draw();
        }
    }
}
