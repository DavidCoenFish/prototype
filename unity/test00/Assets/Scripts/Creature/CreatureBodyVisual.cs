/*
need to get the data to describe the body from somewhere
this class looks after the visual representation of the creature
 */
public class CreatureBodyVisual
{
    private CreatureBodyVisualSphere _creatureBodyVisualSphere = null;
    private CreatureBodyVisualSpline _creatureBodyVisualSpline = null;
    private CreatureBodyVisualFace _creatureBodyVisualFace = null;

    private CreatureBodyVisualDebug _creatureBodyVisualDebug = null;

    public CreatureBodyVisual()
    {
        _creatureBodyVisualDebug = new CreatureBodyVisualDebug();

        _creatureBodyVisualSphere = new CreatureBodyVisualSphere();
        _creatureBodyVisualSpline = new CreatureBodyVisualSpline();
        _creatureBodyVisualFace = new CreatureBodyVisualFace();
    }

    public void Update(CreatureState creatureState, UnityEngine.Transform parentTransform)
    {
        _creatureBodyVisualDebug.Update(creatureState, parentTransform);

        _creatureBodyVisualSphere.Update(creatureState, parentTransform);
        _creatureBodyVisualSpline.Update(creatureState, parentTransform);
        _creatureBodyVisualFace.Update(creatureState, parentTransform);
    }
}
