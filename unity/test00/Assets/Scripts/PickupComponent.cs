using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PickupComponent : MonoBehaviour
{
	public enum TPickupType
	{
		TNone = 0,
		TBanjo,
		TUkulele,
		THarp,
		TConcertina, //small accordion
		TBandoneon, //tango box accordion
	}
	public TPickupType pickupType;
}
