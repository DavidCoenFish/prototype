using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//https://learn.unity.com/tutorial/adventure-game-phase-6-game-state?projectId=5c514af7edbc2a001fd5c012#5c7f8528edbc2a002053b38e

public class FadeComponent : MonoBehaviour
{
    private DscRect _dscRect;
    private float _alpha;
    private float _alphaDelta;


    void Start()
    {
        _dscRect = DscRect.FactoryScreen();
        _alpha = 0.0f;
    }

    //public void Fade(float finalAlpha, float fadeDuration)
    //{
    //    StartCoroutine (FadeInternal (finalAlpha, fadeDuration));
    //}

    //private IEnumerator FadeInternal (float finalAlpha, float fadeDuration)
    //{
    //    //isFading = true;
    //    //faderCanvasGroup.blocksRaycasts = true;
    //    float fadeSpeed = Mathf.Abs (_alpha - finalAlpha) / fadeDuration;
    //    while (!Mathf.Approximately (_alpha, finalAlpha))
    //    {
    //        _alpha = Mathf.MoveTowards (_alpha, finalAlpha, fadeSpeed * Time.deltaTime);
    //        Application.Instance.Log("FadeInternal:" + _alpha.ToString());
    //        yield return null;
    //    }
    //    //isFading = false;
    //    //faderCanvasGroup.blocksRaycasts = false;
    //}

    // set the value of the fade alpha, stops fade transition
    void SetFade(float in_alpha)
    {
        _alpha = in_alpha;
        _alphaDelta = 0.0f;
    }

    //start 
    void SetFadeToBlack(float in_duration = 0.5f)
    {
        _alphaDelta = 1.0 / in_duration;
    }

    void SetFadeToTransparent(float in_duration = 0.5f)
    {
        _alphaDelta = (-1.0) / in_duration;
    }

	void Update()
	{
        _alpha = Mathf.Clamp(_alpha + (_alphaDelta * UnityEngine.Time.deltaTime), 0.0f, 1.0f);
        _dscRect.setAlpha(_alpha);
	}

    private void OnGUI()
    {
        if (0.0f < _alpha)
        {
            _dscRect.GUIDraw();
        }
    }
}
