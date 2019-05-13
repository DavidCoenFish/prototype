import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import MaterialWrapperFactory from './../webgl/materialwrapper.js';
import ShaderWrapper from './../webgl/shaderwrapper.js';
import ComponentModelScreenQuadFactory from "./../webgl/component-model-screen-quad.js"
import ResourceManagerFactory from "./../core/resourcemanager.js";
import { sFloat, sFloat2, sMat4 } from "./../webgl/shaderuniformdata.js";
import {factoryFloat32 as Mat4FactoryFloat} from "./../core/matrix44.js";

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	v_uv = a_uv;
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform mat4 u_data0;
uniform vec2 u_data1;
uniform mat4 u_data2;
uniform vec2 u_data3;
uniform float u_d;

#define PI 3.1415926538

//return the squared distance from QuadraticBezierCurve to our sample point v_uv
float distanceFunction(float t, float nullDistance, vec2 p0, vec2 p1, vec2 p2, vec2 samplePoint){
	if ((t < 0.0) || (1.0 < t)){
		return nullDistance;
	}
	float a = (1.0 - t) * (1.0 - t);
	float b = 2.0 * t * (1.0 - t);
	float c = t * t;
	vec2 p = (a * p0) + (b * p1) + (c * p2);
	vec2 offset = p - samplePoint;
	float distanceSquared = dot(offset, offset);
	return distanceSquared;
}

//24
// based on Olivier Besson (http://www.gludion.com)
float zeroMax = 0.0; //0.0000001;
float thirdDegreeEquationMin(float a, float b, float c, float d, float nullDistance, vec2 p0, vec2 p1, vec2 p2, vec2 samplePoint){
	if (zeroMax < abs(a))
	{
		//30: let's adopt form: x3 + ax2 + bx + d = 0
		float z = a;
		a = b / z;
		b = c / z;
		c = d / z;
		//35: we solve using Cardan formula: http://fr.wikipedia.org/wiki/M%C3%A9thode_de_Cardan
		float p = b - ((a * a) / 3.0);
		float q = (a * ((2.0 * a * a) - (9.0 * b)) / 27.0) + c;
		float p3 = p * p * p;
		float D = (q * q) + ((4.0 * p3) / 27.0);
		float offset = -a / 3.0;
		if (zeroMax < D)
		{
			//43: D positive
			z = sqrt(D);
			float u = ( -q + z) / 2.0;
			float v = ( -q - z) / 2.0;
			if (0.0 <= u){
				u = pow(u, 1.0 / 3.0);
			} else {
				u = -pow( -u, 1.0 / 3.0);
			}
			if (0.0 <= v){
				v = pow(v, 1.0 / 3.0);
			} else {
				v = -pow( -v, 1.0 / 3.0);
			}
			float result = distanceFunction(u + v + offset, nullDistance, p0, p1, p2, samplePoint);
			return result;
		}
		else if (D < -zeroMax)
		{
			// D negative
			float u = 2.0 * sqrt(-p / 3.0);
			float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
			float result1 = distanceFunction(u * cos(v) + offset, nullDistance, p0, p1, p2, samplePoint);
			float result2 = distanceFunction(u * cos(v + 2.0 * PI / 3.0) + offset, nullDistance, p0, p1, p2, samplePoint);
			float result3 = distanceFunction(u * cos(v + 4.0 * PI / 3.0) + offset, nullDistance, p0, p1, p2, samplePoint);
			float result = min(result1, min(result2, result3));
			return result;
		}
		else
		{
			// D zero
			float u = 0.0;
			if (q < 0.0){
				 u = pow( -q / 2.0, 1.0 / 3.0);
			} else {
				u = -pow( q / 2.0, 1.0 / 3.0);
			}
			float result1 = distanceFunction((2.0 * u) + offset, nullDistance, p0, p1, p2, samplePoint);
			float result2 = distanceFunction(-u + offset, nullDistance, p0, p1, p2, samplePoint);
			float result = min(result1, result2);
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
			if (abs(b) <= zeroMax){
				return nullDistance;
			}
			else 
			{
				float result = distanceFunction(-c / b, nullDistance, p0, p1, p2, samplePoint);
				return result;
			}
		}
		float D = (b*b) - (4.0*a*c);
		if (D <= - zeroMax){
			return nullDistance;
		}
		if (zeroMax < D) {
			// D positive
			D = sqrt(D);
			float result1 = distanceFunction(( -b - D) / (2.0 * a), nullDistance, p0, p1, p2, samplePoint);
			float result2 = distanceFunction(( -b + D) / (2.0 * a), nullDistance, p0, p1, p2, samplePoint);
			float result = min(result1, result2);
			return result;
		} else if (D < -zeroMax) {
			// D negative
			return nullDistance;
		} else {
			// D zero
			float result = distanceFunction(-b / (2.0 * a), nullDistance, p0, p1, p2, samplePoint);
			return result;
		}
	}
	return nullDistance;
}

// based on Olivier Besson (http://www.gludion.com)
float calculateMinDistanceQuadraticBezierCurve(vec2 p0, vec2 p1, vec2 p2, vec2 samplePoint){
	vec2 A = p1 - p0;
	vec2 B = p0 - (2.0 * p1) + p2;

	vec2 sampleRelative = p0 - samplePoint;

	float a = (B.x * B.x) + (B.y * B.y);
	float b = 3.0 * ((A.x * B.x) + (A.y * B.y));
	float c = 2.0 * ((A.x * A.x) + (A.y * A.y)) + (sampleRelative.x * B.x) + (sampleRelative.y * B.y);
	float d = (sampleRelative.x * A.x) + (sampleRelative.y * A.y);
	float distanceSquared = thirdDegreeEquationMin(a, b, c, d, 1000.0, p0, p1, p2, samplePoint);

	//endpoints
	vec2 offset0 = p0 - samplePoint;
	vec2 offset1 = p2 - samplePoint;
	distanceSquared = min(distanceSquared, dot(offset0, offset0));
	distanceSquared = min(distanceSquared, dot(offset1, offset1));

	return distanceSquared;
}

float calculateSmallerDistanceQuadraticBezierCurve(float distance, vec2 p0, vec2 p1, vec2 p2, vec2 samplePoint){
	//do a bounding box check? if closer than u_d to bounding box, need to check 
	vec2 low = min(p0, min(p1, p2)) - vec2(u_d, u_d);
	vec2 high = max(p0, max(p1, p2)) + vec2(u_d, u_d);
	if ((samplePoint.x < low.x) || 
		(samplePoint.y < low.y) ||
		(high.x < samplePoint.x) ||
		(high.y < samplePoint.y)){
		return distance;
	}

	float result = min(distance, calculateMinDistanceQuadraticBezierCurve(p0, p1, p2, samplePoint));
	return result;
}

float debugControlPoints(float distance, vec2 p0, vec2 p1, vec2 p2, vec2 samplePoint){
	vec2 offset0 = p0 - samplePoint;
	vec2 offset1 = p1 - samplePoint;
	vec2 offset2 = p2 - samplePoint;
	float distanceSquared = dot(offset0, offset0);
	distanceSquared = min(distanceSquared, dot(offset1, offset1));
	distanceSquared = min(distanceSquared, dot(offset2, offset2));
	float ratio = step(distanceSquared, 0.000015);
	float result = mix(0.0, distance, ratio);
	return result;
}

float GetFactor(float threashold, mat4 data0, vec2 data1, float dark, vec2 samplePoint){
	float distance = 1000.0;
	
	vec2 p0 = data0[0].xy;
	vec2 p1 = data0[0].zw;
	vec2 p2 = data0[1].xy;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);
	distance = debugControlPoints(distance, p0, p1, p2, samplePoint);

	p0 = p2;
	p1 = data0[1].zw;
	p2 = data0[2].xy;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);
	distance = debugControlPoints(distance, p0, p1, p2, samplePoint);

	p0 = p2;
	p1 = data0[2].zw;
	p2 = data0[3].xy;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);
	distance = debugControlPoints(distance, p0, p1, p2, samplePoint);

	p0 = p2;
	p1 = data0[3].zw;
	p2 = data1;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);
	distance = debugControlPoints(distance, p0, p1, p2, samplePoint);

	float ratio = step(distance, threashold);
	float result = mix(dark, 1.0, ratio);
	return result;
}

void main() {
	vec4 colour = vec4(1.0, 1.0, 1.0, 1.0);
	float threashHold = u_d * u_d;
	colour.rgb *= GetFactor(threashHold, u_data0, u_data1, 0.0, v_uv);
	colour.rgb *= GetFactor(threashHold, u_data2, u_data3, 0.5, v_uv);
	
	gl_FragColor = colour;
}
`;

const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv"
];

const sUniformNameMap = {
	"u_d" : sFloat,
	"u_data0" : sMat4,
	"u_data1" : sFloat2,
	"u_data2" : sMat4,
	"u_data3" : sFloat2
};

export default function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){

	var m_resourceManager = ResourceManagerFactory();
	var m_componentModelScreenQuad = ComponentModelScreenQuadFactory(m_resourceManager, in_webGLState);
	var m_material = MaterialWrapperFactory();
	var m_shader = ShaderWrapper(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);

	var m_data0 = Mat4FactoryFloat();
	var m_data2 = Mat4FactoryFloat();
	var m_state = {
		"u_d" : in_dataState.u_d,
		"u_data0" : m_data0.getRaw(), //16
		"u_data1" : in_dataState.u_p8,
		"u_data2" : m_data2.getRaw(), //16
		"u_data3" : in_dataState.u_r8
	};

	return function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){
		if (false === in_keepGoing){
			m_componentModelScreenQuad.destroy();
			m_shader.destroy();

			return undefined;
		}

		m_state["u_d"] = in_dataState.u_d;
		m_data0.set00(in_dataState.u_p0[0]);
		m_data0.set10(in_dataState.u_p0[1]);
		m_data0.set20(in_dataState.u_p1[0]);
		m_data0.set30(in_dataState.u_p1[1]);
		m_data0.set01(in_dataState.u_p2[0]);
		m_data0.set11(in_dataState.u_p2[1]);
		m_data0.set21(in_dataState.u_p3[0]);
		m_data0.set31(in_dataState.u_p3[1]);
		m_data0.set02(in_dataState.u_p4[0]);
		m_data0.set12(in_dataState.u_p4[1]);
		m_data0.set22(in_dataState.u_p5[0]);
		m_data0.set32(in_dataState.u_p5[1]);
		m_data0.set03(in_dataState.u_p6[0]);
		m_data0.set13(in_dataState.u_p6[1]);
		m_data0.set23(in_dataState.u_p7[0]);
		m_data0.set33(in_dataState.u_p7[1]);

		m_data2.set00(in_dataState.u_r0[0]);
		m_data2.set10(in_dataState.u_r0[1]);
		m_data2.set20(in_dataState.u_r1[0]);
		m_data2.set30(in_dataState.u_r1[1]);
		m_data2.set01(in_dataState.u_r2[0]);
		m_data2.set11(in_dataState.u_r2[1]);
		m_data2.set21(in_dataState.u_r3[0]);
		m_data2.set31(in_dataState.u_r3[1]);
		m_data2.set02(in_dataState.u_r4[0]);
		m_data2.set12(in_dataState.u_r4[1]);
		m_data2.set22(in_dataState.u_r5[0]);
		m_data2.set32(in_dataState.u_r5[1]);
		m_data2.set03(in_dataState.u_r6[0]);
		m_data2.set13(in_dataState.u_r6[1]);
		m_data2.set23(in_dataState.u_r7[0]);
		m_data2.set33(in_dataState.u_r7[1]);

		in_webGLState.applyShader(m_shader, m_state);
		in_webGLState.applyMaterial(m_material);
		in_webGLState.drawModel(m_componentModelScreenQuad.getModel());


		return in_callback;
	};
}
