/*
need to get the data to describe the body from somewhere
this class looks after the visual representation of the creature
 */
public class CreatureBodyVisual
{
    private UnityEngine.GameObject _prefab = null;
    private int _activeCount;
    private class Data
    {
        public UnityEngine.GameObject gameObject;
        public QuadraticSplineMaterialPropertyBlockComponent splineComponent;
    };
    private System.Collections.Generic.List< Data > _dataArray;
    private float _verScale; //at 1 world unit from camera, this is the height of the camera fustrum in world units
    private float _hozScale;

    public CreatureBodyVisual()
    {
        //Assets/Resources/prefab/quadraticbeziermesh.prefab
        _prefab = UnityEngine.Resources.Load<UnityEngine.GameObject>("prefab/quadraticbeziermesh");
        _dataArray = new System.Collections.Generic.List< Data >();

        var fov = 60.0f; //todo
        var aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;
        _verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (fov / 2.0f)) * 2.0f;
        _hozScale = _verScale * aspect;
    }

    //return screen XYR [0...1] bottomleft is zero,zero
    private UnityEngine.Vector4 ConvertPoint(UnityEngine.Camera mainCamera, UnityEngine.Vector4 vectorXYZR)
    {
        var screenVector = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(vectorXYZR.x, vectorXYZR.y, vectorXYZR.z));
        var screenRadius = vectorXYZR.w;

        return new UnityEngine.Vector4(screenVector.x / UnityEngine.Screen.width, screenVector.y / UnityEngine.Screen.height, screenRadius, 0.0f);
    }

    private bool ConvertSplineRenderDataToData2(Data data, CreatureStateBody.SplineRenderData splineRenderData, UnityEngine.Camera mainCamera)
    {
        var p0 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p0.x, splineRenderData.p0.y, splineRenderData.p0.z));
        var p1 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p1.x, splineRenderData.p1.y, splineRenderData.p1.z));
        var p2 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p2.x, splineRenderData.p2.y, splineRenderData.p2.z));
        //bail if all three points are behind near plane, The z position is in world units from the camera.
        float nearPlane = 0.01f;
        if ((p0.z < nearPlane) && (p1.z < nearPlane) && (p2.z < nearPlane))
        {
            return false;
        }
        p0.z = UnityEngine.Mathf.Max(nearPlane, p0.z);
        p1.z = UnityEngine.Mathf.Max(nearPlane, p1.z);
        p2.z = UnityEngine.Mathf.Max(nearPlane, p2.z);
        float averageZ = (p0.z + p1.z + p2.z) * 0.3333f;
        var zMul = ((1.0f / averageZ) / _verScale) * UnityEngine.Screen.height;
        p0.z /= zMul;
        p1.z /= zMul;
        p2.z /= zMul;

        //UnityEngine.Mathf.Max(0.0f, 
        //UnityEngine.Mathf.Min(UnityEngine.Screen.width, 
        var lowX = (UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(p0.x - p0.z, p1.x - p1.z), p2.x - p2.z));
        var highX = (UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(p0.x + p0.z, p1.x + p1.z), p2.x + p2.z));
        var lowY = (UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(p0.y - p0.z, p1.y - p1.z), p2.y - p2.z));
        var highY = (UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(p0.y + p0.z, p1.y + p1.z), p2.y + p2.z));

        //todo, trim on screen bounds
        var screenTrimLowX = UnityEngine.Mathf.Max(0.0f, lowX);
        var screenTrimHighX = UnityEngine.Mathf.Min(UnityEngine.Screen.width, highX);
        var screenTrimLowY = UnityEngine.Mathf.Max(0.0f, lowY);
        var screenTrimHighY = UnityEngine.Mathf.Min(UnityEngine.Screen.height, highY);

        var hozScale = _hozScale * averageZ / (UnityEngine.Screen.width);
        var verScale = _verScale * averageZ / (UnityEngine.Screen.height);

        var centerGeometry = 
            mainCamera.transform.position + 
            (mainCamera.transform.forward * averageZ) + new UnityEngine.Vector3(
            ((UnityEngine.Screen.width / 2.0f) - ((screenTrimHighX - screenTrimLowX) * 0.5f)) * hozScale,
            ((UnityEngine.Screen.height / 2.0f) - ((screenTrimHighY - screenTrimLowY) * 0.5f)) * verScale,
            0.0f
            );

        data.gameObject.transform.position = centerGeometry;
        data.gameObject.transform.rotation = mainCamera.transform.rotation;
        data.gameObject.transform.localScale = new UnityEngine.Vector3(  
            (screenTrimHighX - screenTrimLowX) * hozScale, 
            (screenTrimHighY - screenTrimLowY) * verScale, 
            1.0f);

        data.splineComponent.p0 = new UnityEngine.Vector4(
            ((p0.x - screenTrimLowX) / ((screenTrimHighX - screenTrimLowX) / UnityEngine.Screen.width)) / UnityEngine.Screen.width,
            ((p0.y - screenTrimLowY) / ((screenTrimHighY - screenTrimLowY) / UnityEngine.Screen.height)) / UnityEngine.Screen.height,
            (splineRenderData.p0.w / averageZ) * ((screenTrimHighY - screenTrimLowY) / UnityEngine.Screen.height),
            0.0f
            );
        data.splineComponent.p1 = new UnityEngine.Vector4(
            ((p1.x - screenTrimLowX) / ((screenTrimHighX - screenTrimLowX) / UnityEngine.Screen.width)) / UnityEngine.Screen.width,
            ((p1.y - screenTrimLowY) / ((screenTrimHighY - screenTrimLowY) / UnityEngine.Screen.width)) / UnityEngine.Screen.height,
            (splineRenderData.p1.w / averageZ) * ((screenTrimHighY - screenTrimLowY) / UnityEngine.Screen.height),
            0.0f
            );
        data.splineComponent.p2 = new UnityEngine.Vector4(
            ((p2.x - screenTrimLowX) / ((screenTrimHighX - screenTrimLowX) / UnityEngine.Screen.width)) / UnityEngine.Screen.width,
            ((p2.y - screenTrimLowY) / ((screenTrimHighY - screenTrimLowY) / UnityEngine.Screen.width)) / UnityEngine.Screen.height,
            (splineRenderData.p2.w / averageZ) * ((screenTrimHighY - screenTrimLowY) / UnityEngine.Screen.height),
            0.0f
            );
        data.splineComponent.color = splineRenderData.color;

        return true;
    }

    private UnityEngine.Vector3 ProjectXYRadius(UnityEngine.Vector3 point, float averageZ, float radius, float worldUnitsToPixels)
    {
        float scale = averageZ / point.z;
        return new UnityEngine.Vector3(
            ((point.x - (UnityEngine.Screen.width * 0.5f)) * scale) + (UnityEngine.Screen.width * 0.5f),
            ((point.y - (UnityEngine.Screen.height * 0.5f)) * scale) + (UnityEngine.Screen.height * 0.5f),
            radius * scale * worldUnitsToPixels
            );
    }


    private bool ConvertSplineRenderDataToData(Data data, CreatureStateBody.SplineRenderData splineRenderData, UnityEngine.Camera mainCamera)
    {
        var tempP0 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p0.x, splineRenderData.p0.y, splineRenderData.p0.z));
        var tempP1 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p1.x, splineRenderData.p1.y, splineRenderData.p1.z));
        var tempP2 = mainCamera.WorldToScreenPoint(new UnityEngine.Vector3(splineRenderData.p2.x, splineRenderData.p2.y, splineRenderData.p2.z));
        var radius0 = splineRenderData.p0.w * 0.5f;
        var radius1 = splineRenderData.p1.w * 0.5f;
        var radius2 = splineRenderData.p2.w * 0.5f;

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
        var fov = mainCamera.fieldOfView;//  60.0f; //todo
        var aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;
        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (fov / 2.0f)) * 2.0f * averageZ;
        var hozScale = verScale * aspect;

        var worldUnitsToPixels = UnityEngine.Screen.height / verScale;

        //projected onto averageZ, xy [0 ... width pixels, 0 ... screen pixels] z pixel radius
        var projectedP0 = ProjectXYRadius(tempP0, averageZ, radius0, worldUnitsToPixels);
        var projectedP1 = ProjectXYRadius(tempP1, averageZ, radius1, worldUnitsToPixels);
        var projectedP2 = ProjectXYRadius(tempP2, averageZ, radius2, worldUnitsToPixels);

        //get screen pixel space bounds
#if false
        var minX = UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(projectedP0.x - projectedP0.z, projectedP1.x - projectedP1.z), projectedP2.x - projectedP2.z);
        var minY = UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(projectedP0.y - projectedP0.z, projectedP1.y - projectedP1.z), projectedP2.y - projectedP2.z);
        var maxX = UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(projectedP0.x + projectedP0.z, projectedP1.x + projectedP1.z), projectedP2.x + projectedP2.z);
        var maxY = UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(projectedP0.y + projectedP0.z, projectedP1.y + projectedP1.z), projectedP2.y + projectedP2.z);
#else
        // clamp to screen bounds
        var minX = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(projectedP0.x - projectedP0.z, projectedP1.x - projectedP1.z), projectedP2.x - projectedP2.z), 0.0f, UnityEngine.Screen.width);
        var minY = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Min(UnityEngine.Mathf.Min(projectedP0.y - projectedP0.z, projectedP1.y - projectedP1.z), projectedP2.y - projectedP2.z), 0.0f, UnityEngine.Screen.height);

        var maxX = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(projectedP0.x + projectedP0.z, projectedP1.x + projectedP1.z), projectedP2.x + projectedP2.z), 0.0f, UnityEngine.Screen.width);
        var maxY = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Max(UnityEngine.Mathf.Max(projectedP0.y + projectedP0.z, projectedP1.y + projectedP1.z), projectedP2.y + projectedP2.z), 0.0f, UnityEngine.Screen.height);
#endif
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
        var screenPixelMeshBounds = new UnityEngine.Rect(minX, minY, maxX - minX, maxY - minY);
        var aspectRect = new UnityEngine.Rect(0.5f - (aspect / 2.0f), 0.0f, aspect, 1.0f);
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

        data.splineComponent.Update();

        return true;
    }


    private Data GetFreeData()
    {
        Data data = null;
        if (_dataArray.Count <= _activeCount)
        {
            data = new Data();
            data.gameObject = UnityEngine.Object.Instantiate(_prefab);
            data.splineComponent = data.gameObject.GetComponent<QuadraticSplineMaterialPropertyBlockComponent>();
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
        foreach( Data data in _dataArray)
        {
            data.gameObject.SetActive(false);
        }
        _activeCount = 0;

        var mainCamera = UnityEngine.Camera.main;
        foreach( var spline in creatureState.creatureStateBody.splineRenderDataArray)
        {
#if true
            Data data = GetFreeData();
            data.gameObject.transform.parent = parentTransform;
            if (true == ConvertSplineRenderDataToData(data, spline, mainCamera))
            {
                data.gameObject.SetActive(true);
                _activeCount += 1;
            }
#else
            Data data = null;
            if (_dataArray.Count <= _activeCount)
            {
                data = new Data();
                data.gameObject = UnityEngine.Object.Instantiate(_prefab);
                data.splineComponent = data.gameObject.GetComponent<QuadraticSplineMaterialPropertyBlockComponent>();
                _dataArray.Add(data);
            }
            else
            {
                data = _dataArray[_activeCount];
            }
            data.gameObject.transform.parent = parentTransform;

            var mainCamera = UnityEngine.Camera.main;

            if (true == ConvertSplineRenderDataToData(data, spline, mainCamera))
            {
                _activeCount += 1;
                data.gameObject.SetActive(true);
            }

            //data.splineComponent.color = spline.color;
            //data.splineComponent.p0 = ConvertPoint(mainCamera, spline.p0);//new UnityEngine.Vector4(spline.p0.x, spline.p0.y, spline.p0.w);
            //data.splineComponent.p1 = ConvertPoint(mainCamera, spline.p1);//new UnityEngine.Vector4(spline.p1.x, spline.p1.y, spline.p1.w);
            //data.splineComponent.p2 = ConvertPoint(mainCamera, spline.p2);//new UnityEngine.Vector4(spline.p2.x, spline.p2.y, spline.p2.w);
            //data.splineComponent.Update();

            //data.gameObject.transform.rotation = UnityEngine.Camera.main.transform.rotation;
#endif
        }
    }
}
