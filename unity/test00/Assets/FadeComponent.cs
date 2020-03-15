//https://learn.unity.com/tutorial/adventure-game-phase-6-game-state?projectId=5c514af7edbc2a001fd5c012#5c7f8528edbc2a002053b38e

public class FadeComponent : UnityEngine.MonoBehaviour
{
    private UIBox _UIBox;
    private float _alpha;
    private float _alphaDelta;
    private int _depth;

    void Start()
    {
        Bootstrap.Instance.Log("FadeComponent.Start()", this);
        _UIBox = UIBox.FactoryScreenQuad(_depth);
    }

    public void SetDepth(int depth)
    {
        //Bootstrap.Instance.Log("FadeComponent.SetDepth()", this);
        _depth = depth;
    }

    // set the value of the fade alpha, stops fade transition
    public void SetFade(float in_alpha)
    {
        _alpha = in_alpha;
        _alphaDelta = 0.0f;
    }

    public bool IsFadeFullyObscuring()
    {
        return (1.0f == _alpha);
    }

    //go from not covering anything, to solid black
    public void SetFadeToFullyObscuring(float in_duration = 0.5f)
    {
        _alphaDelta = 1.0f / in_duration;
    }

    //go from solid black (or what ever the current state is), to seethrough
    public void SetFadeToTransparent(float in_duration = 0.5f)
    {
        _alphaDelta = (-1.0f) / in_duration;
    }

	void Update()
	{
        //Bootstrap.Instance.Log("FadeComponent.Update()");

        _alpha = UnityEngine.Mathf.Clamp(_alpha + (_alphaDelta * UnityEngine.Time.deltaTime), 0.0f, 1.0f);
        _UIBox.SetAlpha(_alpha);
        //Bootstrap.Instance.Log(" _alpha:" + _alpha.ToString());
	}

    private void OnGUI()
    {
        //Bootstrap.Instance.Log("FadeComponent.OnGUI()");
        //Bootstrap.Instance.Log(" _alpha:" + _alpha.ToString());

        if (0.0f < _alpha)
        {
            _UIBox.Draw();
        }
    }
}
