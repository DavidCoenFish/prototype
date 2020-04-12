Shader "Unlit/SphereShader"
{
	Properties
	{
		[PerRendererData] _Color("Color", Color) = (.5, .5, .5, 1)
		[PerRendererData]_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
		[PerRendererData]_PointA("PointA", Vector) = (0.0, 0.0, 0.0, 0.0) //x [0..1 pos], y [0..1 pos], z [0.. radius]
	}
		SubShader
	{
		Tags { "RenderType" = "Opaque" }
		LOD 100

		Pass
		{
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			// make fog work
			#pragma multi_compile_fog

			#include "UnityCG.cginc"

			fixed4 _Color;
			fixed4 _UVScale;
			fixed4 _PointA;

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				UNITY_FOG_COORDS(1)
				float4 vertex : SV_POSITION;
				float2 uv : TEXCOORD0;
			};

			v2f vert(appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = v.uv;
				//v.uv
				UNITY_TRANSFER_FOG(o,o.vertex);
				return o;
			}

			fixed4 frag(v2f i) : SV_Target
			{
				//float2 uv = i.uv;
				float2 uv = float2((_UVScale.z * i.uv.x) + _UVScale.x, (_UVScale.w * i.uv.y) + _UVScale.y);
				float2 offset = uv - float2(_PointA.x, _PointA.y);
				float distanceSquared = dot(offset, offset);

				if (_PointA.z * _PointA.z < distanceSquared)
				{
					discard;
				}

				fixed4 col = _Color;
				UNITY_APPLY_FOG(i.fogCoord, col);
				return col;
			}


			ENDCG
		}
	}
}
