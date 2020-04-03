// interface to 
interface ICreatureController
{
	void ApplyInputToState(CreatureState creatureState, float timeDelta);

	void ApplyCameraToState(CreatureState creatureState, UnityEngine.Transform cameraTransform);
}
