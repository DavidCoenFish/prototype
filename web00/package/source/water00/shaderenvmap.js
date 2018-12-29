const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
varying vec2 v_position;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_position = a_position;
}
`;

//radius of sun 695700km
//earth to sun 149.6 million km, 149598261km

const sFragmentShader = `
precision mediump float;
varying vec2 v_position;
uniform vec2 u_sunAzimuthAltitude; //degrees
uniform vec3 u_sunTint;
uniform vec2 u_sunRange; //degrees
uniform vec3 u_skyTint;
uniform float u_skySpread;
uniform float u_skyTurbitity;

//angles in degrees
vec3 calcSkyDomeColor(float gamma){
	float ratio = (1.0 - smoothstep(u_sunRange.x, u_sunRange.y, gamma));
	vec3 sky = u_skyTint * exp(u_skySpread * radians(gamma));
	vec3 result = mix(sky, u_sunTint, ratio);
	return result;
}

float calcOpticalMass(float height0, float theta, float length){
	float cosTheta = cos(radians(theta));
	float val0 = exp(height0 / 7000.0);
	float val1 = exp((height0 - (cosTheta * length)) / 7000.0);
	float result = ((val0 - val1) * (-9100.0)) / cosTheta;
	return result;
}

void main() {
	vec2 viewXY = v_position;
	float distSquared = dot(viewXY, viewXY);
	if (1.0 < distSquared){
		discard;
	}
	float viewZ = sqrt(1.0 - distSquared);
	vec3 viewNorm = vec3(viewXY.x, viewXY.y, viewZ);

	float sunZ = sin(radians(u_sunAzimuthAltitude.y));
	float sunXY = cos(radians(u_sunAzimuthAltitude.y));
	vec3 sunNorm = vec3(cos(radians(u_sunAzimuthAltitude.x)) * sunXY, sin(radians(u_sunAzimuthAltitude.x)) * sunXY, sunZ);

	float angleSunViewDegrees = degrees(acos(dot(viewNorm, sunNorm)));

	float angleViewZenithDegrees = degrees(acos(viewZ));
	float angleSunZenithDegrees = 90.0 - u_sunAzimuthAltitude.y;

	vec3 skyDomeColor = calcSkyDomeColor(angleSunViewDegrees);
	float opticalMass = calcOpticalMass(2.0, angleViewZenithDegrees, 7000.0);
	float tempOM = (opticalMass / 1000.0);
	tempOM *= tempOM;
	tempOM /= 100.0;
	vec3 rgb = skyDomeColor + tempOM;
	gl_FragColor = vec4(rgb, 1.0);
}`;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = [
	"u_sunAzimuthAltitude",
	"u_sunTint",
	"u_sunRange",
	"u_skyTint",
	"u_skySpread",
	"u_skyTurbitity",
	];

const factory = function(in_webGLContextWrapper, in_uniformServer){
	return WebGL.ShaderWrapper.factory(
		in_webGLContextWrapper, 
		sVertexShader, 
		sFragmentShader, 
		in_uniformServer, 
		sVertexAttributeNameArray, 
		sUniformNameArray);
}

module.exports = {
	"factory" : factory,
};