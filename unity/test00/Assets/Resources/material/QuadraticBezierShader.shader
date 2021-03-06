﻿Shader "Unlit/QuadraticBezierShader"
{
	Properties
	{
		[PerRendererData]_Color("Color", Color) = (.5, .5, .5, 1)
		[PerRendererData]_UVScale("UVScale", Vector) = (0.0, 0.0, 1.0, 1.0) //x, y, width, height
		[PerRendererData]_PointA("PointA", Vector) = (0.0, 0.0, 0.0, 0.0) //x [0..1 pos], y [0..1 pos], z [0.. radius]
		[PerRendererData]_PointB("PointB", Vector) = (0.0, 0.0, 0.0, 0.0)
		[PerRendererData]_PointC("PointC", Vector) = (0.0, 0.0, 0.0, 0.0)
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
			fixed4 _UVScale;
			fixed4 _PointA;
			fixed4 _PointB;
			fixed4 _PointC;

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

			float thicknessFunction(float t)
			{
				float a = (1.0 - t) * (1.0 - t);
				float b = 2.0 * t * (1.0 - t);
				float c = t * t;
				float thickness = (a * _PointA.z) + (b * _PointB.z) + (c * _PointC.z);
				return thickness;
			}

			//return 1.0 if sample point is inside the thickness, else 0
			float distanceFunction(float inputT, float2 p0, float2 p1, float2 p2, float2 samplePoint) {
				float t = clamp(inputT, 0.0, 1.0);
				float a = (1.0 - t) * (1.0 - t);
				float b = 2.0 * t * (1.0 - t);
				float c = t * t;
				float2 p = (a * p0) + (b * p1) + (c * p2);
				float2 offset = p - samplePoint;
				float distanceSquared = dot(offset, offset);
				float thickness = thicknessFunction(t);
				return step(distanceSquared, (thickness * thickness));
			}

			static const float PI = 3.1415926535897932384626433832795;

			// based on Olivier Besson (http://www.gludion.com)
			static const float zeroMax = 0.0; //0.0000001;
			float thirdDegreeEquationMin(float a, float b, float c, float d, float2 p0, float2 p1, float2 p2, float2 samplePoint) {
				if (zeroMax < abs(a))
				{
					// let's adopt form: x3 + ax2 + bx + d = 0
					float z = a;
					a = b / z;
					b = c / z;
					c = d / z;
					// we solve using Cardan formula: http://fr.wikipedia.org/wiki/M%C3%A9thode_de_Cardan
					float p = b - ((a * a) / 3.0);
					float q = (a * ((2.0 * a * a) - (9.0 * b)) / 27.0) + c;
					float p3 = p * p * p;
					float D = (q * q) + ((4.0 * p3) / 27.0);
					float offset = -a / 3.0;
					if (zeroMax < D)
					{
						// D positive
						z = sqrt(D);
						float u = (-q + z) / 2.0;
						float v = (-q - z) / 2.0;
						if (0.0 <= u) {
							u = pow(u, 1.0 / 3.0);
						}
						else {
							u = -pow(-u, 1.0 / 3.0);
						}
						if (0.0 <= v) {
							v = pow(v, 1.0 / 3.0);
						}
						else {
							v = -pow(-v, 1.0 / 3.0);
						}
						float result = distanceFunction(u + v + offset, p0, p1, p2, samplePoint);
						return result;
					}
					else if (D < -zeroMax)
					{
						// D negative
						float u = 2.0 * sqrt(-p / 3.0);
						float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
						float result1 = distanceFunction(u * cos(v) + offset, p0, p1, p2, samplePoint);
						float result2 = distanceFunction(u * cos(v + 2.0 * PI / 3.0) + offset, p0, p1, p2, samplePoint);
						float result3 = distanceFunction(u * cos(v + 4.0 * PI / 3.0) + offset, p0, p1, p2, samplePoint);
						float result = max(result1, max(result2, result3));
						return result;
					}
					else
					{
						// D zero
						float u = 0.0;
						if (q < 0.0) {
							u = pow(-q / 2.0, 1.0 / 3.0);
						}
						else {
							u = -pow(q / 2.0, 1.0 / 3.0);
						}
						float result1 = distanceFunction((2.0 * u) + offset, p0, p1, p2, samplePoint);
						float result2 = distanceFunction(-u + offset, p0, p1, p2, samplePoint);
						float result = max(result1, result2);
						return result;
					}
				}
				else
				{
					// a = 0, then actually a 2nd degree equation:
					// form : ax2 + bx + c = 0;
					a = b;
					b = c;
					c = d;
					if (abs(a) <= zeroMax)
					{
						if (abs(b) <= zeroMax) {
							return 0.0; //nullDistance;
						}
						else
						{
							float result = distanceFunction(-c / b, p0, p1, p2, samplePoint);
							return result;
						}
					}
					float D = (b * b) - (4.0 * a * c);
					if (D <= -zeroMax) {
						return 0.0; //nullDistance;
					}
					if (zeroMax < D) {
						// D positive
						D = sqrt(D);
						float result1 = distanceFunction((-b - D) / (2.0 * a), p0, p1, p2, samplePoint);
						float result2 = distanceFunction((-b + D) / (2.0 * a), p0, p1, p2, samplePoint);
						float result = max(result1, result2);
						return result;
					}
					else if (D < -zeroMax) {
						// D negative
						return 0.0; //nullDistance;
					}
					else {
						// D zero
						float result = distanceFunction(-b / (2.0 * a), p0, p1, p2, samplePoint);
						return result;
					}
				}
				return 0.0;
			}

			float sdCircle(float2 samplePoint, float2 p0, float2 r)
			{
				float2 offset = samplePoint - p0;
				float distanceSquared = dot(offset, offset);
				return step(distanceSquared, r * r);
			}

			// based on Olivier Besson (http://www.gludion.com)
			float sdBezier(float2 samplePoint, float2 p0, float2 p1, float2 p2) 
			{
				float2 A = p1 - p0;
				float2 B = p0 - (2.0 * p1) + p2;

				float2 sampleRelative = p0 - samplePoint;

				float a = (B.x * B.x) + (B.y * B.y);
				float b = 3.0 * ((A.x * B.x) + (A.y * B.y));
				float c = 2.0 * ((A.x * A.x) + (A.y * A.y)) + (sampleRelative.x * B.x) + (sampleRelative.y * B.y);
				float d = (sampleRelative.x * A.x) + (sampleRelative.y * A.y);
				float result = thirdDegreeEquationMin(a, b, c, d, p0, p1, p2, samplePoint);

				return result;
			}

			float sdFunction(float2 samplePoint, float2 p0, float2 p1, float2 p2)
			{
				//ensure we don't miss the endpoints
				float result0 = sdCircle(samplePoint, p0, _PointA.z);
				float result1 = sdCircle(samplePoint, p2, _PointC.z);
				float result2 = sdBezier(samplePoint, p0, p1, p2);
				return max(max(result0, result1), result2);
			}

			fixed4 frag(v2f i) : SV_Target
			{
				//float2 uv = i.uv;
				float2 uv = float2((_UVScale.z * i.uv.x) + _UVScale.x, (_UVScale.w * i.uv.y) + _UVScale.y);
				float result = sdFunction(uv, float2(_PointA.x, _PointA.y), float2(_PointB.x, _PointB.y), float2(_PointC.x, _PointC.y));
				if (0.0 == result)
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
