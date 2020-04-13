Shader "Unlit/CreatureFaceShader"
{
    Properties
    {
        [PerRendererData]_ColorA("ColorA", Color) = (0.5, 0.5, 0.5, 1)
        [PerRendererData]_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0)
        [PerRendererData]_Eye0("Eye0", Vector) = (0.0, 0.0, 0.0, 0.0)
        [PerRendererData]_EyeBrow0("EyeBrow0", Vector) = (0.0, 0.0, 0.0, 1.0)
        [PerRendererData]_Eye1("Eye1", Vector) = (0.0, 0.0, 0.0, 0.0)
        [PerRendererData]_EyeBrow1("EyeBrow1", Vector) = (0.0, 0.0, 0.0, 1.0)
        [PerRendererData]_Data0("Data0", Vector) = (0.0, 0.0, 0.0, 1.0)
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

            fixed4 _ColorA;
            fixed4 _UVScale;
            fixed4 _Eye0;
            fixed4 _EyeBrow0;
            fixed4 _Eye1;
            fixed4 _EyeBrow1;
            fixed4 _Data0;

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

            //x, y, rx, ry
            float DealSphere(float2 uv, float2 origin, float rx, float ry, float2 up)
            {
                float2 offset = origin - uv;
                float2 scaleUp = up / ry;
                float2 scaleRight = float2(up.y, -up.x) / rx;
                float2 localOffset = float2(dot(scaleRight, offset), dot(scaleUp, offset));
                float radiusSquared = dot(localOffset, localOffset);
                return step(radiusSquared, 1.0);
            }

            //ax, ay, ax, ay
            float DealLineSegment(float2 uv, float2 p0, float2 p1, float thickness0, float thickness1)
            {
                float2 AP = uv - p0;
                float2 AB = p1 - p0;
                float magnitudeAB = dot(AB, AB);
                float ABAPproduct = dot(AP, AB);
                float t = ABAPproduct / magnitudeAB;
                if (t < 0.0)
                {
                    return 0;
                }
                if (1.0 < t)
                {
                    return 0;
                }
                float thickness = thickness0 + (t * (thickness1 - thickness0));
                float2 nearest = p0 + (t * (p1 - p0));
                float2 offset = uv - nearest;
                float dinstanceToNearestSquared = dot(offset, offset);
                return step(dinstanceToNearestSquared, thickness * thickness);
            }

            float4 DealEyes(float4 col, float2 uv, float4 eye, float2 up)
            {
                float eyeAmount = DealSphere(uv, float2(eye.x, eye.y), eye.z, eye.w, up);
                col = lerp(col, _ColorA, eyeAmount);
                float eyeHighlight = DealSphere(uv, float2(eye.x + (eye.w * 0.25), eye.y + (eye.w * 0.25)), eye.w * 0.2, eye.w * 0.2, up);
                col = lerp(col, float4(1.0, 1.0, 1.0, 1.0), eyeAmount * eyeHighlight);

                return col;
            }


            fixed4 frag (v2f i) : SV_Target
            {
                //float2 uv = i.uv;
                float2 uv = float2((_UVScale.z * i.uv.x) + _UVScale.x, (_UVScale.w * i.uv.y) + _UVScale.y);
                float2 up = float2(_Data0.x, _Data0.y);

                float4 col = float4(0.0, 0.0, 0.0, 0.0);
                col = DealEyes(col, uv, _Eye0, up);
                col = DealEyes(col, uv, _Eye1, up);
                col = lerp(col, _ColorA, DealLineSegment(uv, float2(_EyeBrow0.x, _EyeBrow0.y), float2(_EyeBrow0.z, _EyeBrow0.w), _Data0.z, _Data0.w));
                col = lerp(col, _ColorA, DealLineSegment(uv, float2(_EyeBrow1.x, _EyeBrow1.y), float2(_EyeBrow1.z, _EyeBrow1.w), _Data0.z, _Data0.w));

                if (col.w == 0.0)
                {
                    discard;
                }

                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;

            }
            ENDCG
        }
    }
}
