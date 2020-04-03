using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LocatorComponent : MonoBehaviour
{
	public enum TLocatorType
	{
		TNone,
		TPickup,
		TOpponent,
		TOpponentKO,
		TOpponentAgro,
		TGhost,
		TGate
	}
	public TLocatorType locatorType;

}
