Shader "Unlit/QuadraticBezierShader"
{
    Properties
    {
        _Color("Color", Color) = (.5, .5, .5, 1)
        _VecP0("P0", Vector) = (0.0, 0.0, 0.0, 0.0)
        _VecP1("P1", Vector) = (0.0, 0.0, 0.0, 0.0)
        _VecP2("P2", Vector) = (0.0, 0.0, 0.0, 0.0)
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

            fixed4 _Color;
            fixed4 _VecP0;
            fixed4 _VecP1;
            fixed4 _VecP2;

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

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                //v.uv
                UNITY_TRANSFER_FOG(o,o.vertex);
                return o;
            }

            float quadraticBezier(float p0, float p1, float p2, float t)
            {
                float oneMinT = 1.0 - t;
                float result = p1 + ((oneMinT * oneMinT) * (p0 - p1)) + ((t * t) * (p2 - p1));
                return result;
            }

            // Convenient implementation of cubic polynomial solver
            // https://www.shadertoy.com/view/ltXSDB by Adam Simmons, T21 and others
            // Additionally: returns number of roots
            float4 solveCubic(float a, float b, float c)
            {
                float p = b - a * a / 3.0, p3 = p * p * p;
                float q = a * (2.0 * a * a - 9.0 * b) / 27.0 + c;
                float d = q * q + 4.0 * p3 / 27.0;
                float offset = -a / 3.0;
                if (d >= 0.) {
                    float z = sqrt(d);
                    float2 x = (float2(z, -z) - q) / 2.0;
                    float2 uv = sign(x) * pow(abs(x), float2(1.0 / 3.0, 1.0 / 3.0));
                    float temp = offset + uv.x + uv.y;
                    return float4(temp, temp, temp, 1.0);
                }
                float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
                float m = cos(v), n = sin(v) * 1.732050808;
                return float4(float3(m + m, -n - m, n - m) * sqrt(-p / 3.0) + offset, 3.0);
            }

            // https://www.shadertoy.com/view/MdXBzB 
            // Distance to quadratic bezier with 2 roots by Tom'2017
            // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
            // Find the signed distance from a point to a bezier curve without clamping
            float2 sdBezier(float2 A, float2 B, float2 C, float2 p)
            {
                // This is to prevent 3 colinear points, but there should be better solution to it.
                //x.(1−a)+y.a (mix(x,y,a)
                //B = mix(B + float2(0.0001, 0.0001), B, abs(sign(B * 2.0 - A - C)));
                {
                    float s = abs(sign(B * 2.0 - A - C));
                    float2 offset = float2(A.y - C.y, C.x - A.x) * 0.001;
                    B = lerp(B + offset, B, s);
                }

                // Calculate roots.
                float2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
                float3 k = float3(3. * dot(a, b), 2. * dot(a, a) + dot(d, b), dot(d, a)) / dot(b, b);
                float4 t = solveCubic(k.x, k.y, k.z);

                float2 dp1 = d + (c + b * t.x) * t.x;
                float d1 = dot(dp1, dp1);
                float2 dp2 = d + (c + b * t.y) * t.y;
                float d2 = dot(dp2, dp2);
                // note: 3rd root is unnecessary

                // Find closest distance and t
                float4 r = (d1 < d2) ? float4(d1, t.x, dp1) : float4(d2, t.y, dp2);

                // Sign is just cross product with gradient
                float2 g = 2. * b * r.y + c;
                float s = sign(g.x * r.w - g.y * r.z);

                return float2(s * sqrt(r.x), r.y);
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float2 result = sdBezier(float2(_VecP0.x, _VecP0.y), float2(_VecP1.x, _VecP1.y), float2(_VecP2.x, _VecP2.y), i.uv);
                float d = abs(result.x);
                float t = result.y;
                float r = 0.0;
                //fixed4 col = float4(r.x, r.y, 0.0, 1.0);
                if (t < 0.0)
                {
                    d = length(_VecP0 - i.uv);
                    t = 0.0;
                    r = _VecP0.z;
                }
                else if (1.0 < t)
                {
                    d = length(_VecP2 - i.uv);
                    t = 1.0;
                    r = _VecP2.z;
                }
                else
                {
                    r = quadraticBezier(_VecP0.z, _VecP1.z, _VecP2.z, t);
                }

                if (r < d)
                {
                    discard;
                }

                fixed4 col = _Color;
                //fixed4 col = float4(i.uv.x,i.uv.y, 0.0, 1.0);

                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG
        }
    }
}
