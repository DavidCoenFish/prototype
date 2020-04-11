Shader "Unlit/CreatureFaceRatShader"
{
    Properties
    {
        [PerRendererData] _ColorSkin("ColorSkin", Color) = (0.5, 0.5, 0.5, 1)
        //[PerRendererData] _ColorDetail("ColorDetail", Color) = (0.0, 0.0, 0.0, 1)
        [PerRendererData]_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
        [PerRendererData]_PointA("PointA", Vector) = (0.0, 0.0, 0.0, 0.0) //x [0..1 pos], y [0..1 pos], z [0.. radius]
        [PerRendererData]_ForwardUp("ForwardUp", Vector) = (0.0, 0.0, 0.0, 1.0)
        //[PerRendererData]_RightData("RightData", Vector) = (1.0, 0.0, 0.0, 0.0)
        //[PerRendererData]_Data0("Data0", Vector) = (0.0, 0.0, 0.0, 0.0) //agro[0..1 on], leftBlink[0...1 closed], rightBlink[0...1], eyeDistance
        //[PerRendererData]_Data1("Data1", Vector) = (0.0, 0.0, 0.0, 0.0) //mouth[0..1 closed]
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog

            #include "UnityCG.cginc"

            fixed4 _ColorSkin;
            //fixed4 _ColorDetail;
            fixed4 _UVScale;
            fixed4 _PointA;
            fixed4 _ForwardUp;
            //fixed4 _RightData;
            //fixed4 _Data0;
            //fixed4 _Data1;

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

            float NoseDistance(float2 duv)
            {
                float2 offset = duv - float2(_PointA.x, _PointA.y);
                float2 offsetNorm = normalize(offset);
                float radius = _PointA.z;
                //radius *= max(1.0, 2.5 * dot(offsetNorm, float2(_ForwardUp.x, _ForwardUp.y)));
                ////radius *= (2.5 * clamp(dot(offset, float2(_ForwardUp.x, _ForwardUp.y)), 0.0, 1.0));
                //radius = offset.x;
                //radius *= min(1.0, 1.0 - (0.5 * (1.0 - dot(offset, float2(_ForwardUp.z, _ForwardUp.w)))));
                //radius *= dot(offset, float2(1.0, 0.0));
                //float radius = abs(offset.y);

                float offsetSquared = dot(offset, offset);
                return step(offsetSquared, radius * radius);
                //return step(0.25, duv.x * duv.y);
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float2 duv = float2((_UVScale.z * i.uv.x) + _UVScale.x, (_UVScale.w * i.uv.y) + _UVScale.y);
                //float2 duv = float2(i.uv.x, i.uv.y);

                fixed4 col = float4(0.0, 0.0, 0.0, 1.0);  //_Color;

                //col = lerp(col, _ColorSkin, step(0.25, duv.x * duv.y));
                col = lerp(col, _ColorSkin, NoseDistance(duv));

                //if (0.0 == col.w)
                //{
                //    discard;
                //}

                //fixed4 col = float4(_ForwardUp.x, _ForwardUp.y, _ForwardUp.z, 1.0);
                // apply fog
                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG
        }
    }
}
