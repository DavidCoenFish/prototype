import ShaderWrapperFactory from "./../../webgl/shaderwrapper.js";
import {sFloat, sMat4} from "./../../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../../webgl/materialwrapper.js";

/*
var dynamicNumberArray = in_state.m_dynamicNumberArray;
m_sphere //pos x, y, z, radius
m_data // index[white, black, red, green, blue], padding, alpha, nb [0...9]
 */

const sVertexShader = `
precision mediump float;

attribute float a_index;

uniform mat4 u_camera;

uniform mat4 u_data00; //vec4(pos x,y,z,r), vec4(c1,c2?,alpha, nb),...
uniform mat4 u_data01;
uniform mat4 u_data02;
uniform mat4 u_data03;
uniform mat4 u_data04;
uniform mat4 u_data05;
uniform mat4 u_data06;
uniform mat4 u_data07;
uniform mat4 u_data08;
uniform mat4 u_data09;
uniform mat4 u_data10;
uniform mat4 u_data11;
uniform mat4 u_data12;

varying float v_keepOrDiscard;
varying mat4 v_data0;
varying vec2 v_data1;
varying vec4 v_colour;

void main() {
	vec4 u_cameraPos = vec4(0.0,0.0,0.0,0.0);
	vec4 u_packedData = vec4(0.0,0.0,0.0,0.0);

	//step return 0 if x < edge, 1 if edge <= x
	float ratio00 = step(-0.5, a_index) * step(a_index, 0.5);
	float ratio01 = step(0.5, a_index) * step(a_index, 1.5);
	float ratio02 = step(1.5, a_index) * step(a_index, 2.5);
	float ratio03 = step(2.5, a_index) * step(a_index, 3.5);
	float ratio04 = step(3.5, a_index) * step(a_index, 4.5);
	float ratio05 = step(4.5, a_index) * step(a_index, 5.5);
	float ratio06 = step(5.5, a_index) * step(a_index, 6.5);
	float ratio07 = step(6.5, a_index) * step(a_index, 7.5);
	float ratio08 = step(7.5, a_index) * step(a_index, 8.5);
	float ratio09 = step(8.5, a_index) * step(a_index, 9.5);
	float ratio10 = step(9.5, a_index) * step(a_index, 10.5);
	float ratio11 = step(10.5, a_index) * step(a_index, 11.5);
	float ratio12 = step(11.5, a_index) * step(a_index, 12.5);
	float ratio13 = step(12.5, a_index) * step(a_index, 13.5);
	float ratio14 = step(13.5, a_index) * step(a_index, 14.5);
	float ratio15 = step(14.5, a_index) * step(a_index, 15.5);
	float ratio16 = step(15.5, a_index) * step(a_index, 16.5);
	float ratio17 = step(16.5, a_index) * step(a_index, 17.5);
	float ratio18 = step(17.5, a_index) * step(a_index, 18.5);
	float ratio19 = step(18.5, a_index) * step(a_index, 19.5);
	float ratio20 = step(19.5, a_index) * step(a_index, 20.5);
	float ratio21 = step(20.5, a_index) * step(a_index, 21.5);
	float ratio22 = step(21.5, a_index) * step(a_index, 22.5);
	float ratio23 = step(22.5, a_index) * step(a_index, 23.5);
	float ratio24 = step(23.5, a_index) * step(a_index, 24.5);
	float ratio25 = step(24.5, a_index) * step(a_index, 25.5);

	u_cameraPos = (ratio0 * u_data00[0]);
	u_packedData = (ratio0 * u_data00[1]);

	u_cameraPos = (ratio1 * u_data00[2]);
	u_packedData = (ratio1 * u_data00[3]);

	u_cameraPos = (ratio2 * u_data01[0]);
	u_packedData = (ratio2 * u_data01[1]);

	u_cameraPos = (ratio3 * u_data01[2]);
	u_packedData = (ratio3 * u_data01[3]);

	u_cameraPos = (ratio4 * u_data02[0]);
	u_packedData = (ratio4 * u_data02[1]);

	u_cameraPos = (ratio5 * u_data02[2]);
	u_packedData = (ratio5 * u_data02[3]);

	u_cameraPos = (ratio6 * u_data03[0]);
	u_packedData = (ratio6 * u_data03[1]);

	u_cameraPos = (ratio7 * u_data03[2]);
	u_packedData = (ratio7 * u_data03[3]);

	u_cameraPos = (ratio8 * u_data04[0]);
	u_packedData = (ratio8 * u_data04[1]);

	u_cameraPos = (ratio9 * u_data04[2]);
	u_packedData = (ratio9 * u_data04[3]);

	u_cameraPos = (ratio10 * u_data05[0]);
	u_packedData = (ratio10 * u_data05[1]);

	u_cameraPos = (ratio11 * u_data05[2]);
	u_packedData = (ratio11 * u_data05[3]);

	u_cameraPos = (ratio12 * u_data06[0]);
	u_packedData = (ratio12 * u_data06[1]);

	u_cameraPos = (ratio13 * u_data06[2]);
	u_packedData = (ratio13 * u_data06[3]);

	u_cameraPos = (ratio14 * u_data07[0]);
	u_packedData = (ratio14 * u_data07[1]);

	u_cameraPos = (ratio15 * u_data07[2]);
	u_packedData = (ratio15 * u_data07[3]);

	u_cameraPos = (ratio16 * u_data08[0]);
	u_packedData = (ratio16 * u_data08[1]);

	u_cameraPos = (ratio17 * u_data08[2]);
	u_packedData = (ratio17 * u_data08[3]);

	u_cameraPos = (ratio18 * u_data09[0]);
	u_packedData = (ratio18 * u_data09[1]);

	u_cameraPos = (ratio19 * u_data09[2]);
	u_packedData = (ratio19 * u_data09[3]);

	u_cameraPos = (ratio20 * u_data10[0]);
	u_packedData = (ratio20 * u_data10[1]);

	u_cameraPos = (ratio21 * u_data10[2]);
	u_packedData = (ratio21 * u_data10[3]);

	u_cameraPos = (ratio22 * u_data11[0]);
	u_packedData = (ratio22 * u_data11[1]);

	u_cameraPos = (ratio23 * u_data11[2]);
	u_packedData = (ratio23 * u_data11[3]);

	u_cameraPos = (ratio24 * u_data12[0]);
	u_packedData = (ratio24 * u_data12[1]);

	u_cameraPos = (ratio25 * u_data12[2]);
	u_packedData = (ratio25 * u_data12[3]);

	vec4 u_cameraAtFovhradian = u_camera[0];
	vec3 u_cameraAt = u_cameraAtFovhradian.xyz;
	float u_fovhradian = u_cameraAtFovhradian.w;
	vec4 u_cameraLeftViewportWidth = u_camera[1];
	vec3 u_cameraLeft = u_cameraLeftViewportWidth.xyz;
	vec4 u_cameraUpViewportHeight = u_camera[2];
	vec3 u_cameraUp = u_cameraUpViewportHeight.xyz;
	vec2 u_viewportWidthHeight = vec2(u_cameraLeftViewportWidth.w, u_cameraUpViewportHeight.w);
	vec4 u_cameraPosCameraFar = u_camera[3];
	vec3 u_cameraPos = u_cameraPosCameraFar.xyz;
	float u_cameraFar = u_cameraPosCameraFar.w;

	vec3 cameraToAtom = a_sphere.xyz - u_cameraPos;

	float cameraSpaceX = -dot(cameraToAtom, u_cameraLeft);
	float cameraSpaceY = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0));
	float maxRadian = 0.5 * u_fovhradian * (length(u_viewportWidthHeight) / u_viewportWidthHeight.x);
	v_keepOrDiscard = 1.0 - (polarR / maxRadian);

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float width = u_viewportWidthHeight.x;
	float height = u_viewportWidthHeight.y;
	float fovHHalfRadians = u_fovhradian * 0.5;
	float screenR = polarR / fovHHalfRadians; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = cameraSpaceLength / u_cameraFar;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float sphereRadiusAngleRadians = asin(a_sphere.w / cameraSpaceLength);
	float pixelDiameter = width * (sphereRadiusAngleRadians / fovHHalfRadians);
	//float pixelDiameterB = (screenR * width) * tan(sphereRadiusAngleRadians);
	pixelDiameter += max(0.0, ((1.0 * screenR * width) * tan(sphereRadiusAngleRadians)));

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pixelDiameter;

	//vec4(c1,c2?,alpha, nb)
	float nb = u_packedData.w;
	float nb00 = step(-0.5, nb) * step(nb, 0.5);
	float nb01 = step(0.5, nb) * step(nb, 1.5);
	float nb02 = step(1.5, nb) * step(nb, 2.5);
	float nb03 = step(2.5, nb) * step(nb, 3.5);
	float nb04 = step(3.5, nb) * step(nb, 4.5);
	float nb05 = step(4.5, nb) * step(nb, 5.5);
	float nb06 = step(5.5, nb) * step(nb, 6.5);
	float nb07 = step(6.5, nb) * step(nb, 7.5);
	float nb08 = step(7.5, nb) * step(nb, 8.5);
	float nb09 = step(8.5, nb) * step(nb, 9.5);

	v_data0 = mat4(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
	v_data1 = vec2(0.0, 0.0);

	//0
	v_data0 += (nb00 * mat4(0.375, 0.5, 0.375, 0.75, 0.5, 0.75, 0.625, 0.75, 0.625, 0.5, 0.625, 0.25, 0.5, 0.25, 0.375, 0.25));
	v_data1 += (nb00 * vec2(0.375, 0.5));

	//1
	v_data0 += (nb01 * mat4(0.437, 0.675, 0.48, 0.7, 0.5, 0.75, 0.5, 0.5, 0.5, 0.25, 0.5, 0.25, 0.4, 0.25, 0.5, 0.25));
	v_data1 += (nb01 * vec2(0.6, 0.25));

	//2
	v_data0 += (nb02 * mat4(0.40, 0.67, 0.5, 0.79, 0.58, 0.71, 0.65, 0.62, 0.52, 0.52, 0.41, 0.46, 0.375, 0.25, 0.5, 0.25));
	v_data1 += (nb02 * vec2(0.625, 0.25));

	//3
	v_data0 += (nb03 * mat4(0.4, 0.67, 0.5, 0.79, 0.58, 0.71, 0.65, 0.62, 0.52, 0.52, 0.65, 0.38, 0.58, 0.29, 0.5, 0.21));
	v_data1 += (nb03 * vec2(0.4, 0.29));

	//4
	v_data0 += (nb04 * mat4(0.53, 0.25, 0.53, 0.5, 0.53, 0.75, 0.375, 0.625, 0.375, 0.5, 0.5, 0.5, 0.625, 0.5, 0.625, 0.5));
	v_data1 += (nb04 * vec2(0.625, 0.5));

	//5
	v_data0 += (nb05 * mat4(0.56, 0.75, 0.52, 0.75, 0.47, 0.75, 0.45, 0.66, 0.43, 0.52, 0.58, 0.58, 0.6, 0.4, 0.61, 0.2));
	v_data1 += (nb05 * vec2(0.42, 0.26));

	//6
	v_data0 += (nb06 * mat4(0.55, 0.75, 0.45, 0.59, 0.41, 0.46, 0.375, 0.25, 0.5, 0.25, 0.59, 0.25, 0.6, 0.375, 0.59, 0.59));
	v_data1 += (nb06 * vec2(0.43, 0.515));

	//7
	v_data0 += (nb07 * mat4(0.41, 0.75, 0.5, 0.74, 0.59, 0.75, 0.5, 0.5, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25, 0.5, 0.25));
	v_data1 += (nb07 * vec2(0.5, 0.25));

	//8
	v_data0 += (nb08 * mat4(0.5, 0.52, 0.32, 0.73, 0.5, 0.75, 0.68, 0.73, 0.5, 0.52, 0.31, 0.26, 0.5, 0.25, 0.69, 0.26));
	v_data1 += (nb08 * vec2(0.5, 0.53));
	
	//9
	v_data0 += (nb09 * mat4(0.45, 0.25, 0.55, 0.41, 0.59, 0.54, 0.625, 0.75, 0.5, 0.75, 0.41, 0.75, 0.4, 0.625, 0.41, 0.41));
	v_data1 += (nb09 * vec2(0.57, 0.485));

	//vec4(c1,c2?,alpha, nb)
	float c1 = u_packedData.x;
	float c00 = step(-0.5, c1) * step(c1, 0.5);
	float c01 = step(0.5, c1) * step(c1, 1.5);
	float c02 = step(1.5, c1) * step(c1, 2.5);
	float c03 = step(2.5, c1) * step(c1, 3.5);
	float c04 = step(3.5, c1) * step(c1, 4.5);

	v_colour = vec4(0.0, 0.0, 0.0, 0.0);
	v_colour.xyz += c00 * vec4(1.0, 1.0, 1.0);
	v_colour.xyz += c01 * vec4(0.0, 0.0, 0.0);
	v_colour.xyz += c02 * vec4(1.0, 0.0, 0.0);
	v_colour.xyz += c03 * vec4(0.0, 1.0, 0.0);
	v_colour.xyz += c04 * vec4(0.0, 0.0, 1.0);
	v_colour.w = u_packedData.z;
}
`;

const sFragmentShader = `
precision mediump float;

uniform float u_lineThickness;

varying float v_keepOrDiscard;
varying mat4 v_data0;
varying vec2 v_data1;
varying vec4 v_colour;

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
	// vec2 low = min(p0, min(p1, p2)) - vec2(u_d, u_d);
	// vec2 high = max(p0, max(p1, p2)) + vec2(u_d, u_d);
	// if ((samplePoint.x < low.x) || 
	// 	(samplePoint.y < low.y) ||
	// 	(high.x < samplePoint.x) ||
	// 	(high.y < samplePoint.y)){
	// 	return distance;
	// }

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
	float result = mix(distance, 0.0, ratio);
	return result;
}

//threashHold, u_data2, u_data3, 0.5, v_uv
float GetFactor(float threashold, mat4 data0, vec2 data1, vec2 samplePoint, float in_maxDistance){
	float distance = in_maxDistance;
	
	vec2 p0 = data0[0].xy;
	vec2 p1 = data0[0].zw;
	vec2 p2 = data0[1].xy;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);

	p0 = p2;
	p1 = data0[1].zw;
	p2 = data0[2].xy;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);

	p0 = p2;
	p1 = data0[2].zw;
	p2 = data0[3].xy;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);

	p0 = p2;
	p1 = data0[3].zw;
	p2 = data1;
	distance = calculateSmallerDistanceQuadraticBezierCurve(distance, p0, p1, p2, samplePoint);

	return distance;
}

void main() {
	if (v_keepOrDiscard <= 0.0) {
		discard;
	}

	float distance = GetFactor(v_data0, v_data1, v_uv, 1000.0);
	if (u_lineThickness < distance){
		discard;
	}

	gl_FragColor = v_colour;
}
`;

const sVertexAttributeNameArray = [
	"a_index",
];
const sUniformNameMap = {
	"u_lineThickness" : sFloat, 
	"u_camera" : sMat4,
};


export default function(in_resourceManager, in_webGLState, in_state){
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true,
		"LESS",
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		true
	);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_model = ModelWrapperFactory(
		in_webGLState, "POINTS", 26, {
			"a_index" : ModelDataStream(in_webGLState, "FLOAT", 1, new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]), "STATIC_DRAW", true)
		}, undefined);

	var m_data = [];
	for (var index = 0; index < 13; ++index){
		m_data.push(Matrix44FactoryFloat32());
	}

	const m_state = Object.assign({
		"u_lineThickness" : 0.01,

		"u_data00" : m_data[0].getRaw(),
		"u_data01" : m_data[1].getRaw(),
		"u_data02" : m_data[2].getRaw(),
		"u_data03" : m_data[3].getRaw(),
		"u_data04" : m_data[4].getRaw(),
		"u_data05" : m_data[5].getRaw(),
		"u_data06" : m_data[6].getRaw(),
		"u_data07" : m_data[7].getRaw(),
		"u_data08" : m_data[8].getRaw(),
		"u_data09" : m_data[9].getRaw(),
		"u_data10" : m_data[10].getRaw(),
		"u_data11" : m_data[11].getRaw(),
		"u_data12" : m_data[12].getRaw()

	}, in_state);

	//public methods ==========================
	const result = Object.create({
		"update" : function(){
			var dynamicNumberArray = in_state.m_dynamicNumberArray;
			var arrayCount = dynamicNumberArray.length;
			if (0 === arrayCount){
				return;
			}

			in_webGLState.applyMaterial(m_material);

			var trace = 0;
			var drawCount = 0;
			while (trace < arrayCount){
				var innerTrace = 0;
				var dataIndex = 0;
				var dataSubIndex = 0;

				while ((innerTrace < 26) && (trace < arrayCount)){
					var dataRaw = m_data[dataIndex].getRaw();
					dataRaw[dataSubIndex + 0] = dynamicNumberArray[trace].m_sphere.getX();
					dataRaw[dataSubIndex + 1] = dynamicNumberArray[trace].m_sphere.getY();
					dataRaw[dataSubIndex + 2] = dynamicNumberArray[trace].m_sphere.getZ();
					dataRaw[dataSubIndex + 3] = dynamicNumberArray[trace].m_sphere.getW();
					dataSubIndex += 4;
					if (16 <= dataSubIndex){
						dataSubIndex = 0;
						dataIndex += 1;
					}

					var dataRaw = m_data[dataIndex].getRaw();
					dataRaw[dataSubIndex + 0] = dynamicNumberArray[trace].m_data.getX();
					dataRaw[dataSubIndex + 1] = dynamicNumberArray[trace].m_data.getY();
					dataRaw[dataSubIndex + 2] = dynamicNumberArray[trace].m_data.getZ();
					dataRaw[dataSubIndex + 3] = dynamicNumberArray[trace].m_data.getW();
					dataSubIndex += 4;
					if (16 <= dataSubIndex){
						dataSubIndex = 0;
						dataIndex += 1;
					}
					
					trace++;
					innerTrace++;
					drawCount = innerTrace;
				}
			}

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.drawModel(m_model, 0, drawCount);

			return;
		},
		"destroy" : function(){
			m_shader.destroy();
			m_model.destroy();
			return;
		}
	});

	return result;

}
