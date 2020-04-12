public class CreatureBodyVisualSphere
{
    private UnityEngine.GameObject _prefab = null;
    private UnityEngine.GameObject _prefabFace = null;
    private int _activeCount;
    private class Data
    {
        public UnityEngine.GameObject gameObject;
        public SphereShaderPropertyBlock splineComponent;
    };
    private System.Collections.Generic.List< Data > _dataArray;

    private float _fov;
    private float _aspect;


    public CreatureBodyVisualSphere()
    {
        //Assets/Resources/prefab/quadraticbeziermesh.prefab
        _prefab = UnityEngine.Resources.Load<UnityEngine.GameObject>("prefab/spheremesh");
        _dataArray = new System.Collections.Generic.List< Data >();
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


    private bool ConvertSphereRenderDataToData(Data data, CreatureStateBody.SphereRenderData sphereRenderData, UnityEngine.Camera mainCamera)
    {
        var tempP0 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(sphereRenderData.p0.x, sphereRenderData.p0.y, sphereRenderData.p0.z));
        var radius0 = sphereRenderData.p0.w;// * 0.5f;

        //bail if all three spheres are less than near plane, The z position is in world units from the camera.
        float nearPlane = 0.01f;
        if ((tempP0.z + radius0 < nearPlane) )
        {
            return false;
        }
        tempP0.z = UnityEngine.Mathf.Max(nearPlane, tempP0.z);
        float averageZ = tempP0.z - radius0;
        //todo: reduce radius as we get close to near plane?

        //at depth averageZ, what is our conversion factor between world units and screen pixels
        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (_fov / 2.0f)) * 2.0f * averageZ;
        var hozScale = verScale * _aspect;

        var worldUnitsToPixels = UnityEngine.Screen.height / verScale;

        //projected onto averageZ, xy [0 ... width pixels, 0 ... screen pixels] z pixel radius
        var projectedP0 = ProjectXYRadius(tempP0, averageZ, radius0, worldUnitsToPixels);

        //get screen pixel space bounds
        // clamp to screen bounds
        var minX = UnityEngine.Mathf.Clamp(projectedP0.x - projectedP0.z, 0.0f, UnityEngine.Screen.width);
        var minY = UnityEngine.Mathf.Clamp(projectedP0.y - projectedP0.z, 0.0f, UnityEngine.Screen.height);

        var maxX = UnityEngine.Mathf.Clamp(projectedP0.x + projectedP0.z, 0.0f, UnityEngine.Screen.width);
        var maxY = UnityEngine.Mathf.Clamp(projectedP0.y + projectedP0.z, 0.0f, UnityEngine.Screen.height);

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
            var posLow = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(minX, minY));
            var pos2Low = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posLow);
            var posHigh = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(maxX, maxY));
            var pos2High = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posHigh);

            data.splineComponent.uvScale.Set(pos2Low.x, pos2Low.y, pos2High.x - pos2Low.x, pos2High.y - pos2Low.y);
        }

        data.splineComponent.color = sphereRenderData.color;

        data.splineComponent.ManualUpdate();

        return true;
    }

    private Data GetFreeData()
    {
        Data data = null;
        if (_dataArray.Count <= _activeCount)
        {
            data = new Data();
            data.gameObject = UnityEngine.Object.Instantiate(_prefab);
            data.splineComponent = data.gameObject.GetComponent<SphereShaderPropertyBlock>();
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

        foreach( var sphere in creatureState.creatureStateBody.sphereRenderDataArray)
        {
            Data data = GetFreeData();
            data.gameObject.transform.parent = parentTransform;
            if (true == ConvertSphereRenderDataToData(data, sphere, mainCamera))
            {
                data.gameObject.SetActive(true);
                _activeCount += 1;
            }
        }
    }
}
