﻿public class CreatureHud3D
{
    private CreaturePrefabCollection _prefabCollectionArm;
    private CreaturePrefabCollection _prefabCollectionArmHold;
    private CreaturePrefabCollection _prefabCollectionArmSwing;
    private CreaturePrefabCollection _prefabCollectionArmShoot;

    public CreatureHud3D()
    {
        _prefabCollectionArm = new CreaturePrefabCollection("prefab/arm");
        _prefabCollectionArmHold = new CreaturePrefabCollection("prefab/armhold");
        _prefabCollectionArmSwing = new CreaturePrefabCollection("prefab/armswing");
        _prefabCollectionArmShoot = new CreaturePrefabCollection("prefab/armshoot");
    }

    public void Update(CreatureState creatureState, UnityEngine.Transform parentTransform)
    {
        _prefabCollectionArm.Clear();
        _prefabCollectionArmHold.Clear();
        _prefabCollectionArmSwing.Clear();
        _prefabCollectionArmShoot.Clear();

        foreach( CreatureStateHud.HandPoseData handPoseData in creatureState.creatureStateHud.handPoseArray)
        {
            switch (handPoseData.handPose)
            {
                default:
                    break;
                case CreatureStateHud.THandPose.Empty:
                    _prefabCollectionArm.Request(parentTransform, handPoseData);
                    break;
                case CreatureStateHud.THandPose.Hold:
                    _prefabCollectionArmHold.Request(parentTransform, handPoseData);
                    break;
                case CreatureStateHud.THandPose.Shoot:
                    _prefabCollectionArmShoot.Request(parentTransform, handPoseData);
                    break;
                case CreatureStateHud.THandPose.Swing:
                    _prefabCollectionArmSwing.Request(parentTransform, handPoseData);
                    break;
            }
        }
    }
}
