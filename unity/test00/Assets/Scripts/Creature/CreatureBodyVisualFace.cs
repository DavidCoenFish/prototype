/*
need to get the data to describe the body from somewhere
this class looks after the visual representation of the creature
 */
public class CreatureBodyVisualFace
{
    private UnityEngine.GameObject _prefabFace = null;
    private UnityEngine.GameObject _faceGameObject;
    private CreatureFaceShaderPropertyBlock _facePropertyBlock;

    private float _fov;
    private float _aspect;


    public CreatureBodyVisualFace()
    {
        //Assets/Resources/prefab/creaturefaceratmesh.prefab
        _prefabFace = UnityEngine.Resources.Load<UnityEngine.GameObject>("prefab/creaturefacemesh");

        _faceGameObject = UnityEngine.Object.Instantiate(_prefabFace);
        _faceGameObject.SetActive(true);
        _facePropertyBlock = _faceGameObject.GetComponent<CreatureFaceShaderPropertyBlock>();
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

    private void UpdateFace(CreatureState creatureState, UnityEngine.Camera mainCamera)
    {
        var e0 = new UnityEngine.Vector3(creatureState.creatureStateBody.faceRenderData.p1.x - creatureState.creatureStateBody.faceRenderData.p0.x, creatureState.creatureStateBody.faceRenderData.p1.y - creatureState.creatureStateBody.faceRenderData.p0.y, creatureState.creatureStateBody.faceRenderData.p1.z - creatureState.creatureStateBody.faceRenderData.p0.z);
        var e1 = new UnityEngine.Vector3(creatureState.creatureStateBody.faceRenderData.p2.x - creatureState.creatureStateBody.faceRenderData.p0.x, creatureState.creatureStateBody.faceRenderData.p2.y - creatureState.creatureStateBody.faceRenderData.p0.y, creatureState.creatureStateBody.faceRenderData.p2.z - creatureState.creatureStateBody.faceRenderData.p0.z);

        var right = UnityEngine.Vector3.Cross(e1, e0);
        var up = UnityEngine.Vector3.Cross(right, e0).normalized;

        var eyeFactor = UnityEngine.Vector3.Dot(e0, mainCamera.transform.forward) < 0.0f ? 1.0f : 0.0f;

        var faceBase = new UnityEngine.Vector3(creatureState.creatureStateBody.faceRenderData.p0.x, creatureState.creatureStateBody.faceRenderData.p0.y, creatureState.creatureStateBody.faceRenderData.p0.z) 
            + (up * (creatureState.creatureStateBody.faceRenderData.p0.w * 0.25f));

        var tempP = mainCamera.WorldToScreenPoint(faceBase);
        
        var radiusP = creatureState.creatureStateBody.faceRenderData.p0.w;// * 0.5f;
        var averageZ = tempP.z - radiusP;

        var yMul = (0.0f < UnityEngine.Vector3.Dot(mainCamera.transform.up, up)) ? 1.0f : -1.0f;


        var verScale = UnityEngine.Mathf.Tan(UnityEngine.Mathf.Deg2Rad * (_fov / 2.0f)) * 2.0f * averageZ;
        var hozScale = verScale * _aspect;

        var worldUnitsToPixels = UnityEngine.Screen.height / verScale;

        //projected onto averageZ, xy [0 ... width pixels, 0 ... screen pixels] z pixel radius
        var projectedP = ProjectXYRadius(tempP, averageZ, radiusP, worldUnitsToPixels);

        var eye0x = projectedP.x - (0.2f * projectedP.z);
        var eyeY = projectedP.y;
        var eye1x = projectedP.x + (0.2f * projectedP.z);
        var eyeRx = projectedP.z * 0.15f * eyeFactor; //* blink
        var eyeRy = projectedP.z * 0.2f;
        var eyeBrow0a = new UnityEngine.Vector2(projectedP.x - (0.075f * projectedP.z), eyeY + (yMul * eyeRy * 0.95f));
        var eyeBrow0b = new UnityEngine.Vector2(projectedP.x - (0.5f * projectedP.z), eyeY + (yMul * eyeRy * 2.0f));
        var browThick0 = projectedP.z * 0.1f;
        var browThick1 = projectedP.z * 0.125f;

        var eyeBrow1a = new UnityEngine.Vector2(projectedP.x + (0.075f * projectedP.z), eyeY + (yMul * eyeRy * 0.95f));
        var eyeBrow1b = new UnityEngine.Vector2(projectedP.x + (0.5f * projectedP.z), eyeY + (yMul * eyeRy * 2.0f));

        float minX = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Min(eye0x - eyeRx, eyeBrow0b.x - browThick1), 0.0f, UnityEngine.Screen.width);
        float minY = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Min(eyeY - eyeRy, eyeBrow0b.y - browThick1), 0.0f, UnityEngine.Screen.height);

        float maxX = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Max(eye1x + eyeRx, eyeBrow1b.x + browThick1), 0.0f, UnityEngine.Screen.width);
        float maxY = UnityEngine.Mathf.Clamp(UnityEngine.Mathf.Max(eyeY + eyeRy, eyeBrow1b.y + browThick1), 0.0f, UnityEngine.Screen.height);

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
        _faceGameObject.transform.position = meshWorldSpaceOrigin;
        _faceGameObject.transform.rotation = mainCamera.transform.rotation;
        _faceGameObject.transform.localScale = meshWorldSpaceScale;

        var screenRect = new UnityEngine.Rect(0.0f, 0.0f, UnityEngine.Screen.width, UnityEngine.Screen.height);
        var aspectRect = new UnityEngine.Rect(0.5f - (_aspect / 2.0f), 0.0f, _aspect, 1.0f);

        _facePropertyBlock.colorA = creatureState.creatureStateBody.faceRenderData.colorA;

        {
            var posLow = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(minX, minY));
            var pos2Low = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posLow);
            var posHigh = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(maxX, maxY));
            var pos2High = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posHigh);

            _facePropertyBlock.uvScale.Set(pos2Low.x, pos2Low.y, pos2High.x - pos2Low.x, pos2High.y - pos2Low.y);
        }

        {
            var pos = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(eye0x, eyeY));
            var pos2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, pos);
            _facePropertyBlock.eye0.Set(pos2.x, pos2.y, eyeRx / UnityEngine.Screen.height, eyeRy / UnityEngine.Screen.height);
        }

        {
            var posA = DscUtils.UnclampedRectSpaceConvertTo(screenRect, eyeBrow0a);
            var posA2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posA);
            var posB = DscUtils.UnclampedRectSpaceConvertTo(screenRect, eyeBrow0b);
            var posB2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posB);

            _facePropertyBlock.eyeBrow0.Set(posA2.x, posA2.y, posB2.x, posB2.y);
        }

        {
            var pos = DscUtils.UnclampedRectSpaceConvertTo(screenRect, new UnityEngine.Vector2(eye1x, eyeY));
            var pos2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, pos);
            _facePropertyBlock.eye1.Set(pos2.x, pos2.y, eyeRx / UnityEngine.Screen.height, eyeRy / UnityEngine.Screen.height);
        }

        {
            var posA = DscUtils.UnclampedRectSpaceConvertTo(screenRect, eyeBrow1a);
            var posA2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posA);
            var posB = DscUtils.UnclampedRectSpaceConvertTo(screenRect, eyeBrow1b);
            var posB2 = DscUtils.UnclampedRectSpaceConvertFrom(aspectRect, posB);

            _facePropertyBlock.eyeBrow1.Set(posA2.x, posA2.y, posB2.x, posB2.y);
        }

        {
            _facePropertyBlock.data0.Set(0.0f, 1.0f, browThick0 / UnityEngine.Screen.height, browThick1 / UnityEngine.Screen.height);
        }

        _facePropertyBlock.ManualUpdate();
    }

    public void Update(CreatureState creatureState, UnityEngine.Transform parentTransform)
    {
        var mainCamera = UnityEngine.Camera.main;
        _fov = mainCamera.fieldOfView;//  60.0f; //todo
        _aspect = ((float)UnityEngine.Screen.width) / ((float)UnityEngine.Screen.height); //16.0f / 9.0f;

        _faceGameObject.transform.parent = parentTransform;

        UpdateFace(creatureState, mainCamera);
    }
}
