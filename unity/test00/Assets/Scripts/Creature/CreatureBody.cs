// view up down, needs limits, and just the head? also independant of body tilt
// view left-right applied to game object ridgid body...

public class CreatureBody
{
    // stand, crouch
    enum TPose
    {
        TStand = 0,
        TCrouch,
        TCount
    }
    private float[] _poseWeight = { 1.0f, 0.0f };
    private System.Collections.Generic.List< GameObjectData > _childGameObjectArray = new System.Collections.Generic.List< GameObjectData >();
    private UnityEngine.GameObject _rootGameObject;
    private UnityEngine.GameObject _headGameObject;
    private UnityEngine.GameObject _headParentGameObject;
    private float _headElevationDegrees = 0.0f;
	private UnityEngine.Material _materialSkin;
	private UnityEngine.Material _materialDark;

    private struct GameObjectData
    {
        public PoseData poseData { get; set; }
        public UnityEngine.GameObject gameObject { get; set; }
        public bool root { get; set; }
    }

    //pose data, todo: from file or prefab
    private struct TransformData
    {
        public UnityEngine.Vector3 position { get; set; }
        public UnityEngine.Vector3 rotation { get; set; }
        public UnityEngine.Vector3 scale { get; set; }
    }

    private struct PoseData
    {
        public string name { get; set; } 
        public bool visibleFirstPerson; //is this node visible for the first person camera
        public bool sphere { get; set; } // represent pose data with a sphere
        public bool cube { get; set; } // represent with a cube
	    public System.Collections.Generic.List< TransformData > transformData { get; set; }
	    public System.Collections.Generic.List< PoseData > poseDataChildren { get; set; }
    }
    //GameObjectData

    private static PoseData _poseData = new PoseData(){ 
        name = "SpineC", 
        visibleFirstPerson = true,
        sphere = true, 
        cube = false, 
        transformData = new System.Collections.Generic.List< TransformData >(){
            //standing
            new TransformData{
                position = new UnityEngine.Vector3(0.0f, 0.25f, 0.0f ),
                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                scale = new UnityEngine.Vector3(0.5f, 0.5f, 0.5f )
            },
            //Crouching
            new TransformData{
                position = new UnityEngine.Vector3(0.0f, 0.25f, -0.108f ),
                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                scale = new UnityEngine.Vector3(0.5f, 0.5f, 0.5f )
            }
        },
        poseDataChildren = new System.Collections.Generic.List< PoseData >(){
            new PoseData{
                name = "SpineB", 
                visibleFirstPerson = false,
                sphere = true, 
                cube = false, 
                transformData = new System.Collections.Generic.List< TransformData >(){
                    //standing
                    new TransformData{
                        position = new UnityEngine.Vector3(0.0f, 0.5f, 0.0f ),
                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                        scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                    },
                    //Crouching
                    new TransformData{
                        position = new UnityEngine.Vector3(0.0f, 0.385f, -0.215f ),
                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                        scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                    }
                },
                poseDataChildren = new System.Collections.Generic.List< PoseData >(){
                    new PoseData{
                        name = "SpineA", 
                        visibleFirstPerson = false,
                        sphere = true, 
                        cube = false, 
                        transformData = new System.Collections.Generic.List< TransformData >(){
                            //standing
                            new TransformData{
                                position = new UnityEngine.Vector3(0.0f, 0.5f, 0.0f ),
                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                            },
                            //Crouching
                            new TransformData{
                                position = new UnityEngine.Vector3(0.0f, 0.202f, 0.298f ),
                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                            }
                        },
                        poseDataChildren = new System.Collections.Generic.List< PoseData >(){
                            new PoseData{
                                name = "Head", 
                                visibleFirstPerson = false,
                                sphere = true, 
                                cube = false, 
                                transformData = new System.Collections.Generic.List< TransformData >(){
                                    //standing
                                    new TransformData{
                                        position = new UnityEngine.Vector3(0.0f, 0.363f, 0.37f ),
                                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                        scale = new UnityEngine.Vector3(0.75f, 0.75f, 0.75f )
                                    },
                                    //Crouching
                                    new TransformData{
                                        position = new UnityEngine.Vector3(0.0f, 0.03f, 0.5f ),
                                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                        scale = new UnityEngine.Vector3(0.75f, 0.75f, 0.75f )
                                    }
                                },
                                poseDataChildren = new System.Collections.Generic.List< PoseData >(){
                                    new PoseData{
                                        name = "CubeAgro0", 
                                        visibleFirstPerson = false,
                                        sphere = false, 
                                        cube = true, 
                                        transformData = new System.Collections.Generic.List< TransformData >(){
                                            //standing
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.2368f, 0.29f, 0.4576f ),
                                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 30.0f ),
                                                scale = new UnityEngine.Vector3(0.418f, 0.139f, 0.139f )
                                            },
                                            //Crouching
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.237f, 0.29f, 0.458f ),
                                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 30.0f ),
                                                scale = new UnityEngine.Vector3(0.418f, 0.139f, 0.139f )
                                            }
                                        },
                                        poseDataChildren = new System.Collections.Generic.List< PoseData >(){}
                                    },
                                    new PoseData{
                                        name = "CubeAgro1", 
                                        visibleFirstPerson = false,
                                        sphere = false, 
                                        cube = true, 
                                        transformData = new System.Collections.Generic.List< TransformData >(){
                                            //standing
                                            new TransformData{
                                                position = new UnityEngine.Vector3(-0.237f, 0.29f, 0.458f ),
                                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, -30.0f ),
                                                scale = new UnityEngine.Vector3(0.418f, 0.139f, 0.139f )
                                            },
                                            //Crouching
                                            new TransformData{
                                                position = new UnityEngine.Vector3(-0.237f, 0.29f, 0.458f ),
                                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, -30.0f ),
                                                scale = new UnityEngine.Vector3(0.418f, 0.139f, 0.139f )
                                            }
                                        },
                                        poseDataChildren = new System.Collections.Generic.List< PoseData >(){}
                                    },
                                }
                            },
                        }
                    },
                }
            },
        }
    };

    // Start is called before the first frame update
    public CreatureBody(UnityEngine.GameObject parent, CreatureState creatureState)
    {
        //Assets/Resources/material/CreatureSkin.mat
        _materialSkin = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureSkin");
        //Assets/Resources/material/CreatureDark.mat
        _materialDark = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureDark");

        BuildHeirarchy(parent, _poseData, true, creatureState);
    }

	private static UnityEngine.Vector3 AccumulateVector3(UnityEngine.Vector3 output, float weight, UnityEngine.Vector3 input)
	{
		return output + (input * weight);
	}

	private void UpdatePoseTransform(GameObjectData gameObjectData, CreatureState creatureState)
	{
		UnityEngine.Vector3 positionSum = new UnityEngine.Vector3();
		UnityEngine.Vector3 rotationSum = new UnityEngine.Vector3();
		UnityEngine.Vector3 scaleSum = new UnityEngine.Vector3();
		for (int index = 0; index < (int)TPose.TCount; ++index)
		{
			float weight = _poseWeight[index];
			if (weight <= 0.0f)
			{
				continue;
			}
            float tempWeight = weight;
            if (true == gameObjectData.root)
            {
                tempWeight *= creatureState.height;
            }
			positionSum = AccumulateVector3(positionSum, tempWeight, gameObjectData.poseData.transformData[index].position);
			rotationSum = AccumulateVector3(rotationSum, weight, gameObjectData.poseData.transformData[index].rotation);
			scaleSum = AccumulateVector3(scaleSum, tempWeight, gameObjectData.poseData.transformData[index].scale);
		}

		gameObjectData.gameObject.transform.localPosition = positionSum;
        if (gameObjectData.poseData.name != "SpineC")
        {
    		gameObjectData.gameObject.transform.localRotation = UnityEngine.Quaternion.Euler(rotationSum.x, rotationSum.y, rotationSum.z);
        }
		gameObjectData.gameObject.transform.localScale = scaleSum;

        if ((true == creatureState.firstPersonHost) && (false == gameObjectData.poseData.visibleFirstPerson))
        {
            gameObjectData.gameObject.layer = (int)Project.Layer.TFirstPersonHide;
        }
	}

	private void BuildHeirarchy(UnityEngine.GameObject parentGameObject, PoseData poseData, bool root, CreatureState creatureState)
	{
		UnityEngine.GameObject created = null;
		if (true == poseData.sphere)
		{
			UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
            childGameObject.name = poseData.name + "Sphere";
			childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = _materialSkin;
			childGameObject.transform.parent = parentGameObject.transform;
            UnityEngine.Object.Destroy(childGameObject.GetComponent<UnityEngine.SphereCollider>());
            var gameObjectData = new GameObjectData(){poseData=poseData, gameObject=childGameObject, root=root};
			_childGameObjectArray.Add(gameObjectData );
			UpdatePoseTransform(gameObjectData, creatureState);
			created = childGameObject;
		}
		if (true == poseData.cube)
		{
			UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Cube);
            childGameObject.name = poseData.name + "Cube";
			childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = _materialDark;
			childGameObject.transform.parent = parentGameObject.transform;
            UnityEngine.Object.Destroy(childGameObject.GetComponent<UnityEngine.BoxCollider>());
            var gameObjectData = new GameObjectData(){poseData=poseData, gameObject=childGameObject, root=root};
			_childGameObjectArray.Add(gameObjectData );
			UpdatePoseTransform(gameObjectData, creatureState);
			created = childGameObject;
		}

		if (null == created)
		{
			UnityEngine.GameObject childGameObject =new UnityEngine.GameObject();
			childGameObject.transform.parent = parentGameObject.transform;
            var gameObjectData = new GameObjectData(){poseData=poseData, gameObject=childGameObject, root=root};
			_childGameObjectArray.Add(gameObjectData );
			UpdatePoseTransform(gameObjectData, creatureState);
			created = childGameObject;
		}

        if (poseData.name == "SpineA")
        {
            _headParentGameObject = created;
        }

        if (poseData.name == "Head")
        {
            _headGameObject = created;
        }

        if (poseData.name == "SpineC")
        {
            _rootGameObject = created;
        }

		for (int index = 0; index < poseData.poseDataChildren.Count; ++index)
		{
			BuildHeirarchy(created, poseData.poseDataChildren[index], false, creatureState);
		}
	}

    // Update is called once per frame
    public void Update(CreatureState creatureState)
    {
        UpdatePoseWeight(creatureState);
        UpdatePose(creatureState);
        UpdateViewElevation(creatureState);
    }

    private void UpdatePoseWeight(CreatureState creatureState)
    {
        _poseWeight[(int)TPose.TStand] = 0.0f; 

        float crouch = UnityEngine.Mathf.Min(1.0f, creatureState.creatureStatePerUpdate.crouch);
        _poseWeight[(int)TPose.TCrouch] = UnityEngine.Mathf.MoveTowards(_poseWeight[(int)TPose.TCrouch], crouch, UnityEngine.Time.deltaTime * 10.0f);

        float sumOtherThanStand = 0.0f;
        for (int index = 0; index < (int)TPose.TCount; ++index)
        {
            if (index != (int)TPose.TStand)
            {
                sumOtherThanStand += _poseWeight[index];
            }
        }

        if (1.0f < sumOtherThanStand)
        {
            //normalise
            for (int index = 0; index < (int)TPose.TCount; ++index)
            {
                _poseWeight[index] *= sumOtherThanStand;
            }
        }
        else
        {
            _poseWeight[(int)TPose.TStand] = 1.0f - sumOtherThanStand;
        }
    }

	private void UpdatePose(CreatureState creatureState)
	{
		foreach ( GameObjectData gameObjectData in _childGameObjectArray)
		{
			UpdatePoseTransform(gameObjectData, creatureState);
		}
	}

    private void UpdateViewElevation(CreatureState creatureState)
    {
        float lookUpSpeed = 60.0f;
        float step = (-creatureState.creatureStatePerUpdate.inputView.y) * UnityEngine.Time.deltaTime * lookUpSpeed;
        _headElevationDegrees = UnityEngine.Mathf.Clamp(_headElevationDegrees + step, -90.0f, 90.0f);
        if (null != _headParentGameObject)
        {
            _headParentGameObject.transform.rotation = _headParentGameObject.transform.rotation * UnityEngine.Quaternion.Euler(_headElevationDegrees, 0.0f, 0.0f);
        }
    }

    public UnityEngine.Transform GetCameraTransform()
    {
        if (null != _headGameObject)
        {
            return _headGameObject.transform;
        }
        return null;
    }

    public void SetRoot(UnityEngine.Quaternion in_rotation)
    {
        if (null != _rootGameObject)
        {
            _rootGameObject.transform.localRotation = in_rotation;
        }
    }

}
