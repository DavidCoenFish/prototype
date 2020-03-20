// view up down, needs limits, and just the head? also independant of body tilt
// view left-right applied to game object ridgid body...

public class CreatureExtraComponent : UnityEngine.MonoBehaviour
{
    public string typeName = "rat"; //[rat, chicken, 
    public float height;
    public float viewElevationDegrees; //look up, positive
    public bool viewElevationControlsHead; //when KO/ set flying, turn off?
    public float bodyLeanForwardDegrees; // or is this with the ridged body?
    public TPose pose;

    private float[] _poseWeight = { 1.0f, 0.0f };
    private System.Collections.Generic.List< GameObjectData > _childGameObjectArray = new System.Collections.Generic.List< GameObjectData >();
    private UnityEngine.GameObject _headGameObject;
    private UnityEngine.GameObject _headParentGameObject;
	private UnityEngine.Material _materialSphere;
	private UnityEngine.Material _materialCube;

    struct GameObjectData
    {
        public PoseData poseData { get; set; }
        public UnityEngine.GameObject gameObject { get; set; }
        public bool root { get; set; }
    }

    //pose data, todo: from file or prefab
    struct TransformData
    {
        public UnityEngine.Vector3 position { get; set; }
        public UnityEngine.Vector3 rotation { get; set; }
        public UnityEngine.Vector3 scale { get; set; }
    }

    struct PoseData
    {
        public string name { get; set; } 
        public bool sphere { get; set; } // represent pose data with a sphere
        public bool cube { get; set; } // represent with a cube
	    public System.Collections.Generic.List< TransformData > transformData { get; set; }
	    public System.Collections.Generic.List< PoseData > poseDataChildren { get; set; }
    }

    public enum TPose
    {
        Standing = 0,
        Crouching,
        Count
    }

    private static PoseData _poseData = new PoseData(){ 
        name = "SpineC", 
        sphere = true, 
        cube = false, 
        transformData = new System.Collections.Generic.List< TransformData >(){
            //standing
            new TransformData{
                position = new UnityEngine.Vector3(0.0f, -0.25f, 0.0f ),
                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                scale = new UnityEngine.Vector3(0.5f, 0.5f, 0.5f )
            },
            //Crouching
            new TransformData{
                position = new UnityEngine.Vector3(0.044f, -0.12f, 0.0f ),
                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                scale = new UnityEngine.Vector3(0.5f, 0.5f, 0.5f )
            }
        },
        poseDataChildren = new System.Collections.Generic.List< PoseData >(){
            new PoseData{
                name = "SpineB", 
                sphere = true, 
                cube = false, 
                transformData = new System.Collections.Generic.List< TransformData >(){
                    //standing
                    new TransformData{
                        position = new UnityEngine.Vector3(0.0f, 0.542f, 0.0f ),
                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                        scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                    },
                    //Crouching
                    new TransformData{
                        position = new UnityEngine.Vector3(-0.292f, 0.25f, 0.0f ),
                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                        scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                    }
                },
                poseDataChildren = new System.Collections.Generic.List< PoseData >(){
                    new PoseData{
                        name = "SpineA", 
                        sphere = true, 
                        cube = false, 
                        transformData = new System.Collections.Generic.List< TransformData >(){
                            //standing
                            new TransformData{
                                position = new UnityEngine.Vector3(0.0f, 0.666f, 0.0f ),
                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                            },
                            //Crouching
                            new TransformData{
                                position = new UnityEngine.Vector3(0.3131f, 0.3245f, 0.0f ),
                                rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                scale = new UnityEngine.Vector3(0.875f, 0.875f, 0.875f )
                            }
                        },
                        poseDataChildren = new System.Collections.Generic.List< PoseData >(){
                            new PoseData{
                                name = "Head", 
                                sphere = true, 
                                cube = false, 
                                transformData = new System.Collections.Generic.List< TransformData >(){
                                    //standing
                                    new TransformData{
                                        position = new UnityEngine.Vector3(0.666f, 0.1666f, 0.0f ),
                                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                        scale = new UnityEngine.Vector3(0.666f, 0.666f, 0.666f )
                                    },
                                    //Crouching
                                    new TransformData{
                                        position = new UnityEngine.Vector3(0.5733f, 0.0213f, 0.0f ),
                                        rotation = new UnityEngine.Vector3(0.0f, 0.0f, 0.0f ),
                                        scale = new UnityEngine.Vector3(0.666f, 0.666f, 0.666f )
                                    }
                                },
                                poseDataChildren = new System.Collections.Generic.List< PoseData >(){
                                    new PoseData{
                                        name = "CubeAgro0", 
                                        sphere = false, 
                                        cube = true, 
                                        transformData = new System.Collections.Generic.List< TransformData >(){
                                            //standing
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.444f, 0.2159f ),
                                                rotation = new UnityEngine.Vector3(-30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            },
                                            //Crouching
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.332f, 0.216f ),
                                                rotation = new UnityEngine.Vector3(-30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            }
                                        },
                                        poseDataChildren = new System.Collections.Generic.List< PoseData >(){}
                                    },
                                    new PoseData{
                                        name = "CubeAgro1", 
                                        sphere = false, 
                                        cube = true, 
                                        transformData = new System.Collections.Generic.List< TransformData >(){
                                            //standing
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.444f, -0.2159f ),
                                                rotation = new UnityEngine.Vector3(30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
                                            },
                                            //Crouching
                                            new TransformData{
                                                position = new UnityEngine.Vector3(0.352f, 0.332f, -0.216f ),
                                                rotation = new UnityEngine.Vector3(30.0f, 0.0f, 0.0f ),
                                                scale = new UnityEngine.Vector3(0.12f, 0.12f, 0.4f )
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

	private static UnityEngine.Vector3 AccumulateVector3(UnityEngine.Vector3 output, float weight, UnityEngine.Vector3 input)
	{
		return output + (input * weight);
	}

	private void UpdatePoseTransform(UnityEngine.GameObject subject, PoseData poseData, bool root)
	{
		UnityEngine.Vector3 positionSum = new UnityEngine.Vector3();
		UnityEngine.Vector3 rotationSum = new UnityEngine.Vector3();
		UnityEngine.Vector3 scaleSum = new UnityEngine.Vector3();
		for (int index = 0; index < (int)TPose.Count; ++index)
		{
			float weight = _poseWeight[index];
			if (weight <= 0.0f)
			{
				continue;
			}
			positionSum = AccumulateVector3(positionSum, weight, poseData.transformData[index].position);
			rotationSum = AccumulateVector3(rotationSum, weight, poseData.transformData[index].rotation);
            float scaleWeight = weight;
            if (true == root)
            {
                scaleWeight *= height;
            }
			scaleSum = AccumulateVector3(scaleSum, scaleWeight, poseData.transformData[index].scale);
		}

		subject.transform.localPosition = positionSum;
		subject.transform.localRotation = UnityEngine.Quaternion.Euler(rotationSum.x, rotationSum.y, rotationSum.z);;
		subject.transform.localScale = scaleSum;
	}

	private void BuildHeirarchy(UnityEngine.GameObject parentGameObject, PoseData poseData, bool root)
	{
		UnityEngine.GameObject created = null;
		if (true == poseData.sphere)
		{
			UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Sphere);
			childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = _materialSphere;
			var sphereCollider = childGameObject.AddComponent<UnityEngine.SphereCollider>();
			sphereCollider.center = UnityEngine.Vector3.zero;
			sphereCollider.radius = 0.5f;
			childGameObject.transform.parent = parentGameObject.transform;
			_childGameObjectArray.Add( new GameObjectData(){poseData=poseData, gameObject=childGameObject, root=root});
			UpdatePoseTransform(childGameObject, poseData, root);
			created = childGameObject;
		}
		if (true == poseData.cube)
		{
			UnityEngine.GameObject childGameObject = UnityEngine.GameObject.CreatePrimitive(UnityEngine.PrimitiveType.Cube);
			childGameObject.GetComponent<UnityEngine.Renderer>().sharedMaterial = _materialCube;
			childGameObject.transform.parent = parentGameObject.transform;
			_childGameObjectArray.Add( new GameObjectData(){poseData=poseData, gameObject=childGameObject, root=root});
			UpdatePoseTransform(childGameObject, poseData, root);
			created = childGameObject;
		}

		if (null == created)
		{
			UnityEngine.GameObject childGameObject =new UnityEngine.GameObject();
			childGameObject.transform.parent = parentGameObject.transform;
			_childGameObjectArray.Add( new GameObjectData(){poseData=poseData, gameObject=childGameObject, root=root});
			UpdatePoseTransform(childGameObject, poseData, root);
			created = childGameObject;
		}

		for (int index = 0; index < poseData.poseDataChildren.Count; ++index)
		{
			BuildHeirarchy(created, poseData.poseDataChildren[index], false);
		}
	}


    // Start is called before the first frame update
    void Start()
    {
        UnityEngine.Debug.Log("CreatureExtraComponent.Start", this);

        //Assets/Resources/material/CreatureSkin.mat
        _materialSphere = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureSkin");
        //Assets/Resources/material/CreatureDark.mat
        _materialCube = UnityEngine.Resources.Load<UnityEngine.Material>("material/CreatureDark");

        UnityEngine.GameObject trace = gameObject;
        BuildHeirarchy(trace, _poseData, true);
    }

    // Update is called once per frame
    void Update()
    {
        UpdatePoseWeight();
        UpdatePose();
        UpdateViewElevation();
    }

    private void UpdatePoseWeight()
    {
        for (int index = 0; index < (int)TPose.Count; ++index)
        {
            float delta = UnityEngine.Time.deltaTime * 2.0f;
            if (index != (int)pose)
            {
                delta = -delta;
            }

            _poseWeight[index] = UnityEngine.Mathf.Clamp(_poseWeight[index] + delta, 0.0f, 1.0f);
        }
    }

	private void UpdatePose()
	{
		foreach ( GameObjectData gameObjectData in _childGameObjectArray)
		{
			UpdatePoseTransform(gameObjectData.gameObject, gameObjectData.poseData, gameObjectData.root);
		}
	}

    private void UpdateViewElevation()
    {
    }

}

