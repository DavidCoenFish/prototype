/*
need to get the data to describe the body from somewhere
this class looks after the visual representation of the creature
 */
public class CreatureBodyVisual
{
    private UnityEngine.GameObject _prefab = null;
    private UnityEngine.GameObject _prefabFace = null;
    private int _activeCount;
    private class Data
    {
        public UnityEngine.GameObject gameObject;
        public QuadraticBezierShaderPropertyBlock splineComponent;
    };
    private System.Collections.Generic.List< Data > _dataArray;

    private UnityEngine.GameObject _faceGameObject;
    private CreatureFaceRatShaderPropertyBlock _facePropertyBlock;
    private float _bodyAverageDepth;
    private UnityEngine.Vector4 _headProjected;

    private float _fov;
    private float _aspect;
    private float _verScale;
    private float _hozScale;


    public CreatureBodyVisual()
    {
        //Assets/Resources/prefab/quadraticbeziermesh.prefab
        _prefab = UnityEngine.Resources.Load<UnityEngine.GameObject>("prefab/quadraticbeziermesh");
        //Assets/Resources/prefab/creaturefaceratmesh.prefab
        _prefabFace = UnityEngine.Resources.Load<UnityEngine.GameObject>("prefab/creaturefaceratmesh");
        _dataArray = new System.Collections.Generic.List< Data >();

        _faceGameObject = UnityEngine.Object.Instantiate(_prefabFace);
        _faceGameObject.SetActive(false);
        _facePropertyBlock = _faceGameObject.GetComponent<CreatureFaceRatShaderPropertyBlock>();
    }

    private UnityEngine.Vector3 ProjectXYRadius(UnityEngine.Vector3 point, float averageZ, float radius, float worldUnitsToPixels)
    {
        float scale = averageZ / point.z;
        return new UnityEngine.Vector3(
            point.x,
            point.y,
            radius * scale * worldUnitsToPixels
            );
    }


    private bool ConvertSplineRenderDataToData(Data data, CreatureStateBody.SplineRenderData splineRenderData, UnityEngine.Camera mainCamera, bool first)
    {
        var tempP0 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p0.x, splineRenderData.p0.y, splineRenderData.p0.z));
        var tempP1 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p1.x, splineRenderData.p1.y, splineRenderData.p1.z));
        var tempP2 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p2.x, splineRenderData.p2.y, splineRenderData.p2.z));
        var radius0 = splineRenderData.p0.w;// * 0.5f;
        var radius1 = splineRenderData.p1.w;// * 0.5f;
        var radius2 = splineRenderData.p2.w;// * 0.5f;

        //bail if all three spheres are less than near plane, The z position is in world units from the camera.
        float nearPlane = 0.01f;
        if ((tempP0.z + radius0 < nearPlane) && (tempP1.z + radius1 < nearPlane) && (tempP2.z + radius2 < nearPlane))
        {
            return false;
        }
        tempP0.z = UnityEngine.Mathf.Max(nearPlane, tempP0.z);
        tempP1.z = UnityEngine.Mathf.Max(nearPlane, tempP1.z);
        tempP2.z = UnityEngine.Mathf.Max(nearPlane, tempP2.z);
        float averageZ = (tempP0.z + tempP1.z + tempP2.z) / 3.0f;
        //todo: reduce radius as we get close to near plane?

        //at depth averageZ, what is our conversion factor between world units and screen pixels
        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (_fov / 2.0f)) * 2.0f * averageZ;
        var hozScale = verScale * _aspect;

        var worldUnitsToPixels = UnityEngine.Screen.height / verScale;

        //projected onto averageZ, xy [0 ... width pixels, 0 ... screen pixels] z pixel radius
        var projectedP0 = ProjectXYRadius(tempP0, averageZ, radius0, worldUnitsToPixels);
        var projectedP1 = ProjectXYRadius(tempP1, averageZ, radius1, worldUnitsToPixels);
        var projectedP2 = ProjectXYRadius(tempP2, averageZ, radius2, worldUnitsToPixels);

        if (first)
        {
            _bodyAverageDepth = averageZ;
            _headProjected = projectedP2;
        }

        //get screen pixel space bounds
        // clamp to screen bounds
        var minX = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(projectedP0.x - projectedP0.z, projectedP1.x - projectedP1.z), projectedP2.x - projectedP2.z), 0.0f, UnityEngine.Screen.width);
        var minY = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(projectedP0.y - projectedP0.z, projectedP1.y - projectedP1.z), projectedP2.y - projectedP2.z), 0.0f, UnityEngine.Screen.height);

        var maxX = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(projectedP0.x + projectedP0.z, projectedP1.x + projectedP1.z), projectedP2.x + projectedP2.z), 0.0f, UnityEngine.Screen.width);
        var maxY = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(projectedP0.y + projectedP0.z, projectedP1.y + projectedP1.z), projectedP2.y + projectedP2.z), 0.0f, UnityEngine.Screen.height);
        // zero area, off screen
        if ((minX == maxX) || (minY == maxY))
        {
            return false;
        }

        var worldSpaceCenterOffest = new UnityEngine.Vector3(
            ((((maxX + minX) * 0.5f) - (0.5f * UnityEngine.Screen.width)) / UnityEngine.Screen.width) * hozScale,
            ((((maxY + minY) * 0.5f) - (0.5f * UnityEngine.Screen.height)) / UnityEngine.Screen.height) * verScale,
            0.0f
            );

        //var screenPixelBounds = new UnityEngine.Rect(minX, minY, maxX - minX, maxY - minY);
        var meshWorldSpaceOrigin = mainCamera.transform.position + (mainCamera.transform.forward * averageZ)
            + (mainCamera.transform.right * worldSpaceCenterOffest.x) 
            + (mainCamera.transform.up * worldSpaceCenterOffest.y);
        var meshWorldSpaceScale = new UnityEngine.Vector3(
            ((maxX - minX) / UnityEngine.Screen.width) * hozScale,
            ((maxY - minY) / UnityEngine.Screen.height) * verScale,
            1.0f
            );

        //get the mesh transform
        data.gameObject.transform.position = meshWorldSpaceOrigin;
        data.gameObject.transform.rotation = mainCamera.transform.rotation;
        data.gameObject.transform.localScale = meshWorldSpaceScale;

        //get the spline data into shader coordinates (uv)
        var screenRect = new UnityEngine.Rect(0.0f, 0.0f, UnityEngine.Screen.width, UnityEngine.Screen.height);
        var aspectRect = new UnityEngine.Rect(0.5f - (_aspect / 2.0f), 0.0f, _aspect, 1.0f);
        {
            var pos = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(projectedP0.x, projectedP0.y));
            var pos2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, pos);
            data.splineComponent.p0.Set(pos2.x, pos2.y, projectedP0.z / UnityEngine.Screen.height, 0.0f);
        }
        {
            var pos = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(projectedP1.x, projectedP1.y));
            var pos2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, pos);
            data.splineComponent.p1.Set(pos2.x, pos2.y, projectedP1.z / UnityEngine.Screen.height, 0.0f);
        }
        {
            var pos = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(projectedP2.x, projectedP2.y));
            var pos2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, pos);
            data.splineComponent.p2.Set(pos2.x, pos2.y, projectedP2.z / UnityEngine.Screen.height, 0.0f);
        }

        {
            var posLow = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(minX, minY));
            var pos2Low = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posLow);
            var posHigh = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(maxX, maxY));
            var pos2High = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posHigh);

            data.splineComponent.uvScale.Set(pos2Low.x, pos2Low.y, pos2High.x - pos2Low.x, pos2High.y - pos2Low.y);
        }

        data.splineComponent.color = splineRenderData.color;

        data.splineComponent.ManualUpdate();

        return true;
    }

    private void UpdateFace(CreatureState creatureState, UnityEngine.Camera mainCamera)
    {
        //todo. need 
        //_faceGameObject.SetActive(true);
        _facePropertyBlock.colorSkin = creatureState.creatureStateBody.colorSkin;
        _facePropertyBlock.colorDetail = creatureState.creatureStateBody.colorDetail;
        //_facePropertyBlock.p0 = _headProjected;
        //_facePropertyBlock.

        var minX = UnityEngine.Mathf.Clamp(_headProjected.x - (_headProjected.z * 2.5f), 0.0f, UnityEngine.Screen.width);
        var minY = UnityEngine.Mathf.Clamp(_headProjected.y - (_headProjected.z * 2.5f), 0.0f, UnityEngine.Screen.height);

        var maxX = UnityEngine.Mathf.Clamp(_headProjected.x + (_headProjected.z * 2.5f), 0.0f, UnityEngine.Screen.width);
        var maxY = UnityEngine.Mathf.Clamp(_headProjected.y + (_headProjected.z * 2.5f), 0.0f, UnityEngine.Screen.height);

        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (_fov / 2.0f)) * 2.0f * _bodyAverageDepth;
        var hozScale = verScale * _aspect;

        var worldSpaceCenterOffest = new UnityEngine.Vector3(
            ((((maxX + minX) * 0.5f) - (0.5f * UnityEngine.Screen.width)) / UnityEngine.Screen.width) * hozScale,
            ((((maxY + minY) * 0.5f) - (0.5f * UnityEngine.Screen.height)) / UnityEngine.Screen.height) * verScale,
            0.0f
            );

        //var screenPixelBounds = new UnityEngine.Rect(minX, minY, maxX - minX, maxY - minY);
        var meshWorldSpaceOrigin = mainCamera.transform.position + (mainCamera.transform.forward * (_bodyAverageDepth - 0.01f))
            + (mainCamera.transform.right * worldSpaceCenterOffest.x) 
            + (mainCamera.transform.up * worldSpaceCenterOffest.y);
        var meshWorldSpaceScale = new UnityEngine.Vector3(
            ((maxX - minX) / UnityEngine.Screen.width) * hozScale,
            ((maxY - minY) / UnityEngine.Screen.height) * verScale,
            1.0f
            );

        //get the mesh transform
        _faceGameObject.transform.position = meshWorldSpaceOrigin;
        _faceGameObject.transform.rotation = mainCamera.transform.rotation;
        _faceGameObject.transform.localScale = meshWorldSpaceScale;

        var screenRect = new UnityEngine.Rect(0.0f, 0.0f, UnityEngine.Screen.width, UnityEngine.Screen.height);
        var aspectRect = new UnityEngine.Rect(0.5f - (_aspect / 2.0f), 0.0f, _aspect, 1.0f);

        {
            var pos = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(_headProjected.x, _headProjected.y));
            var pos2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, pos);
            _facePropertyBlock.p0.Set(pos2.x, pos2.y, _headProjected.z / UnityEngine.Screen.height, 0.0f);
        }

        var headForward = creatureState.creatureStateBody.headRotationWorldSpace * UnityEngine.Vector3.forward;
        var headUp = creatureState.creatureStateBody.headRotationWorldSpace * UnityEngine.Vector3.up;
        var headRight = creatureState.creatureStateBody.headRotationWorldSpace * UnityEngine.Vector3.right;

        _facePropertyBlock.forwardUp.Set(
            UnityEngine.Vector3.Dot(mainCamera.transform.right, headForward),
            UnityEngine.Vector3.Dot(mainCamera.transform.up, headForward),
            UnityEngine.Vector3.Dot(mainCamera.transform.right, headUp),
            UnityEngine.Vector3.Dot(mainCamera.transform.up, headUp)
            );

        _facePropertyBlock.rightData.Set(
            UnityEngine.Vector3.Dot(mainCamera.transform.right, headRight),
            UnityEngine.Vector3.Dot(mainCamera.transform.up, headRight),
            0.0f,
            0.0f
            );

        {
            var posLow = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(minX, minY));
            var pos2Low = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posLow);
            var posHigh = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(maxX, maxY));
            var pos2High = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posHigh);

            _facePropertyBlock.uvScale.Set(pos2Low.x, pos2Low.y, pos2High.x - pos2Low.x, pos2High.y - pos2Low.y);
        }

        _facePropertyBlock.ManualUpdate();
    }

    private Data GetFreeData()
    {
        Data data = null;
        if (_dataArray.Count <= _activeCount)
        {
            data = new Data();
            data.gameObject = UnityEngine.Object.Instantiate(_prefab);
            data.splineComponent = data.gameObject.GetComponent<QuadraticBezierShaderPropertyBlock>();
            _dataArray.Add(data);
        }
        else
        {
            data = _dataArray[_activeCount];
        }
        return data;
    }

    public void Update(CreatureState creatureState, UnityEngine.Transform parentTransform)
    {
        var mainCamera = UnityEngine.Camera.main;
        _fov = mainCamera.fieldOfView;//  60.0f; //todo
        _aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;

        foreach( Data data in _dataArray)
        {
            data.gameObject.SetActive(false);
        }
        _activeCount = 0;

        bool first = true;
        foreach( var spline in creatureState.creatureStateBody.splineRenderDataArray)
        {
            Data data = GetFreeData();
            data.gameObject.transform.parent = parentTransform;
            if (true == ConvertSplineRenderDataToData(data, spline, mainCamera, first))
            {
                data.gameObject.SetActive(true);
                _activeCount += 1;
            }
            first = false;
        }

        UpdateFace(creatureState, mainCamera);
    }
}
