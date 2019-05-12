import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import MaterialWrapperFactory from './../webgl/materialwrapper.js';
import ShaderWrapper from './../webgl/shaderwrapper.js';
import ComponentModelScreenQuadFactory from "./../webgl/component-model-screen-quad.js"
import ResourceManagerFactory from "./../core/resourcemanager.js";
import { sFloat, sFloat2 } from "./../webgl/shaderuniformdata.js";

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
uniform vec2 u_p0;
uniform vec2 u_p1;
uniform vec2 u_p2;
uniform float u_d;

#define PI 3.1415926538

//return the squared distance from QuadraticBezierCurve to our sample point v_uv
float distanceFunction(float t, float nullDistance){
	if ((t < 0.0) || (1.0 < t)){
		return nullDistance;
	}
	float a = (1.0 - t) * (1.0 - t);
	float b = 2.0 * t * (1.0 - t);
	float c = t * t;
	vec2 p = (a * u_p0) + (b * u_p1) + (c * u_p2);
	vec2 offset = p - v_uv;
	float distanceSquared = dot(offset, offset);
	return distanceSquared;
}

//24
// based on Olivier Besson (http://www.gludion.com)
float zeroMax = 0.0; //0.0000001;
float thirdDegreeEquationMin(float a, float b, float c, float d, float nullDistance){
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
			float result = distanceFunction(u + v + offset, nullDistance);
			return result;
		}
		else if (D < -zeroMax)
		{
			// D negative
			float u = 2.0 * sqrt(-p / 3.0);
			float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
			float result1 = distanceFunction(u * cos(v) + offset, nullDistance);
			float result2 = distanceFunction(u * cos(v + 2.0 * PI / 3.0) + offset, nullDistance);
			float result3 = distanceFunction(u * cos(v + 4.0 * PI / 3.0) + offset, nullDistance);
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
			float result1 = distanceFunction((2.0 * u) + offset, nullDistance);
			float result2 = distanceFunction(-u + offset, nullDistance);
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
				float result = distanceFunction(-c / b, nullDistance);
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
			float result1 = distanceFunction(( -b - D) / (2.0 * a), nullDistance);
			float result2 = distanceFunction(( -b + D) / (2.0 * a), nullDistance);
			float result = min(result1, result2);
			return result;
		} else if (D < -zeroMax) {
			// D negative
			return nullDistance;
		} else {
			// D zero
			float result = distanceFunction(-b / (2.0 * a), nullDistance);
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
	float distanceSquared = thirdDegreeEquationMin(a, b, c, d, 1000.0);

	//endpoints
	vec2 offset0 = p0 - samplePoint;
	vec2 offset1 = p2 - samplePoint;
	distanceSquared = min(distanceSquared, dot(offset0, offset0));
	distanceSquared = min(distanceSquared, dot(offset1, offset1));

	return sqrt(distanceSquared);
}

vec4 debugControlPoints(vec4 inputColour, vec2 p0, vec2 p1, vec2 p2, vec2 samplePoint){
	vec2 offset0 = p0 - samplePoint;
	vec2 offset1 = p1 - samplePoint;
	vec2 offset2 = p2 - samplePoint;
	float distanceSquared = dot(offset0, offset0);
	distanceSquared = min(distanceSquared, dot(offset1, offset1));
	distanceSquared = min(distanceSquared, dot(offset2, offset2));
	float ratio = step(distanceSquared, 0.000015);
	vec4 colour = mix(inputColour, vec4(1.0, 0.0, 0.0, 1.0), ratio);
	return colour;
}

void main() {
	float distance = calculateMinDistanceQuadraticBezierCurve(u_p0, u_p1, u_p2, v_uv);
	float ratio = step(distance, u_d);
	vec4 colour = mix(vec4(0.5, 0.5, 0.5, 1.0), vec4(0.0, 0.0, 0.0, 1.0), ratio);

	//float distance2 = 1.0 - distance;
	//distance2 *= distance2;
	//vec4 colour = vec4(distance2, distance2, colour2.z, 1.0);
	//colour = debugControlPoints(colour, u_p0, u_p1, u_p2, v_uv);
	
	gl_FragColor = colour;
}
`;

const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv"
];

const sUniformNameMap = {
	"u_p0" : sFloat2,
	"u_p1" : sFloat2,
	"u_p2" : sFloat2,
	"u_d" : sFloat
};

export default function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){

	var m_resourceManager = ResourceManagerFactory();
	var m_componentModelScreenQuad = ComponentModelScreenQuadFactory(m_resourceManager, in_webGLState);
	var m_material = MaterialWrapperFactory();
	var m_shader = ShaderWrapper(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);

	return function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){
		if (false === in_keepGoing){
			m_componentModelScreenQuad.destroy();
			m_shader.destroy();

			return undefined;
		}

		in_webGLState.clear(Colour4FactoryFloat32(1.0,0.0,0.0,1.0));

		in_webGLState.applyShader(m_shader, in_dataState);
		in_webGLState.applyMaterial(m_material);
		in_webGLState.drawModel(m_componentModelScreenQuad.getModel());


		return in_callback;
	};
}
