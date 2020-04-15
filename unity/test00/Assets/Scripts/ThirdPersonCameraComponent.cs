public class ThirdPersonCameraComponent : UnityEngine.MonoBehaviour
{
    public float dolly = 2.5f;
    public float dollyRangeLow = 1.0f;
    public float dollyRangeHigh = 10.0f;
    public float dollyInputFactor = 10.0f;

    public float latitudeDegrees = 30.0f; //up down
    public float latitudeDegreesRangeLow = 0.0f;
    public float latitudeDegreesRangeHigh = 90.0f;
    public float latitudeDegreesInputFactor = 1.0f;

    public float longitudeDegrees = 30.0f;
    public float longitudeDegreesInputFactor = 1.0f;

    public float verticalOffset = 0.0f;

    UnityEngine.GameObject _dummyCamera;

    void Start()
    {
        _dummyCamera = new UnityEngine.GameObject("thirdPersonCameraDummy");
        _dummyCamera.transform.parent = gameObject.transform;
        UpdateDummyTransform();
    }

    void Update()
    {
        if (null == _dummyCamera)
        {
            return;
        }
        latitudeDegrees = UnityEngine.Mathf.Clamp(
            latitudeDegrees + (UnityEngine.Time.deltaTime * UnityEngine.Input.GetAxis("Vertical_Alt") * latitudeDegreesInputFactor),
            latitudeDegreesRangeLow,
            latitudeDegreesRangeHigh
            );
        longitudeDegrees += (UnityEngine.Time.deltaTime * UnityEngine.Input.GetAxis("Horizontal_Alt") * longitudeDegreesInputFactor);

        dolly = UnityEngine.Mathf.Clamp(
            dolly + (UnityEngine.Time.deltaTime * UnityEngine.Input.GetAxis("Dolly_Alt") * dollyInputFactor),
            dollyRangeLow,
            dollyRangeHigh
            );

        UpdateDummyTransform();
    }

    private void UpdateDummyTransform()
    {
        if (null == _dummyCamera)
        {
            return;
        }

        //var rotation = UnityEngine.Quaternion.Euler(0.0f, longitudeDegrees, latitudeDegrees);
        //_dummyCamera.transform.rotation = rotation;
        //_dummyCamera.transform.position = gameObject.transform.position + (rotation * new UnityEngine.Vector3(dolly, 0.0f, 0.0f));

        var rotation = UnityEngine.Quaternion.Euler(latitudeDegrees, -longitudeDegrees, 0.0f);
        _dummyCamera.transform.rotation = rotation;
        _dummyCamera.transform.position = gameObject.transform.position 
            + (rotation * new UnityEngine.Vector3(0.0f, 0.0f, -dolly)) 
            + new UnityEngine.Vector3(0.0f, verticalOffset, 0.0f);
    }

    public UnityEngine.Transform GetCameraTransform()
    {
        if (null == _dummyCamera)
        {
            return gameObject.transform;
        }
        return _dummyCamera.transform;
    }
}
