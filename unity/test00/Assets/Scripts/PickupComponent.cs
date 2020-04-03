using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PickupComponent : MonoBehaviour
{
	public enum TPickupType
	{
		TNone = 0,
		TSlingPan,
	}
	public TPickupType pickupType;
}
