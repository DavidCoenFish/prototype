//https://docs.unity3d.com/Manual/GeneratingMeshGeometryProcedurally.html

public class GridComponent : UnityEngine.MonoBehaviour
{
    public float width;
    public float height;

    void Start()
    {
        UnityEngine.BoxCollider boxCollider = gameObject.AddComponent<UnityEngine.BoxCollider>();
        boxCollider.size = new UnityEngine.Vector3(width, 1.0f, height);
        boxCollider.center = new UnityEngine.Vector3(0.0f, -0.5f, 0.0f);

        //UnityEngine.MeshCollider meshCollider = gameObject.AddComponent<UnityEngine.MeshCollider>();
        UnityEngine.MeshRenderer meshRenderer = gameObject.AddComponent<UnityEngine.MeshRenderer>();
        meshRenderer.sharedMaterial = new UnityEngine.Material(UnityEngine.Shader.Find("Standard"));
        meshRenderer.sharedMaterial.mainTexture = UnityEngine.Resources.Load("texture/grid", typeof(UnityEngine.Texture2D)) as UnityEngine.Texture2D;

        UnityEngine.MeshFilter meshFilter = gameObject.AddComponent<UnityEngine.MeshFilter>();

        UnityEngine.Mesh mesh = new UnityEngine.Mesh();

        UnityEngine.Vector3[] vertices = new UnityEngine.Vector3[4]
        {
            new UnityEngine.Vector3(-(width * 0.5f), 0, -(height*0.5f)),
            new UnityEngine.Vector3((width * 0.5f), 0, -(height*0.5f)),
            new UnityEngine.Vector3(-(width * 0.5f), 0, (height*0.5f)),
            new UnityEngine.Vector3((width * 0.5f), 0, (height*0.5f))
        };
        mesh.vertices = vertices;

        int[] tris = new int[6]
        {
            // lower left triangle
            0, 2, 1,
            // upper right triangle
            2, 3, 1
        };
        mesh.triangles = tris;

        UnityEngine.Vector3[] normals = new UnityEngine.Vector3[4]
        {
            new UnityEngine.Vector3(0, 1.0f, 0),
            new UnityEngine.Vector3(0, 1.0f, 0),
            new UnityEngine.Vector3(0, 1.0f, 0),
            new UnityEngine.Vector3(0, 1.0f, 0)
        };
        mesh.normals = normals;

        UnityEngine.Vector2[] uv = new UnityEngine.Vector2[4]
        {
            new UnityEngine.Vector2(-(width * 0.5f), -(height*0.5f)),
            new UnityEngine.Vector2((width * 0.5f), -(height*0.5f)),
            new UnityEngine.Vector2(-(width * 0.5f), (height*0.5f)),
            new UnityEngine.Vector2((width * 0.5f), (height*0.5f))
        };
        mesh.uv = uv;

        meshFilter.mesh = mesh;
        //meshCollider.mesh = mesh;
    }
}
